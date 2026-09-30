import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductGrid } from "@/components/shop/product-card";
import { Container, Eyebrow, SectionHeading } from "@/components/ui";
import { clusterForCollection, getCluster } from "@/config/clusters";
import { policies, shipping, site } from "@/config/site";
import { formatCents } from "@/lib/money";
import {
  getPostsBySlugs,
  getPostsForProduct,
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/queries";
import { breadcrumbLd, metaDescription, pageMetadata, productLd } from "@/lib/seo";

export const revalidate = 600;
export const dynamicParams = true;

/** Prerender the catalogue at build time; anything added later renders on first hit. */
export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return pageMetadata({
      title: "Piece not found",
      description: "That piece is no longer in the catalogue.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: product.seoTitle || `${product.name} — ${product.material}`,
    description: metaDescription(product.seoDescription || product.summary),
    path: `/products/${product.slug}`,
    keywords: [product.name, product.material, product.collection, "hand forged", site.city],
    image: product.images[0],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // The journal links back to the money page: the articles that recommend
  // this piece, or failing any, the guide that covers its collection.
  const guideCluster = clusterForCollection(product.collection);
  const [related, recommendedIn, guide] = await Promise.all([
    getRelatedProducts(product.collection, product.id, 3),
    getPostsForProduct(product.slug, 3),
    guideCluster ? getPostsBySlugs([guideCluster.pillar]) : Promise.resolve([]),
  ]);
  const journal = [
    ...recommendedIn,
    ...guide.filter((pillar) => !recommendedIn.some((post) => post.id === pillar.id)),
  ].slice(0, 3);
  const inStock = product.stock > 0;

  const details = [
    { label: "Reference", value: product.reference },
    { label: "Material", value: product.material },
    ...(product.dimensions ? [{ label: "Dimensions", value: product.dimensions }] : []),
    ...(product.weight ? [{ label: "Weight", value: product.weight }] : []),
    { label: "Lead time", value: product.leadTime },
  ];

  return (
    <>
      <JsonLd
        data={[
          productLd({
            slug: product.slug,
            name: product.name,
            summary: product.summary,
            material: product.material,
            priceCents: product.priceCents,
            currency: product.currency,
            stock: product.stock,
            reference: product.reference,
            images: product.images,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      <Container className="py-8">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-faint">
          <Link href="/products" className="transition-colors hover:text-gold">
            Products
          </Link>
          <span className="mx-2.5">/</span>
          <span className="text-muted">{product.collection}</span>
        </nav>
      </Container>

      <section className="pb-16 md:pb-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.images}
            label={product.imageSlot}
            name={product.name}
          />

          <div className="flex flex-col gap-7 lg:pt-4">
            <div className="flex flex-col gap-4">
              <Eyebrow>
                {product.reference} · {product.collection}
              </Eyebrow>
              <h1 className="text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.08]">
                {product.name}
              </h1>
              <p className="text-[17px] leading-[1.75] text-muted">{product.summary}</p>
            </div>

            <div className="flex flex-wrap items-baseline gap-4 border-y border-ink/12 py-6">
              <span className="font-serif text-[2.25rem] font-normal leading-none lining-nums">
                {formatCents(product.priceCents, product.currency)}
              </span>
              <span className="text-[13px] text-faint">
                {inStock ? `${product.stock} in stock · ${product.leadTime}` : product.leadTime}
              </span>
            </div>

            <AddToCart
              inStock={inStock}
              line={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                material: product.material,
                reference: product.reference,
                unitCents: product.priceCents,
                imageSlot: product.imageSlot,
                image: product.images[0] ?? null,
              }}
            />

            <p className="text-[13px] leading-relaxed text-faint">
              Free shipping over {formatCents(shipping.freeThresholdCents)}. {policies.warranty}.{" "}
              <Link href="/shipping" className="border-b border-gold pb-0.5 text-muted hover:text-gold">
                Shipping and returns
              </Link>
              .
            </p>

            <Markdown content={product.description} className="mt-2" />

            <dl className="mt-2 border-t border-ink/12">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between gap-6 border-b border-ink/8 py-3.5 text-[14px]"
                >
                  <dt className="text-faint">{detail.label}</dt>
                  <dd className="text-right text-ink-soft">{detail.value}</dd>
                </div>
              ))}
            </dl>

            {product.specs.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">
                  Specification
                </h2>
                <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex flex-col gap-1">
                      <dt className="text-[12px] uppercase tracking-[0.14em] text-faint">
                        {spec.label}
                      </dt>
                      <dd className="text-[14px] leading-relaxed text-ink-soft">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {product.care ? (
              <div className="flex flex-col gap-2 bg-parchment p-6">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">Care</h2>
                <p className="text-[14px] leading-relaxed text-ink-soft">{product.care}</p>
                <Link
                  href="/care"
                  className="mt-1 self-start border-b border-gold pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-gold"
                >
                  Full care guide
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {journal.length > 0 ? (
        <section className="border-t border-ink/10 bg-parchment/50 py-16 md:py-20">
          <Container className="flex flex-col gap-9">
            <SectionHeading title="From the journal" />
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {journal.map((post) => (
                <li key={post.id}>
                  <Link href={`/journal/${post.slug}`} className="group flex flex-col gap-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
                      {getCluster(post.cluster)?.name ?? post.category} · {post.readMinutes} min
                    </span>
                    <h3 className="font-serif text-[1.5rem] leading-tight transition-colors group-hover:text-gold">
                      {post.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-ink/10 py-16 md:py-20">
          <Container className="flex flex-col gap-9">
            <SectionHeading title="Also from the bench" />
            <ProductGrid products={related} />
          </Container>
        </section>
      ) : null}
    </>
  );
}

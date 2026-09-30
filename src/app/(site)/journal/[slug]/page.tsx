import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleFaqs, GuideBox, Takeaways } from "@/components/journal/guide";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { ProductGrid } from "@/components/shop/product-card";
import { ButtonLink, Container, ImageSlot, SectionHeading } from "@/components/ui";
import { getCluster } from "@/config/clusters";
import {
  getClusterPosts,
  getPostBySlug,
  getPostSlugs,
  getProductsBySlugs,
  getRelatedPosts,
} from "@/lib/queries";
import { articleLd, breadcrumbLd, faqLd, metaDescription, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return pageMetadata({
      title: "Not found",
      description: "That piece of writing is no longer here.",
      path: `/journal/${slug}`,
      noIndex: true,
    });
  }

  const cluster = getCluster(post.cluster);

  return pageMetadata({
    title: post.seoTitle || post.title,
    description: metaDescription(post.seoDescription || post.excerpt),
    path: `/journal/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    keywords: [...post.tags, post.category, ...(cluster ? [cluster.name] : [])],
    image: post.image,
  });
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const cluster = getCluster(post.cluster);

  const [clusterPosts, products, related] = await Promise.all([
    cluster ? getClusterPosts(cluster.key) : Promise.resolve([]),
    getProductsBySlugs(post.products),
    getRelatedPosts({ cluster: post.cluster, category: post.category }, post.id, 2),
  ]);

  const pillar = cluster
    ? (clusterPosts.find((item) => item.slug === cluster.pillar) ?? null)
    : null;
  const isPillar = pillar?.slug === post.slug;
  const articles = clusterPosts.filter((item) => item.slug !== cluster?.pillar);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
    ...(pillar && !isPillar ? [{ name: pillar.title, path: `/journal/${pillar.slug}` }] : []),
    { name: post.title, path: `/journal/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            author: post.author,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            image: post.image,
            section: cluster?.name ?? post.category,
            partOf: pillar && !isPillar ? pillar : null,
            hasPart: isPillar ? articles : [],
            mentions: products,
            keywords: post.tags,
            wordCount: post.body.split(/\s+/).filter(Boolean).length,
          }),
          breadcrumbLd(trail),
          ...(post.faqs.length > 0 ? [faqLd(post.faqs)] : []),
        ]}
      />

      <article>
        <header className="py-12 md:py-16">
          <Container className="flex max-w-[760px] flex-col gap-5">
            <nav
              aria-label="Breadcrumb"
              className="text-[11px] uppercase tracking-[0.18em] text-faint"
            >
              <Link href="/journal" className="transition-colors hover:text-gold">
                Journal
              </Link>
              <span className="mx-2.5">/</span>
              {pillar && !isPillar ? (
                <Link
                  href={`/journal/${pillar.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {cluster?.name}
                </Link>
              ) : (
                <span className="text-muted">{cluster?.name ?? post.category}</span>
              )}
            </nav>

            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08]">
              {post.title}
            </h1>

            <p className="text-[17px] leading-[1.75] text-muted">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink/12 pt-5 text-[12px] uppercase tracking-[0.16em] text-faint">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
              {post.updatedAt.getTime() - (post.publishedAt?.getTime() ?? 0) > 86_400_000 ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated{" "}
                    <time dateTime={post.updatedAt.toISOString()}>
                      {formatDate(post.updatedAt)}
                    </time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
          </Container>
        </header>

        <Container className="max-w-[760px]">
          <ImageSlot
            label={post.imageSlot}
            image={post.image}
            ratio="16 / 9"
            sizes="(min-width: 760px) 760px, 100vw"
            priority
          />
        </Container>

        <Container className="flex max-w-[760px] flex-col gap-10 py-12 md:py-16">
          <Takeaways items={post.takeaways} />

          {cluster && isPillar ? (
            <GuideBox
              cluster={cluster}
              pillar={pillar}
              articles={articles}
              currentSlug={post.slug}
            />
          ) : null}

          <div>
            <Markdown content={post.body} />

            <ArticleFaqs faqs={post.faqs} />

            {cluster && !isPillar ? (
              <GuideBox
                cluster={cluster}
                pillar={pillar}
                articles={articles}
                currentSlug={post.slug}
                className="mt-14"
              />
            ) : null}

            {post.tags.length > 0 ? (
              <ul className="mt-14 flex flex-wrap gap-2.5 border-t border-ink/12 pt-8">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="bg-parchment px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-faint"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Container>
      </article>

      {products.length > 0 ? (
        <section className="border-t border-ink/10 py-16 md:py-20">
          <Container className="flex flex-col gap-9">
            <SectionHeading
              title={products.length === 1 ? "The piece in this article" : "Pieces in this article"}
            />
            <ProductGrid products={products} />
          </Container>
        </section>
      ) : null}

      <section className="bg-parchment py-14 md:py-16">
        <Container className="flex max-w-[760px] flex-col items-start gap-4">
          <h2 className="text-[clamp(1.75rem,3.2vw,2.25rem)] leading-tight">
            Have something you want made?
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-ink-soft">
            Send dimensions, the metal you have in mind and your deadline. We quote a
            fixed price within two days.
          </p>
          <ButtonLink href="/contact?topic=commission" className="mt-2">
            Write to the workshop
          </ButtonLink>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="py-16 md:py-20">
          <Container className="flex flex-col gap-9">
            <SectionHeading title="Read next" />
            <ul className="grid gap-10 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.id}>
                  <Link href={`/journal/${item.slug}`} className="group flex flex-col gap-3.5">
                    <ImageSlot
                      label={item.imageSlot}
                      image={item.image}
                      ratio="3 / 2"
                      sizes="(min-width: 640px) 45vw, 90vw"
                    />
                    <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
                      {getCluster(item.cluster)?.name ?? item.category} · {item.readMinutes} min
                    </span>
                    <h3 className="font-serif text-[1.6rem] leading-tight transition-colors group-hover:text-gold">
                      {item.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted">{item.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}

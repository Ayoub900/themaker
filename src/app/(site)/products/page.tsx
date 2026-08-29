import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/shop/product-card";
import { Container, EmptyState, Eyebrow, ButtonLink } from "@/components/ui";
import { marks } from "@/config/content";
import { policies, shipping, site } from "@/config/site";
import { formatCents } from "@/lib/money";
import { getCollections, getProducts } from "@/lib/queries";
import { breadcrumbLd, itemListLd, pageMetadata } from "@/lib/seo";
import { cn, plural } from "@/lib/utils";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Products",
  description:
    `The full catalogue: forged brass bowls, bronze lighting and cast hardware, made one at a time in ${site.city}. Unlacquered finishes, free repairs for life, insured delivery.`,
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection = "all" } = await searchParams;

  const [products, collections] = await Promise.all([
    getProducts(collection),
    getCollections(),
  ]);

  const filters = [{ label: "Everything", value: "all" }].concat(
    collections.map((name) => ({ label: name, value: name })),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          itemListLd(
            "The Maker catalogue",
            products.map((product) => ({
              name: product.name,
              path: `/products/${product.slug}`,
            })),
          ),
        ]}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Catalogue</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            Everything we make, and nothing we do not.
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            A piece only joins the range once we have made it enough times to know
            what it should cost and how long it should take. {policies.leadTimeStock}{" "}
            on anything in stock, free shipping over{" "}
            {formatCents(shipping.freeThresholdCents)}.
          </p>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-5 border-b border-ink/12 pb-5">
            <nav aria-label="Filter by collection" className="flex flex-wrap gap-x-7 gap-y-3">
              {filters.map((filter) => {
                const active = filter.value === collection;
                return (
                  <Link
                    key={filter.value}
                    href={filter.value === "all" ? "/products" : `/products?collection=${encodeURIComponent(filter.value)}`}
                    aria-current={active ? "page" : undefined}
                    scroll={false}
                    className={cn(
                      "border-b pb-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors",
                      active
                        ? "border-gold text-ink"
                        : "border-transparent text-muted hover:text-gold",
                    )}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </nav>

            <span className="text-[13px] text-faint">
              {plural(products.length, "piece")}
            </span>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title="Nothing in this collection yet"
              body="The bench is busy elsewhere. Look at the rest of the catalogue, or write to us about a commission."
              action={<ButtonLink href="/products">See everything</ButtonLink>}
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </Container>
      </section>

      <section className="bg-parchment py-16 md:py-20">
        <Container>
          <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {marks.map((mark) => (
              <div key={mark.k} className="flex flex-col gap-2.5">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">
                  {mark.k}
                </dt>
                <dd className="text-[15px] leading-[1.75] text-ink-soft">{mark.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}

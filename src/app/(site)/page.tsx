import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/shop/product-card";
import { ButtonLink, Container, Eyebrow, ImageSlot, SectionHeading, Stars } from "@/components/ui";
import { about, hero, marks, stats, testimonials } from "@/config/content";
import { site } from "@/config/site";
import { getFeaturedProducts, getPosts } from "@/lib/queries";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: `${site.name} — Hand-forged brass & bronze objects, ${site.city}`,
  description: site.description,
  path: "/",
});

export default async function HomePage() {
  const [products, posts] = await Promise.all([
    getFeaturedProducts(6),
    getPosts(3),
  ]);

  return (
    <>
      <JsonLd
        data={itemListLd(
          "Featured pieces",
          products.map((product) => ({
            name: product.name,
            path: `/products/${product.slug}`,
          })),
        )}
      />

      {/* ------------------------------------------------------------ hero */}
      <section className="pt-16 md:pt-24">
        <Container className="flex flex-col items-center gap-7 text-center">
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <h1 className="max-w-[800px] text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.05]">
            {hero.title}
          </h1>

          <p className="max-w-[520px] text-[16px] leading-[1.8] text-muted">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <ImageSlot label={hero.imageSlot} ratio="21 / 9" sizes="100vw" className="mt-5 w-full" />
        </Container>
      </section>

      {/* ----------------------------------------------------------- marks */}
      <section className="py-16 md:py-20">
        <Container>
          <dl className="grid gap-x-10 gap-y-9 border-t border-ink/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {marks.map((mark) => (
              <div key={mark.k} className="flex flex-col gap-2.5">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">
                  {mark.k}
                </dt>
                <dd className="text-[15px] leading-[1.75] text-muted">{mark.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* -------------------------------------------------------- products */}
      <section className="pb-20 md:pb-24">
        <Container className="flex flex-col gap-9">
          <SectionHeading
            title="Products"
            action={
              <Link
                href="/products"
                className="text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-gold"
              >
                The whole catalogue →
              </Link>
            }
          />
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* ----------------------------------------------------------- about */}
      <section className="bg-parchment py-20 md:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1]">{about.title}</h2>
            <p className="text-[16px] leading-[1.85] text-ink-soft">{about.lede}</p>
            <p className="text-[16px] leading-[1.85] text-ink-soft">
              Nothing leaves the workshop that we would not keep ourselves.
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-6 border-t border-ink/12 pt-7 sm:gap-6">
              {stats.map((stat) => (
                // The term is the label and the value is the number; CSS order
                // puts the number on top without reading it out twice.
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <dt className="order-2 text-[12px] leading-snug text-faint">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-serif text-[clamp(1.75rem,7vw,2.5rem)] font-normal leading-none text-ink lining-nums">
                    {stat.n}
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink href="/about" variant="ghost" className="mt-4 self-start">
              Our story
            </ButtonLink>
          </div>

          <ImageSlot label={about.imageSlot} ratio="4 / 3" inverse />
        </Container>
      </section>

      {/* ---------------------------------------------------- testimonials */}
      <section className="py-20 md:py-24">
        <Container>
          <ul className="grid gap-10 md:grid-cols-3">
            {testimonials.map((review) => (
              <li key={review.who} className="flex flex-col gap-3.5">
                <Stars count={review.stars} />
                <blockquote className="font-serif text-[1.375rem] leading-[1.5]">
                  {review.quote}
                </blockquote>
                <cite className="text-[11px] uppercase not-italic tracking-[0.18em] text-faint">
                  {review.who} — {review.where}
                </cite>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* --------------------------------------------------------- journal */}
      {posts.length > 0 ? (
        <section className="border-t border-ink/10 py-20 md:py-24">
          <Container className="flex flex-col gap-9">
            <SectionHeading
              title="From the journal"
              action={
                <Link
                  href="/journal"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-gold"
                >
                  All writing →
                </Link>
              }
            />

            <ul className="grid gap-10 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/journal/${post.slug}`} className="group flex flex-col gap-3.5">
                    <ImageSlot
                      label={post.imageSlot}
                      image={post.image}
                      ratio="3 / 2"
                      sizes="(min-width: 768px) 30vw, 90vw"
                    />
                    <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
                      {post.category} · {post.readMinutes} min ·{" "}
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </span>
                    <h3 className="font-serif text-[1.6rem] leading-tight transition-colors group-hover:text-gold">
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
    </>
  );
}

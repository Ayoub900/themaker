import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Container, EmptyState, Eyebrow, ImageSlot } from "@/components/ui";
import { clusters } from "@/config/clusters";
import { site } from "@/config/site";
import { getPosts } from "@/lib/queries";
import { breadcrumbLd, itemListLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Journal",
  description:
    `Guides from a metal workshop in ${site.city}: Moroccan brass lamps and chandeliers, caring for brass, the craft of dinanderie, and buying handmade metalwork from Morocco.`,
  path: "/journal",
});

export default async function JournalPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  // One entry per topic cluster, pointing at its pillar guide — the top of
  // each cocoon, and the page every article in it links back up to.
  const guides = clusters.flatMap((cluster) => {
    const pillar = posts.find((post) => post.slug === cluster.pillar);
    if (!pillar) return [];
    const count = posts.filter(
      (post) => post.cluster === cluster.key && post.slug !== cluster.pillar,
    ).length;
    return [{ cluster, pillar, count }];
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
          ]),
          itemListLd(
            "The Maker journal",
            posts.map((post) => ({ name: post.title, path: `/journal/${post.slug}` })),
          ),
        ]}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Journal</Eyebrow>
          <h1 className="max-w-[18ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            What we learned at the bench, written down.
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            Materials, process and the occasional admission. Written by the two
            people who make the work, which is why there is no schedule.
          </p>
        </Container>
      </section>

      {guides.length > 0 ? (
        <section aria-labelledby="guides" className="border-b border-ink/10 py-14 md:py-16">
          <Container className="flex flex-col gap-8">
            <h2 id="guides" className="text-[11px] uppercase tracking-[0.18em] text-gold">
              The guides
            </h2>
            <ul className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {guides.map(({ cluster, pillar, count }) => (
                <li key={cluster.key} className="bg-paper">
                  <Link
                    href={`/journal/${pillar.slug}`}
                    className="group flex h-full flex-col gap-3 p-6"
                  >
                    <span className="font-serif text-[1.5rem] leading-tight transition-colors group-hover:text-gold">
                      {cluster.name}
                    </span>
                    <span className="text-[14px] leading-relaxed text-muted">
                      {cluster.description}
                    </span>
                    <span className="mt-auto pt-2 text-[11px] uppercase tracking-[0.18em] text-faint">
                      Guide + {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {posts.length === 0 ? (
        <Container className="py-16">
          <EmptyState
            title="Nothing published yet"
            body="The first piece is still on the bench. Come back shortly."
          />
        </Container>
      ) : (
        <>
          {/* Lead article */}
          <section className="py-14 md:py-16">
            <Container>
              <Link
                href={`/journal/${lead.slug}`}
                className="group grid items-center gap-9 lg:grid-cols-2 lg:gap-14"
              >
                <ImageSlot
                  label={lead.imageSlot}
                  image={lead.image}
                  ratio="3 / 2"
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  priority
                />
                <div className="flex flex-col gap-4">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
                    {lead.category} · {lead.readMinutes} min ·{" "}
                    <time dateTime={lead.publishedAt?.toISOString()}>
                      {formatDate(lead.publishedAt)}
                    </time>
                  </span>
                  <h2 className="text-[clamp(2rem,4vw,2.875rem)] leading-[1.12] transition-colors group-hover:text-gold">
                    {lead.title}
                  </h2>
                  <p className="max-w-[52ch] text-[16px] leading-[1.8] text-muted">
                    {lead.excerpt}
                  </p>
                  <span className="mt-2 self-start border-b border-gold pb-1.5 text-[11px] uppercase tracking-[0.2em]">
                    Read it
                  </span>
                </div>
              </Link>
            </Container>
          </section>

          {rest.length > 0 ? (
            <section className="border-t border-ink/10 py-14 md:py-16">
              <Container>
                <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.id}>
                      <Link href={`/journal/${post.slug}`} className="group flex flex-col gap-3.5">
                        <ImageSlot
                          label={post.imageSlot}
                          image={post.image}
                          ratio="3 / 2"
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        />
                        <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
                          {post.category} · {post.readMinutes} min ·{" "}
                          <time dateTime={post.publishedAt?.toISOString()}>
                            {formatDate(post.publishedAt)}
                          </time>
                        </span>
                        <h2 className="font-serif text-[1.6rem] leading-tight transition-colors group-hover:text-gold">
                          {post.title}
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}
        </>
      )}
    </>
  );
}

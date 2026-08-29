import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Container, EmptyState, Eyebrow, ImageSlot } from "@/components/ui";
import { site } from "@/config/site";
import { getPosts } from "@/lib/queries";
import { breadcrumbLd, itemListLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Journal",
  description:
    `Notes from a two-person metal workshop in ${site.city}: why we stopped plating anything, how a bowl is raised, what a commission actually costs, and how to live with a patina.`,
  path: "/journal",
});

export default async function JournalPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

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

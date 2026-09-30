import Link from "next/link";

import type { Cluster } from "@/config/clusters";
import { cn } from "@/lib/utils";

type GuideItem = { slug: string; title: string; excerpt?: string };

/**
 * The cocoon, made visible. On a pillar it lists every article in the guide;
 * on an article it links up to the pillar and across to the siblings, with
 * the current one marked rather than linked.
 */
export function GuideBox({
  cluster,
  pillar,
  articles,
  currentSlug,
  className,
}: {
  cluster: Cluster;
  pillar: GuideItem | null;
  articles: GuideItem[];
  currentSlug: string;
  className?: string;
}) {
  const onPillar = pillar?.slug === currentSlug;

  return (
    <nav
      aria-label={`${cluster.name} guide`}
      className={cn("border border-ink/12 bg-parchment/60 p-6 md:p-8", className)}
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
        {onPillar ? "In this guide" : "Part of the guide"}
      </p>

      {!onPillar && pillar ? (
        <Link
          href={`/journal/${pillar.slug}`}
          className="mt-2 block font-serif text-[1.6rem] leading-tight transition-colors hover:text-gold"
        >
          {pillar.title}
        </Link>
      ) : (
        <p className="mt-2 font-serif text-[1.6rem] leading-tight">{cluster.name}</p>
      )}

      {articles.length > 0 ? (
        <ol className="mt-5 flex flex-col gap-3 border-t border-ink/12 pt-5">
          {articles.map((article, index) => {
            const current = article.slug === currentSlug;
            return (
              <li key={article.slug} className="flex gap-3.5 text-[15px] leading-snug">
                <span className="w-5 shrink-0 font-mono text-[11px] leading-[1.6] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1">
                  {current ? (
                    <span aria-current="page" className="text-ink">
                      {article.title} <span className="text-faint">— you are here</span>
                    </span>
                  ) : (
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-ink-soft transition-colors hover:text-gold"
                    >
                      {article.title}
                    </Link>
                  )}
                  {onPillar && article.excerpt ? (
                    <span className="text-[14px] text-muted">{article.excerpt}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </nav>
  );
}

/** The short answer, above the body — what an answer engine should quote. */
export function Takeaways({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <aside
      aria-label="The short answer"
      className="border-l-2 border-gold bg-parchment/60 px-6 py-5 md:px-8 md:py-6"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-gold">The short answer</p>
      <ul className="mt-3 flex list-[square] flex-col gap-2 pl-5 text-[16px] leading-[1.7] text-ink-soft marker:text-gold">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

/** Questions and answers at the foot of an article, marked up as FAQPage. */
export function ArticleFaqs({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="article-faqs" className="mt-14 border-t border-ink/12 pt-10">
      <h2 id="article-faqs" className="text-[clamp(1.75rem,3.2vw,2.25rem)] leading-tight">
        Questions people ask
      </h2>
      <dl className="mt-6 flex flex-col divide-y divide-ink/10">
        {faqs.map((faq) => (
          <div key={faq.q} className="flex flex-col gap-2 py-5">
            <dt className="font-serif text-[1.35rem] leading-snug text-ink">{faq.q}</dt>
            <dd className="text-[16px] leading-[1.8] text-ink-soft">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { faqs } from "@/config/content";
import { contact } from "@/config/site";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Questions",
  description:
    "Patina, commissions, lead times, international shipping, returns and repairs — the questions the workshop is actually asked, answered properly.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqLd(),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Questions", path: "/faq" },
          ]),
        ]}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Questions</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            The things people ask before they buy.
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            If yours is not here,{" "}
            <a
              href={`mailto:${contact.email}`}
              className="border-b border-gold pb-0.5 text-ink hover:text-gold"
            >
              write to us
            </a>{" "}
            — we answer within two working days.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="max-w-[820px]">
          <dl className="border-t border-ink/12">
            {faqs.map((entry) => (
              <div key={entry.q} className="border-b border-ink/12 py-8">
                <dt className="font-serif text-[1.6rem] leading-tight">{entry.q}</dt>
                <dd className="mt-3 text-[16px] leading-[1.8] text-muted">{entry.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-parchment py-14 md:py-16">
        <Container className="flex max-w-[820px] flex-col items-start gap-4">
          <h2 className="text-[clamp(1.75rem,3.2vw,2.25rem)] leading-tight">
            Still deciding?
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-ink-soft">
            The{" "}
            <Link href="/care" className="border-b border-gold pb-0.5 hover:text-gold">
              care guide
            </Link>{" "}
            covers what happens to bare metal over the first year, and{" "}
            <Link href="/shipping" className="border-b border-gold pb-0.5 hover:text-gold">
              shipping and returns
            </Link>{" "}
            has the rates and the rules in full.
          </p>
          <ButtonLink href="/contact" className="mt-2">
            Ask us directly
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

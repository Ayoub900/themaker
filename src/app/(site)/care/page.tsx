import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { careGuide } from "@/config/content";
import { policies } from "@/config/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Care & repair",
  description:
    "How unlacquered brass, bronze, blackened steel and tinned copper age, how to keep them the way you want them, and how our free lifetime repairs work.",
  path: "/care",
  keywords: [
    "unlacquered brass care",
    "brass patina",
    "how to clean bronze",
    "blackened steel care",
    "re-tinning copper",
  ],
});

export default function CarePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Care & repair", path: "/care" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Ownership</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            {careGuide.title}
          </h1>
          <p className="max-w-[600px] text-[17px] leading-[1.8] text-muted">
            {careGuide.lede}
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="max-w-[780px] flex flex-col gap-14">
          {careGuide.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-4">
              <h2 className="border-b border-ink/12 pb-4 text-[clamp(1.75rem,3.4vw,2.25rem)] leading-tight">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-[16px] leading-[1.85] text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </Container>
      </section>

      <section className="bg-ink py-16 text-cream md:py-20">
        <Container className="flex flex-col items-start gap-5">
          <h2 className="max-w-[20ch] text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] text-cream">
            {policies.warranty}.
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-ash">
            Send a photograph first and we will tell you whether to post it or bring it.
            Pieces bought second-hand are covered too — the guarantee attaches to the
            object, not to the receipt.
          </p>
          <ButtonLink href="/contact?topic=repair" variant="light" className="mt-2">
            Arrange a repair
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

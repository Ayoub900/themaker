import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, Eyebrow, ImageSlot, SectionHeading } from "@/components/ui";
import { about, makers, marks, process, stats } from "@/config/content";
import { address, openingHoursSummary, site } from "@/config/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the workshop",
  description:
    `Two makers, one courtyard in ${site.city}, twenty-five years. We began by repairing other people's brass hardware, and what those repairs taught us is why we no longer plate or lacquer anything.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>
            {address.city} · since {site.founded}
          </Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            {about.title}
          </h1>
          <p className="max-w-[600px] text-[17px] leading-[1.8] text-muted">
            {about.lede}
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-[16px] leading-[1.85] text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <ImageSlot label={about.imageSlot} ratio="4 / 5" />
            <dl className="grid grid-cols-3 gap-x-4 gap-y-6 border-t border-ink/12 pt-7 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <dt className="order-2 text-[12px] leading-snug text-faint">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-serif text-[clamp(1.625rem,6.5vw,2.25rem)] font-normal leading-none lining-nums">
                    {stat.n}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- makers */}
      <section className="bg-parchment py-16 md:py-20">
        <Container className="flex flex-col gap-9">
          <SectionHeading title="The two of us" />
          <ul className="grid gap-10 md:grid-cols-2">
            {makers.map((maker) => (
              <li key={maker.name} className="flex flex-col gap-4">
                <ImageSlot label={`[ portrait — ${maker.name} ]`} ratio="1 / 1" inverse />
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-2xl">{maker.name}</h3>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-gold">
                    {maker.role}
                  </span>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                    {maker.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* --------------------------------------------------------- process */}
      <section className="py-16 md:py-20">
        <Container className="flex flex-col gap-9">
          <SectionHeading title="How a commission runs" />
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <li key={step.step} className="flex flex-col gap-3 border-t border-ink/12 pt-6">
                <span className="font-mono text-[12px] text-gold">{step.step}</span>
                <h3 className="font-serif text-[1.5rem] leading-tight">{step.title}</h3>
                <p className="text-[15px] leading-[1.75] text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ----------------------------------------------------------- marks */}
      <section className="border-t border-ink/10 py-16 md:py-20">
        <Container>
          <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="bg-ink py-16 text-cream md:py-20">
        <Container className="flex flex-col items-start gap-5">
          <h2 className="max-w-[20ch] text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] text-cream">
            The door is open three days a week.
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-ash">
            {address.oneLine}. {openingHoursSummary}. Write ahead so someone is at the
            bench rather than at the merchant when you arrive.
          </p>
          <ButtonLink href="/contact" variant="light" className="mt-2">
            Plan a visit
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

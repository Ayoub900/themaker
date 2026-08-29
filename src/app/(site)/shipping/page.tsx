import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { shippingCopy } from "@/config/content";
import { policies, shipping, site } from "@/config/site";
import { formatCents } from "@/lib/money";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping & returns",
  description:
    "Rates, transit times and the returns rules in full. One flat rate anywhere in Morocco, free over 3 000 MAD — insured and tracked, packed without plastic.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Shipping & returns", path: "/shipping" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Getting it to you</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            {shippingCopy.title}
          </h1>
          <p className="max-w-[600px] text-[17px] leading-[1.8] text-muted">
            {shippingCopy.lede}
          </p>
        </Container>
      </section>

      {/* Rate table, driven by the shipping config. */}
      <section className="py-12 md:py-16">
        <Container className="max-w-[780px]">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Shipping rates and transit times</caption>
            <thead>
              <tr className="border-b border-ink/20">
                <th scope="col" className="py-3.5 text-[11px] uppercase tracking-[0.18em] text-faint">
                  Destination
                </th>
                <th scope="col" className="py-3.5 text-[11px] uppercase tracking-[0.18em] text-faint">
                  Rate
                </th>
                <th scope="col" className="py-3.5 text-right text-[11px] uppercase tracking-[0.18em] text-faint">
                  Transit
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/10">
                <th scope="row" className="py-4 text-[16px] font-normal">
                  Anywhere in {site.country}
                </th>
                <td className="py-4 text-[16px] text-muted">
                  {formatCents(shipping.flatRateCents)}
                </td>
                <td className="py-4 text-right text-[15px] text-muted">{shipping.transit}</td>
              </tr>
              <tr className="border-b border-ink/10">
                <th scope="row" className="py-4 text-[16px] font-normal text-gold">
                  Over {formatCents(shipping.freeThresholdCents)}
                </th>
                <td className="py-4 text-[16px] text-gold">Free</td>
                <td className="py-4 text-right text-[15px] text-muted">{shipping.transit}</td>
              </tr>
              <tr>
                <th scope="row" className="py-4 text-[16px] font-normal">
                  Outside {site.country}
                </th>
                <td className="py-4 text-[16px] text-muted" colSpan={2}>
                  Quoted by hand — ask before you order
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-5 text-[14px] leading-relaxed text-faint">
            {shipping.carrier}. {shipping.packaging}.
          </p>
        </Container>
      </section>

      <section className="pb-14 md:pb-20">
        <Container className="max-w-[780px] flex flex-col gap-14">
          {shippingCopy.sections.map((section) => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/\s+/g, "-")}
              className="flex scroll-mt-28 flex-col gap-4"
            >
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

      <section className="bg-parchment py-14 md:py-16">
        <Container className="flex max-w-[780px] flex-col items-start gap-4">
          <h2 className="text-[clamp(1.75rem,3.2vw,2.25rem)] leading-tight">
            Something arrived wrong?
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-ink-soft">
            Photograph it before you unpack any further and tell us the same day. We collect
            at our cost and either repair or replace. {policies.warranty}.
          </p>
          <ButtonLink href="/contact?topic=order" className="mt-2">
            Tell us what happened
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

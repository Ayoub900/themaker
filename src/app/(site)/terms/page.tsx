import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Container, Eyebrow } from "@/components/ui";
import {
  address,
  contactChannels,
  currency,
  policies,
  shipping,
  site,
} from "@/config/site";
import { formatCents } from "@/lib/money";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of sale",
  description:
    "The conditions under which The Maker sells: prices, orders, delivery, the right of withdrawal and its exemptions, guarantees and applicable law.",
  path: "/terms",
});

const sections = [
  {
    title: "1. Who you are contracting with",
    body: [
      `${site.legalName}, ${address.oneLine}, ${address.country}. Reach us on ${contactChannels}, or through the contact page.`,
      "These terms apply to every order placed through this website. Placing an order means you accept them.",
    ],
  },
  {
    title: "2. Prices",
    body: [
      `All prices are shown in ${currency.code} (Moroccan dirham) and include TVA at the applicable rate. Shipping is added at checkout and shown before you confirm.`,
      "We may change catalogue prices at any time, but the price that applies to your order is the one displayed when you placed it.",
    ],
  },
  {
    title: "3. Orders",
    body: [
      "An order becomes a contract when we send you a confirmation. Until then we may decline it — most often because a piece has been sold between your order and our bench, or because a commission is outside what we can make well.",
      "If we decline, we tell you the same working day and refund anything already taken.",
    ],
  },
  {
    title: "4. Delivery",
    body: [
      `Catalogue pieces in stock are dispatched within ${policies.leadTimeStock}. Commissions run ${policies.leadTimeCommission}. Everything travels insured and tracked.`,
      `Shipping is ${shipping.carrier}, a flat ${formatCents(shipping.flatRateCents)} anywhere in Morocco and free on orders over ${formatCents(shipping.freeThresholdCents)}. ${shipping.internationalNote} Duties and import taxes on orders leaving Morocco are payable by the buyer.`,
      "Risk passes to you on delivery. If a parcel arrives damaged, photograph it before unpacking further and write the same day.",
    ],
  },
  {
    title: "5. Right of withdrawal",
    body: [
      `You may withdraw from a purchase of a catalogue piece within ${policies.returnWindowDays} days of delivery without giving a reason. The piece must be unused and in its original packaging; return postage is yours unless the piece was faulty.`,
      "Commissions, made-to-measure pieces and anything cut, wired or engraved to your specification are exempt from this right, because they cannot be resold. This is why we sample before any run above six pieces.",
      "Refunds are made to the original payment method within 14 days of the returned piece reaching us.",
    ],
  },
  {
    title: "6. Guarantees",
    body: [
      "Your statutory rights under Moroccan consumer law (loi 31-08) — conformity and hidden defects — apply in full and are not affected by anything below.",
      `In addition, and voluntarily: ${policies.warranty.toLowerCase()}. That covers pieces bought second-hand and pieces damaged by their owner. It does not cover normal patination, which is not a defect.`,
    ],
  },
  {
    title: "7. Metal, colour and variation",
    body: [
      "Everything is unlacquered and unplated. Colour, tone and surface change from the moment a piece leaves the workshop, and no two hand-raised or hand-cast pieces are identical.",
      "Variation of this kind is a property of the work and is not a defect. If uniformity matters more to you than ageing, please do not order.",
    ],
  },
  {
    title: "8. Law and disputes",
    body: [
      "These terms are governed by Moroccan law, and the courts of the workshop's city have jurisdiction. Nothing here removes the protection you have under the mandatory law of your country of residence.",
      "If something goes wrong, tell us first — almost everything is settled that way.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Terms of sale", path: "/terms" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            Terms of sale
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            Written to be read. If any of it is unclear,{" "}
            <Link href="/contact" className="border-b border-gold pb-0.5 text-ink hover:text-gold">
              ask
            </Link>{" "}
            before you order.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="max-w-[780px] flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3.5">
              <h2 className="text-[1.5rem] leading-tight">{section.title}</h2>
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
    </>
  );
}

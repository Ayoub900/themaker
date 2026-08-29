import { Suspense } from "react";

import { JsonLd } from "@/components/json-ld";
import { ContactForm } from "@/components/site/contact-form";
import { Container, Eyebrow } from "@/components/ui";
import { process } from "@/config/content";
import {
  address,
  contact,
  hasEmail,
  hasPhone,
  hasWhatsapp,
  openingHours,
  openingHoursSummary,
} from "@/config/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact & commissions",
  description:
    "Write to the workshop about a commission, a repair or a visit. Message us on WhatsApp or send a note from the form. We quote fixed prices within two working days.",
  path: "/contact",
});

export default function ContactPage() {
  const openDays = openingHours.filter((day) => day.opens !== null);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            Write to the workshop.
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            One of us reads everything. Commissions get a fixed price and a real date
            within two working days; everything else is usually answered the same day.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Suspense
              fallback={
                <div className="h-[540px] animate-pulse bg-parchment" aria-hidden="true" />
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-10">
            <div id="visit" className="flex scroll-mt-28 flex-col gap-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">
                The workshop
              </h2>
              <address className="flex flex-col gap-1.5 text-[16px] not-italic leading-relaxed text-ink-soft">
                <span>{address.street}</span>
                <span>{address.district}</span>
                <span>
                  {address.postalCode} {address.city}, {address.country}
                </span>
              </address>
              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start border-b border-gold pb-1 text-[11px] uppercase tracking-[0.18em] hover:text-gold"
              >
                Open in maps
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">Direct</h2>
              <ul className="flex flex-col gap-2 text-[16px] text-ink-soft">
                {hasWhatsapp ? (
                  <li>
                    <a
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold"
                    >
                      WhatsApp the workshop
                    </a>
                  </li>
                ) : null}
                {hasPhone ? (
                  <li>
                    <a href={`tel:${contact.phoneHref}`} className="hover:text-gold">
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {hasEmail ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:text-gold">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                <li className="text-[14px] text-faint">
                  Orders, commissions and press all go through the form — it lands in the
                  workshop dashboard and one of us reads it.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-gold">
                Visiting
              </h2>
              <dl className="flex flex-col gap-2 text-[15px]">
                {openDays.map((day) => (
                  <div key={day.day} className="flex justify-between gap-6 border-b border-ink/8 pb-2">
                    <dt className="text-muted">{day.day}</dt>
                    <dd className="text-ink-soft lining-nums tabular-nums">
                      {day.opens}–{day.closes}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-[14px] leading-relaxed text-faint">
                {openingHoursSummary}. Write ahead so someone is at the bench rather
                than at the merchant when you arrive.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-parchment py-16 md:py-20">
        <Container className="flex flex-col gap-9">
          <h2 className="border-b border-ink/12 pb-5 text-[clamp(2rem,4vw,2.875rem)] leading-[1.1]">
            How a commission runs
          </h2>
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <li key={step.step} className="flex flex-col gap-3">
                <span className="font-mono text-[12px] text-gold">{step.step}</span>
                <h3 className="font-serif text-[1.5rem] leading-tight">{step.title}</h3>
                <p className="text-[15px] leading-[1.75] text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}

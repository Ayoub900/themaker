import Image from "next/image";
import Link from "next/link";

import {
  address,
  brand,
  contact,
  copyrightLine,
  footerNav,
  hasEmail,
  hasPhone,
  hasWhatsapp,
  openingHoursSummary,
  site,
} from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          {/* Write to the workshop */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.1] text-cream">
              Write to the workshop
            </h2>

            <address className="flex flex-col gap-2 text-[15px] not-italic leading-relaxed text-ash">
              <span>{address.oneLine}</span>
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {hasPhone ? (
                  <a href={`tel:${contact.phoneHref}`} className="hover:text-gold">
                    {contact.phone}
                  </a>
                ) : null}
                {hasPhone && hasEmail ? <span className="text-ash/50">·</span> : null}
                {hasEmail ? (
                  <a href={`mailto:${contact.email}`} className="hover:text-gold">
                    {contact.email}
                  </a>
                ) : null}
                {hasWhatsapp ? (
                  <>
                    {hasPhone || hasEmail ? <span className="text-ash/50">·</span> : null}
                    <a
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold"
                    >
                      WhatsApp
                    </a>
                  </>
                ) : null}
              </span>
              <span>{openingHoursSummary}</span>
            </address>

            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ash">
              Write to the bench, or send a note through the{" "}
              <Link href="/contact" className="text-cream/90 underline-offset-4 hover:text-gold">
                contact page
              </Link>
              . We answer commissions and repairs within two working days.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-ash/70">
                  {column.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-cream/85 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-8 border-t border-cream/12 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={brand.logo.mark}
              alt=""
              width={44}
              height={40}
              sizes="44px"
              className="h-9 w-auto opacity-70"
            />
            <span className="text-[11px] tracking-[0.14em] text-ash/70">
              {copyrightLine}
            </span>
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-ash/50">
          {site.legalName}
        </p>
      </div>
    </footer>
  );
}

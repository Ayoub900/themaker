import Link from "next/link";

import { ButtonLink, Container } from "@/components/ui";
import { contact, mainNav } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center py-24 text-center">
      <Container className="flex flex-col items-center gap-6">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">
          404
        </span>

        <h1 className="max-w-[18ch] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08]">
          There is nothing at this address.
        </h1>

        <p className="max-w-[46ch] text-[16px] leading-[1.8] text-muted">
          The piece may have left the catalogue, or the link may have been mistyped.
          The bench is still where it was.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/">Back to the workshop</ButtonLink>
          <ButtonLink href="/products" variant="outline">
            See the catalogue
          </ButtonLink>
        </div>

        <nav aria-label="Elsewhere" className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-faint transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-4 text-[13px] text-faint">
          Or write to{" "}
          <a href={`mailto:${contact.email}`} className="border-b border-gold pb-0.5 hover:text-gold">
            {contact.email}
          </a>
        </p>
      </Container>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { imageUrl, type ImageRef, type SitePhoto } from "@/lib/images";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- buttons */

const buttonBase =
  "inline-flex items-center justify-center gap-2 text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 disabled:opacity-45 disabled:pointer-events-none";

export const buttonStyles = {
  solid: cn(buttonBase, "bg-ink text-paper px-7 py-4 hover:bg-gold"),
  outline: cn(
    buttonBase,
    "border border-ink/25 text-ink px-7 py-4 hover:border-gold hover:text-gold",
  ),
  ghost: cn(buttonBase, "text-ink border-b border-gold pb-1.5 hover:text-gold"),
  light: cn(buttonBase, "bg-paper text-ink px-7 py-4 hover:bg-gold hover:text-paper"),
} as const;

type Variant = keyof typeof buttonStyles;

export function ButtonLink({
  variant = "solid",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={cn(buttonStyles[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(buttonStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- layout */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-[11px] uppercase tracking-[0.2em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading with the hairline rule used throughout the design. */
export function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-5",
        className,
      )}
    >
      <h2 className="text-[clamp(2rem,4vw,2.875rem)] leading-[1.1]">{title}</h2>
      {action}
    </div>
  );
}

/**
 * One image position on the site.
 *
 * Where a photograph has been uploaded it is shown, cropped to the ratio the
 * layout asks for. Where none has, the hatched placeholder stands in carrying
 * the brief for the frame that belongs there — so the shoot list writes itself
 * and the page is laid out identically either way.
 */
export function ImageSlot({
  label,
  image,
  photo,
  ratio = "4 / 5",
  sizes = "100vw",
  priority = false,
  className,
  inverse = false,
}: {
  /** The brief for the photograph, shown until there is one. */
  label: string;
  /** The photograph, once the workshop has uploaded it. */
  image?: ImageRef | null;
  /** A photograph kept in the repo under `public/`, for fixed site sections. */
  photo?: SitePhoto | null;
  ratio?: string;
  /** The width the image will occupy, so the browser fetches the right size. */
  sizes?: string;
  /** Set on the one image above the fold, which is then not lazily loaded. */
  priority?: boolean;
  className?: string;
  inverse?: boolean;
}) {
  const shown = image ? { src: imageUrl(image.id), alt: image.alt } : photo;

  if (shown) {
    return (
      <div
        className={cn("relative overflow-hidden bg-parchment", className)}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={shown.src}
          alt={shown.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        inverse ? "slot-inverse" : "slot",
        "flex items-end p-3.5",
        className,
      )}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Photography pending: ${label.replace(/^\[\s*|\s*\]$/g, "")}`}
    >
      <span className="font-mono text-[10px] text-faint">{label}</span>
    </div>
  );
}

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <span
      className="text-[12px] tracking-[0.4em] text-gold"
      aria-label={`${count} out of 5`}
    >
      {"★".repeat(count)}
    </span>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "gold" | "muted";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]",
        tone === "gold" && "bg-gold/15 text-gold",
        tone === "neutral" && "bg-ink/8 text-ink-soft",
        tone === "muted" && "bg-ink/5 text-faint",
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-ink/12 px-8 py-16 text-center">
      <h3 className="text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        {body}
      </p>
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  );
}

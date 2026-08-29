import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { SearchIcon } from "@/components/dashboard/icons";
import { cn } from "@/lib/utils";

/* Shared dashboard chrome: panels, tables, form fields, status pills. */

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-ink/10 bg-paper", className)}>
      {title || action ? (
        <div className="flex flex-col gap-3 border-b border-ink/10 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          {title ? (
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{title}</h2>
          ) : (
            <span className="hidden sm:block" />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-serif text-[clamp(1.75rem,5vw,2.25rem)] leading-none break-words">
          {title}
        </h1>
        {subtitle ? <p className="text-[14px] text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  href,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  /** Draws the eye to a tile that is asking for a decision. */
  emphasis?: boolean;
}) {
  const inner = (
    <div className="group flex h-full flex-col gap-2 bg-paper p-5 transition-colors sm:p-6 hover:bg-cream">
      <span className="text-[10px] uppercase tracking-[0.18em] text-faint sm:text-[11px]">
        {label}
      </span>
      <span
        className={cn(
          "font-serif text-[clamp(2rem,6vw,2.5rem)] font-normal leading-none lining-nums tabular-nums",
          emphasis && "text-gold",
        )}
      >
        {value}
      </span>
      {hint ? (
        <span className="flex items-center gap-1.5 text-[12px] text-muted">
          {hint}
          {href ? (
            <span
              aria-hidden="true"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              →
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

/** The hairline-separated tile row used at the top of a dashboard page. */
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-7 grid gap-px border border-ink/10 bg-ink/10 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- filters */

/**
 * Status filters. A row of links on a wide screen; below `sm` it keeps the
 * same shape but scrolls horizontally with the edges bled to the panel, so a
 * seven-status set never wraps into three ragged lines.
 */
export function FilterTabs({
  options,
  active,
  hrefFor,
  label = "Filter",
}: {
  options: readonly string[];
  active: string;
  hrefFor: (option: string) => string;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const current = active === option;
        return (
          <Link
            key={option}
            href={hrefFor(option)}
            aria-current={current ? "true" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors sm:text-[11px]",
              current
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 text-muted hover:border-gold hover:text-gold",
            )}
          >
            {option.toLowerCase().replace(/_/g, " ")}
          </Link>
        );
      })}
    </nav>
  );
}

export function SearchField({
  name = "q",
  defaultValue,
  placeholder = "Search…",
  label,
}: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  label: string;
}) {
  return (
    <form className="relative w-full sm:w-56">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
      <input
        id={name}
        name={name}
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-ink/20 bg-paper py-2 pl-9 pr-3 text-[13px] transition-colors focus:border-gold focus:outline-none"
      />
    </form>
  );
}

/* ----------------------------------------------------------------- table */

/**
 * Below `md` the table stops being a table: `.data-table` in globals.css
 * restacks each row into a card, using the `label` on every `Td` as the
 * caption that the (now hidden) column header used to supply. That beats a
 * 720px-wide horizontal scroller on a phone, and keeps one set of markup.
 */
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="md:overflow-x-auto">
      <table className="data-table w-full border-collapse text-left md:min-w-[720px]">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-ink/12 px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-normal text-faint",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  label,
  primary = false,
}: {
  children: ReactNode;
  className?: string;
  /** Caption shown beside the value once the row restacks on small screens. */
  label?: string;
  /** The cell that names the row — headline of the stacked card, no caption. */
  primary?: boolean;
}) {
  return (
    <td
      data-label={label}
      data-primary={primary ? "" : undefined}
      className={cn("border-b border-ink/8 px-6 py-4 text-[14px] align-top", className)}
    >
      {/* One wrapper so the stacked layout has exactly one flex child to put
          opposite the `data-label` caption, whatever the cell contains. */}
      <div>{children}</div>
    </td>
  );
}

/* ---------------------------------------------------------------- status */

const statusTones: Record<string, string> = {
  PENDING: "bg-gold/15 text-gold",
  CONFIRMED: "bg-ink/8 text-ink-soft",
  IN_PRODUCTION: "bg-ink/8 text-ink-soft",
  SHIPPED: "bg-ink/8 text-ink-soft",
  COMPLETED: "bg-ink text-paper",
  CANCELLED: "bg-ink/5 text-faint line-through",
  NEW: "bg-gold/15 text-gold",
  READ: "bg-ink/8 text-ink-soft",
  REPLIED: "bg-ink text-paper",
  ARCHIVED: "bg-ink/5 text-faint",
  DRAFT: "bg-gold/15 text-gold",
  PUBLISHED: "bg-ink text-paper",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]",
        statusTones[status] ?? "bg-ink/8 text-ink-soft",
      )}
    >
      {status.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}

/* ----------------------------------------------------------------- forms */

export const inputClass =
  "w-full border border-ink/20 bg-paper px-3.5 py-2.5 text-[16px] transition-colors focus:border-gold focus:outline-none sm:text-[14px]";

export const labelClass = "text-[11px] uppercase tracking-[0.16em] text-muted";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint && !error ? <span className="text-[12px] text-faint">{hint}</span> : null}
      {error ? <span className="text-[12px] text-gold">{error}</span> : null}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors disabled:opacity-45 disabled:pointer-events-none";

export const dashButton = {
  solid: cn(buttonBase, "bg-ink text-paper hover:bg-gold"),
  outline: cn(buttonBase, "border border-ink/20 text-ink hover:border-gold hover:text-gold"),
  danger: cn(buttonBase, "border border-gold/50 text-gold hover:bg-gold hover:text-paper"),
} as const;

export function DashLink({
  variant = "outline",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof dashButton }) {
  return (
    <Link className={cn(dashButton[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-6 py-14 text-center text-[14px] text-faint">{children}</p>;
}

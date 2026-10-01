import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ConfirmButton } from "@/components/dashboard/confirm-button";
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
            <h2 className="font-serif text-[19px] text-ink">{title}</h2>
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
        {subtitle ? <p className="text-[16px] text-muted">{subtitle}</p> : null}
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
      <span className="text-[15px] text-muted">
        {label}
      </span>
      <span
        className={cn(
          "font-serif text-[clamp(2rem,6vw,2.5rem)] font-normal leading-none lining-nums tabular-nums",
          emphasis && "text-amber-700",
        )}
      >
        {value}
      </span>
      {hint ? (
        <span className="flex items-center gap-1.5 text-[14px] text-muted">
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
  labels,
}: {
  options: readonly string[];
  active: string;
  hrefFor: (option: string) => string;
  label?: string;
  /** Plain-language names for the options, overriding the shared status names. */
  labels?: Record<string, string>;
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
              "shrink-0 whitespace-nowrap border px-4 py-2 text-[14px] transition-colors",
              current
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 text-muted hover:border-gold hover:text-gold",
            )}
          >
            {statusDots[option] ? (
              <span
                aria-hidden="true"
                className={cn("mr-2 inline-block size-2 rounded-full align-middle", statusDots[option])}
              />
            ) : null}
            {labels?.[option] ?? statusLabels[option] ?? option}
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
    <form className="relative w-full sm:w-64">
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
        className="w-full border border-ink/20 bg-paper py-2.5 pl-9 pr-3 text-[15px] transition-colors focus:border-gold focus:outline-none"
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
        "border-b border-ink/12 px-6 py-3 text-[14px] font-normal text-muted",
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
      className={cn("border-b border-ink/8 px-6 py-4 text-[16px] align-top", className)}
    >
      {/* One wrapper so the stacked layout has exactly one flex child to put
          opposite the `data-label` caption, whatever the cell contains. */}
      <div>{children}</div>
    </td>
  );
}

/* ---------------------------------------------------------------- status */

const statusTones: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  IN_PRODUCTION: "bg-violet-100 text-violet-900",
  SHIPPED: "bg-teal-100 text-teal-900",
  COMPLETED: "bg-green-100 text-green-900",
  CANCELLED: "bg-red-100 text-red-800 line-through",
  NEW: "bg-amber-100 text-amber-900",
  READ: "bg-sky-100 text-sky-900",
  REPLIED: "bg-green-100 text-green-900",
  ARCHIVED: "bg-ink/8 text-muted",
  DRAFT: "bg-amber-100 text-amber-900",
  PUBLISHED: "bg-green-100 text-green-900",
};

/** Dot colour matching each pill, shown on the filter tabs. */
const statusDots: Record<string, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-sky-500",
  IN_PRODUCTION: "bg-violet-500",
  SHIPPED: "bg-teal-500",
  COMPLETED: "bg-green-600",
  CANCELLED: "bg-red-500",
  NEW: "bg-amber-500",
  READ: "bg-sky-500",
  REPLIED: "bg-green-600",
  ARCHIVED: "bg-ink/30",
  DRAFT: "bg-amber-500",
  PUBLISHED: "bg-green-600",
};

/** What each status is called on screen — one place, so every page agrees. */
export const statusLabels: Record<string, string> = {
  ALL: "All",
  PENDING: "Waiting for you",
  CONFIRMED: "Confirmed",
  IN_PRODUCTION: "Being made",
  SHIPPED: "Sent",
  COMPLETED: "Done",
  CANCELLED: "Cancelled",
  NEW: "Unread",
  READ: "Read",
  REPLIED: "Answered",
  ARCHIVED: "Put away",
  DRAFT: "Not on the site",
  PUBLISHED: "On the site",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap px-3 py-1 text-[14px]",
        statusTones[status] ?? "bg-ink/8 text-ink-soft",
      )}
    >
      {statusLabels[status] ?? status.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}

/* ----------------------------------------------------------------- forms */

export const inputClass =
  "w-full border border-ink/20 bg-paper px-4 py-3 text-[16px] transition-colors focus:border-gold focus:outline-none";

export const labelClass = "text-[15px] font-medium text-ink";

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
      {hint && !error ? <span className="text-[14px] text-muted">{hint}</span> : null}
      {error ? <span className="text-[14px] font-medium text-red-700">{error}</span> : null}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] transition-colors disabled:opacity-45 disabled:pointer-events-none";

export const dashButton = {
  solid: cn(buttonBase, "bg-ink text-paper hover:bg-gold"),
  outline: cn(buttonBase, "border border-ink/30 text-ink hover:border-gold hover:text-gold"),
  danger: cn(buttonBase, "border border-red-700/50 text-red-700 hover:bg-red-700 hover:text-paper"),
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

/** The result of a save: a visible green tick or a red warning, never fine print. */
export function FormMessage({ ok, children }: { ok?: boolean; children: ReactNode }) {
  return (
    <p
      role="status"
      className={cn(
        "px-4 py-3 text-[15px] font-medium",
        ok ? "bg-green-700/10 text-green-800" : "bg-red-700/10 text-red-800",
      )}
    >
      {ok ? "✓ " : "⚠ "}
      {children}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-6 py-14 text-center text-[16px] text-muted">{children}</p>;
}

/* ------------------------------------------------------------ row actions */

const rowButton =
  "inline-flex items-center justify-center whitespace-nowrap border px-3.5 py-2 text-[14px] transition-colors";

/** The buttons at the end of a table row, so nobody has to guess what is clickable. */
export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function RowLink({
  tone = "outline",
  className,
  ...props
}: ComponentProps<typeof Link> & { tone?: "solid" | "outline" }) {
  return (
    <Link
      className={cn(
        rowButton,
        tone === "solid"
          ? "border-ink bg-ink text-paper hover:border-gold hover:bg-gold"
          : "border-ink/30 text-ink hover:border-gold hover:text-gold",
        className,
      )}
      {...props}
    />
  );
}

/** Delete from the list, behind an "are you sure?" prompt. */
export function RowDelete({
  id,
  action,
  confirm,
}: {
  id: string;
  action: (data: FormData) => Promise<void>;
  confirm: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <ConfirmButton
        confirm={confirm}
        className={cn(
          rowButton,
          "border-red-700/40 text-red-700 hover:bg-red-700 hover:text-paper",
        )}
      >
        Delete
      </ConfirmButton>
    </form>
  );
}

/* ------------------------------------------------------------- pagination */

export const PAGE_SIZE = 20;

/** Reads `?page=` defensively: anything that is not a positive whole number is page 1. */
export function parsePage(value: string | undefined): number {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

/** Page numbers to show: the first, the last, and a few around the current one. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function Pagination({
  page,
  total,
  hrefFor,
  pageSize = PAGE_SIZE,
}: {
  page: number;
  total: number;
  hrefFor: (page: number) => string;
  pageSize?: number;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0 || pageCount === 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const step =
    "inline-flex min-w-11 items-center justify-center border px-3 py-2 text-[15px] transition-colors";
  const idle = "border-ink/25 text-ink hover:border-gold hover:text-gold";

  return (
    <nav
      aria-label="Pages"
      className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 px-4 py-5 sm:flex-row sm:px-6"
    >
      <p className="text-[15px] text-muted">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={cn(step, idle)}>
            ← Previous
          </Link>
        ) : null}
        {pageWindow(page, pageCount).map((entry, i) =>
          entry === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <Link
              key={entry}
              href={hrefFor(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={cn(step, entry === page ? "border-ink bg-ink text-paper" : idle)}
            >
              {entry}
            </Link>
          ),
        )}
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} className={cn(step, idle)}>
            Next →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

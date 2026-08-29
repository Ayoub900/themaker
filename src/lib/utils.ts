import { currency } from "@/config/site";

/** Join class names, dropping anything falsy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** "Forged bowl no. 4" -> "forged-bowl-no-4" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return dateTimeFormatter.format(new Date(date));
}

/** ISO timestamp for <time dateTime> and sitemaps. */
export function isoDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString();
}

/**
 * Order references are human-readable and sortable: TM-YYMM-XXXX.
 * The suffix is random rather than sequential so that a customer cannot infer
 * how many orders the workshop has taken.
 */
export function makeOrderNumber(now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const suffix = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `TM-${yy}${mm}-${suffix}`;
}

/** Rough reading time, used as a default when creating a journal post. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function excerptFrom(markdown: string, max = 180): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length <= max ? plain : `${plain.slice(0, max - 1).trimEnd()}…`;
}

/** `plural(3, "piece")` -> "3 pieces" */
export function plural(count: number, singular: string, pluralForm?: string): string {
  const word = count === 1 ? singular : (pluralForm ?? `${singular}s`);
  return `${count} ${word}`;
}

export const CURRENCY_CODE = currency.code;

/**
 * A Date `days` in the past. Lives here rather than inline in a component so
 * that reading the clock stays out of render, which React's purity rules — and
 * the lint that enforces them — care about.
 */
export function daysAgo(days: number, from: Date = new Date()): Date {
  return new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
}

import { currency, shipping } from "@/config/site";

/**
 * Money is handled as integer cents everywhere — in the database, in forms and
 * in transit. It is only turned into a string at the last moment, here.
 */

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(code: string, decimals: number): Intl.NumberFormat {
  const key = `${code}:${decimals}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/** 240000 -> "2 400 MAD"; 240050 -> "2 400,50 MAD". Whole amounts drop the decimals. */
export function formatCents(cents: number, code: string = currency.code): string {
  const value = cents / 100;
  return formatterFor(code, Number.isInteger(value) ? 0 : 2).format(value);
}

/** "240" or "240.50" from a form field -> 24000 */
export function parsePriceToCents(input: string | number): number {
  if (typeof input === "number") return Math.round(input * 100);
  const normalised = input.replace(/\s/g, "").replace(",", ".");
  const value = Number.parseFloat(normalised);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 100);
}

/** 240000 -> "2400.00", for populating a price input. */
export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Shipping is free above the threshold; otherwise it is the single flat
 * national rate. There are no zones — anything going abroad is quoted by
 * hand, see `shipping.internationalNote`.
 */
export function shippingCentsFor(subtotalCents: number): number {
  if (subtotalCents >= shipping.freeThresholdCents) return 0;
  return shipping.flatRateCents;
}

export function orderTotals(subtotalCents: number) {
  const shippingCents = shippingCentsFor(subtotalCents);
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

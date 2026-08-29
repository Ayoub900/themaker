"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { isImageId, type ImageRef } from "@/lib/images";

/**
 * The cart lives in localStorage so that browsing stays entirely static and
 * cacheable — no session, no database write until someone actually orders.
 *
 * localStorage is an external store, so it is read through
 * `useSyncExternalStore` rather than an effect: the server and the first client
 * pass both render the empty snapshot, React swaps in the real one after
 * hydration, and two open tabs stay in agreement for free.
 *
 * The display fields are a convenience only. Prices are recomputed from the
 * database when the order is placed, so a tampered cart cannot change what
 * anything costs.
 */

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  material: string;
  reference: string;
  unitCents: number;
  imageSlot: string;
  image: ImageRef | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  /** False during SSR and the first client pass, true once hydrated. */
  ready: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "tm.cart.v1";
const MAX_PER_LINE = 25;

/**
 * A photograph as it was when the piece went into the cart. Like every other
 * display field here it is read back from a store the customer can edit, so
 * it is checked rather than trusted: a bad id would otherwise be requested
 * from the image route on every render of the cart.
 */
function parseImage(value: unknown): ImageRef | null {
  if (typeof value !== "object" || value === null) return null;

  const image = value as Partial<ImageRef>;
  const width = Number(image.width);
  const height = Number(image.height);

  if (typeof image.id !== "string" || !isImageId(image.id)) return null;
  if (!Number.isInteger(width) || !Number.isInteger(height)) return null;
  if (width < 1 || height < 1) return null;

  return { id: image.id, width, height, alt: String(image.alt ?? "") };
}

/** Stable empty array — a new one each read would loop useSyncExternalStore. */
const EMPTY: CartLine[] = [];

/* ------------------------------------------------------------------ store */

const listeners = new Set<() => void>();

/** Cached so repeated getSnapshot calls return the same reference. */
let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const lines = parsed.flatMap((entry): CartLine[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const line = entry as Partial<CartLine>;
      if (typeof line.productId !== "string" || typeof line.slug !== "string") return [];

      return [
        {
          productId: line.productId,
          slug: line.slug,
          name: String(line.name ?? ""),
          material: String(line.material ?? ""),
          reference: String(line.reference ?? ""),
          unitCents: Number(line.unitCents ?? 0),
          imageSlot: String(line.imageSlot ?? "[ product ]"),
          image: parseImage(line.image),
          quantity: Math.min(MAX_PER_LINE, Math.max(1, Number(line.quantity ?? 1))),
        },
      ];
    });

    return lines.length > 0 ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }
  return cachedLines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` fires in *other* tabs; our own writes notify directly.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(next: CartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or a full quota — the cart simply will not persist.
  }
  for (const listener of listeners) listener();
}

/* --------------------------------------------------------------- provider */

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const update = useCallback(
    (change: (current: CartLine[]) => CartLine[]) => {
      write(change(getSnapshot()));
    },
    [],
  );

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      update((current) => {
        const existing = current.find((item) => item.productId === line.productId);
        if (existing) {
          return current.map((item) =>
            item.productId === line.productId
              ? { ...item, quantity: Math.min(MAX_PER_LINE, item.quantity + quantity) }
              : item,
          );
        }
        return [...current, { ...line, quantity: Math.min(MAX_PER_LINE, quantity) }];
      });
    },
    [update],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      update((current) =>
        quantity <= 0
          ? current.filter((item) => item.productId !== productId)
          : current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(MAX_PER_LINE, quantity) }
                : item,
            ),
      );
    },
    [update],
  );

  const remove = useCallback(
    (productId: string) => {
      update((current) => current.filter((item) => item.productId !== productId));
    },
    [update],
  );

  const clear = useCallback(() => update(() => []), [update]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalCents = lines.reduce(
      (sum, line) => sum + line.unitCents * line.quantity,
      0,
    );
    return { lines, count, subtotalCents, ready, add, setQuantity, remove, clear };
  }, [lines, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}

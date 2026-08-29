"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart, type CartLine } from "@/components/shop/cart-provider";
import { Button } from "@/components/ui";

export function AddToCart({
  line,
  inStock,
}: {
  line: Omit<CartLine, "quantity">;
  inStock: boolean;
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(line, quantity);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-ink/20">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="px-4 py-3.5 text-lg leading-none text-muted transition-colors hover:text-gold disabled:opacity-35"
          >
            −
          </button>
          <span
            aria-live="polite"
            className="min-w-10 text-center text-[15px] lining-nums tabular-nums"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(25, value + 1))}
            disabled={quantity >= 25}
            aria-label="Increase quantity"
            className="px-4 py-3.5 text-lg leading-none text-muted transition-colors hover:text-gold disabled:opacity-35"
          >
            +
          </button>
        </div>

        <Button type="button" onClick={onAdd} className="flex-1 sm:flex-none">
          {inStock ? "Add to cart" : "Order — made to order"}
        </Button>
      </div>

      {added ? (
        <p role="status" className="text-[13px] text-muted">
          Added.{" "}
          <Link href="/cart" className="border-b border-gold pb-0.5 text-ink hover:text-gold">
            Go to your cart
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

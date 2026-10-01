import Link from "next/link";

import { ImageSlot } from "@/components/ui";
import { formatCents } from "@/lib/money";
import type { ProductCard as ProductCardData } from "@/lib/queries";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3.5"
      prefetch={priority}
    >
      <ImageSlot
        label={product.imageSlot}
        image={product.images[0]}
        ratio="4 / 5"
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        priority={priority}
        className="transition-opacity duration-300 group-hover:opacity-85"
      />

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[1.6rem] leading-tight transition-colors group-hover:text-gold">
          {product.name}
        </h3>
        <span className="shrink-0 text-[15px] text-muted">
          {formatCents(product.priceCents, product.currency)}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] tracking-[0.08em] text-faint">
          {product.material}
        </span>
        {(product.stock ?? 0) === 0 ? (
          <span className="text-[11px] uppercase tracking-[0.16em] text-gold">
            Made to order
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  columns = 3,
}: {
  products: ProductCardData[];
  columns?: 2 | 3 | 4;
}) {
  const columnClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-x-8 gap-y-12 ${columnClass}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  );
}

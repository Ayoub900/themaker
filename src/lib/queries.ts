import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

/**
 * Read helpers for the public storefront.
 *
 * Each is wrapped in React's `cache` so that a page rendering the same product
 * in two places (body and structured data, say) hits Mongo once. Pages layer
 * ISR on top with `export const revalidate`, and dashboard mutations call
 * `revalidatePath` to push changes out immediately.
 */

/** Fields the storefront needs for a listing card. */
const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  reference: true,
  material: true,
  collection: true,
  summary: true,
  priceCents: true,
  currency: true,
  stock: true,
  imageSlot: true,
  images: true,
  featured: true,
} as const;

export type ProductCard = Awaited<ReturnType<typeof getProducts>>[number];

export const getProducts = cache(async (collection?: string) => {
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(collection && collection !== "all" ? { collection } : {}),
    },
    orderBy: [{ sortIndex: "asc" }, { name: "asc" }],
    select: productCardSelect,
  });
});

export const getFeaturedProducts = cache(async (take = 6) => {
  const featured = await prisma.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ sortIndex: "asc" }],
    take,
    select: productCardSelect,
  });

  if (featured.length >= take) return featured;

  // Top up from the rest of the catalogue so the grid is never ragged.
  const filler = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { notIn: featured.map((product) => product.id) },
    },
    orderBy: [{ sortIndex: "asc" }],
    take: take - featured.length,
    select: productCardSelect,
  });

  return [...featured, ...filler];
});

export const getCollections = cache(async () => {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { collection: true },
    distinct: ["collection"],
    orderBy: { collection: "asc" },
  });
  return rows.map((row) => row.collection);
});

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
});

export const getRelatedProducts = cache(
  async (collection: string, excludeId: string, take = 3) => {
    const related = await prisma.product.findMany({
      where: { status: "PUBLISHED", collection, id: { not: excludeId } },
      orderBy: { sortIndex: "asc" },
      take,
      select: productCardSelect,
    });

    if (related.length >= take) return related;

    const filler = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: [excludeId, ...related.map((product) => product.id)] },
      },
      orderBy: { sortIndex: "asc" },
      take: take - related.length,
      select: productCardSelect,
    });

    return [...related, ...filler];
  },
);

/** All published slugs, for the sitemap and static params. */
export const getProductSlugs = cache(async () => {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
});

// ------------------------------------------------------------------ journal

const postCardSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  excerpt: true,
  readMinutes: true,
  author: true,
  imageSlot: true,
  image: true,
  cluster: true,
  publishedAt: true,
  featured: true,
} as const;

export type PostCard = Awaited<ReturnType<typeof getPosts>>[number];

export const getPosts = cache(async (take?: number) => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    ...(take ? { take } : {}),
    select: postCardSelect,
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { not: null } },
  });
});

/**
 * What to read next: the same cluster first — keeping links inside the topic
 * is the point of the cocoon — then the same category, then anything.
 */
export const getRelatedPosts = cache(
  async (
    { cluster, category }: { cluster: string | null; category: string },
    excludeId: string,
    take = 2,
  ) => {
    const related = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        ...(cluster ? { cluster } : { category }),
        id: { not: excludeId },
      },
      orderBy: { publishedAt: "desc" },
      take,
      select: postCardSelect,
    });

    if (related.length >= take) return related;

    const filler = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        id: { notIn: [excludeId, ...related.map((post) => post.id)] },
      },
      orderBy: { publishedAt: "desc" },
      take: take - related.length,
      select: postCardSelect,
    });

    return [...related, ...filler];
  },
);

export const getPostSlugs = cache(async () => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
  });
});

/** Every published post in a topic cluster, oldest first — reading order. */
export const getClusterPosts = cache(async (cluster: string) => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null }, cluster },
    orderBy: { publishedAt: "asc" },
    select: postCardSelect,
  });
});

/** Published posts by slug, in the order asked for. */
export const getPostsBySlugs = cache(async (slugs: readonly string[]) => {
  if (slugs.length === 0) return [];
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null }, slug: { in: [...slugs] } },
    select: postCardSelect,
  });
  const bySlug = new Map(rows.map((post) => [post.slug, post]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
});

/** The articles that recommend a product — its links back into the journal. */
export const getPostsForProduct = cache(async (productSlug: string, take = 3) => {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      products: { has: productSlug },
    },
    orderBy: { publishedAt: "desc" },
    take,
    select: postCardSelect,
  });
});

/** Published products by slug, in the order asked for. */
export const getProductsBySlugs = cache(async (slugs: readonly string[]) => {
  if (slugs.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED", slug: { in: [...slugs] } },
    select: productCardSelect,
  });
  const bySlug = new Map(rows.map((product) => [product.slug, product]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
});

// ------------------------------------------------------------------- orders

/** Used by the confirmation page, keyed on the order number the customer has. */
export const getOrderByNumber = cache(async (number: string) => {
  return prisma.order.findUnique({ where: { number } });
});

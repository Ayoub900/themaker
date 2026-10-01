/**
 * Seeds the workshop with its catalogue, journal, an admin account and a
 * handful of realistic orders and messages so the dashboard has something to
 * show on first run.
 *
 *   npm run db:push && npm run db:seed
 *
 * Safe to re-run: everything is upserted on a natural key.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { currency } from "../src/config/site.js";
import { products } from "./data/products.js";
import { posts } from "./data/posts.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { postImages, productImages } from "./data/images.js";

const prisma = new PrismaClient();

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "uploads");

/** Pixel size of a seeded JPEG or PNG, read from its header. */
function pixelSize(bytes: Buffer): { width: number; height: number } | null {
  if (bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  let at = 2;
  while (at + 9 < bytes.length && bytes[at] === 0xff) {
    const marker = bytes[at + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: bytes.readUInt16BE(at + 7), height: bytes.readUInt16BE(at + 5) };
    }
    at += 2 + bytes.readUInt16BE(at + 2);
  }
  return null;
}

/** A seeded photograph, sized from its file — skipped if the file is missing. */
async function seedImage(image: { id: string; alt: string }) {
  const bytes = await readFile(path.join(UPLOAD_DIR, image.id)).catch(() => null);
  const size = bytes ? pixelSize(bytes) : null;
  if (!size) {
    console.warn(`  (no upload file for ${image.id} — seeded without it)`);
    return null;
  }
  return { id: image.id, alt: image.alt, ...size };
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@themaker.ma").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is not set. Put a strong password in .env before seeding — the dashboard login depends on it.",
    );
  }
  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: process.env.SEED_ADMIN_NAME ?? "Salma Bennani",
      passwordHash,
      role: "ADMIN",
    },
    // Re-seeding resets the password to whatever is currently in .env.
    update: { passwordHash, role: "ADMIN", isActive: true },
  });

  console.log(`  admin ....... ${user.email}`);
  return user;
}

async function seedProducts() {
  for (const [index, product] of products.entries()) {
    const data = {
      name: product.name,
      reference: product.reference,
      material: product.material,
      collection: product.collection,
      summary: product.summary,
      description: product.description,
      priceCents: product.priceCents,
      currency: currency.code,
      stock: product.stock > 0 ? product.stock : null,
      leadTime: product.leadTime,
      dimensions: product.dimensions,
      weight: product.weight,
      care: product.care,
      imageSlot: product.imageSlot,
      specs: product.specs,
      status: "PUBLISHED" as const,
      featured: product.featured,
      sortIndex: index,
      seoTitle: `${product.name} — ${product.material}`,
      seoDescription: product.summary,
    };

    const images = (
      await Promise.all((productImages[product.slug] ?? []).map(seedImage))
    ).flatMap((image) => image ?? []);

    await prisma.product.upsert({
      where: { slug: product.slug },
      // Re-seeding must not throw away photographs uploaded through the
      // dashboard since, so the seeded ones are set on creation only.
      create: { slug: product.slug, ...data, images },
      update: data,
    });
  }
  console.log(`  products .... ${products.length}`);
}

async function seedPosts() {
  for (const post of posts) {
    const publishedAt = daysAgo(post.daysAgo);
    const data = {
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      body: post.body,
      readMinutes: post.readMinutes,
      author: post.author,
      tags: post.tags,
      imageSlot: post.imageSlot,
      cluster: post.cluster,
      products: post.products,
      takeaways: post.takeaways,
      faqs: post.faqs,
      status: "PUBLISHED" as const,
      featured: post.featured,
      publishedAt,
      seoTitle: post.title,
      seoDescription: post.excerpt,
    };

    await prisma.post.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        ...data,
        image: postImages[post.slug] ? await seedImage(postImages[post.slug]) : null,
      },
      update: data,
    });
  }
  console.log(`  posts ....... ${posts.length}`);
}

async function seedOrders() {
  const catalogue = await prisma.product.findMany({
    where: { slug: { in: ["star-chandelier"] } },
  });
  const bySlug = new Map(catalogue.map((product) => [product.slug, product]));

  const line = (slug: string, quantity: number) => {
    const product = bySlug.get(slug);
    if (!product) throw new Error(`Seed order references a missing product: ${slug}`);
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      material: product.material,
      reference: product.reference,
      unitCents: product.priceCents,
      quantity,
    };
  };

  const drafts = [
    {
      number: "TM-2607-4K2A",
      customerName: "Camille Roussel",
      customerEmail: "camille.roussel@example.ma",
      customerPhone: "+212 6 12 45 88 03",
      address: {
        line1: "14 rue Ibn Battouta",
        line2: "3e étage",
        city: "Rabat",
        postalCode: "10000",
        country: "Morocco",
      },
      items: [line("star-chandelier", 1)],
      shippingCents: 9_000,
      status: "SHIPPED" as const,
      customerNote: "No rush — I am away until the 20th.",
      createdDaysAgo: 9,
    },
    {
      number: "TM-2608-9QX1",
      customerName: "Jonas Weiss",
      customerEmail: "j.weiss@example.ma",
      customerPhone: null,
      address: {
        line1: "27 rue de la Kasbah",
        line2: null,
        city: "Tanger",
        postalCode: "90000",
        country: "Morocco",
      },
      items: [line("star-chandelier", 1)],
      shippingCents: 9_000,
      status: "IN_PRODUCTION" as const,
      customerNote: null,
      createdDaysAgo: 4,
    },
    {
      number: "TM-2608-B7M5",
      customerName: "Studio Levant",
      customerEmail: "atelier@studiolevant.example",
      customerPhone: "+212 5 22 00 55 19",
      address: {
        line1: "8 boulevard Moulay Youssef",
        line2: null,
        city: "Casablanca",
        postalCode: "20000",
        country: "Morocco",
      },
      items: [line("star-chandelier", 2)],
      shippingCents: 0,
      status: "PENDING" as const,
      customerNote: "For the Anfa flat — one for the entrance, one for the salon.",
      createdDaysAgo: 1,
    },
  ];

  for (const draft of drafts) {
    const subtotalCents = draft.items.reduce(
      (sum, item) => sum + item.unitCents * item.quantity,
      0,
    );
    const createdAt = daysAgo(draft.createdDaysAgo);

    await prisma.order.upsert({
      where: { number: draft.number },
      create: {
        number: draft.number,
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        address: draft.address,
        items: draft.items,
        subtotalCents,
        shippingCents: draft.shippingCents,
        totalCents: subtotalCents + draft.shippingCents,
        currency: currency.code,
        status: draft.status,
        customerNote: draft.customerNote,
        createdAt,
      },
      update: {
        status: draft.status,
        subtotalCents,
        shippingCents: draft.shippingCents,
        totalCents: subtotalCents + draft.shippingCents,
        currency: currency.code,
      },
    });
  }
  console.log(`  orders ...... ${drafts.length}`);
}

async function seedMessages() {
  const drafts = [
    {
      name: "Hélène Marchand",
      email: "h.marchand@example.ma",
      topic: "COMMISSION" as const,
      subject: "Door pulls for a stair hall",
      body: "We are restoring a 1930s building in the Habous quarter and need eleven pulls across two door sizes. Is bronze possible at that quantity, and what would the lead time look like for a September install?",
      status: "NEW" as const,
      createdDaysAgo: 1,
    },
    {
      name: "Peter Lund",
      email: "peter@example.ma",
      topic: "REPAIR" as const,
      subject: "Sconce bought in 2019 — flickering",
      body: "One of the two courtyard sconces has started flickering. The fitting looks fine from the outside. Do I post it back to you or can this be done locally without voiding anything?",
      status: "READ" as const,
      createdDaysAgo: 3,
    },
    {
      name: "Mireille Fabre",
      email: "mireille.fabre@example.ma",
      topic: "VISIT" as const,
      subject: "Visiting on a Saturday",
      body: "I would like to come and see the bowls in person before ordering. Would this Saturday morning suit, and is there parking near the workshop?",
      status: "REPLIED" as const,
      reply: "Saturday from 10 suits us. There is no parking in the courtyard, but there is a car park a five minute walk away. Salma will be at the bench.",
      createdDaysAgo: 8,
    },
    {
      name: "Ana Ruiz",
      email: "aruiz@example.ma",
      topic: "ORDER" as const,
      subject: "Shipping to Agadir",
      body: "Do you ship to Agadir, and is the 90 MAD flat rate correct for a single tray? Also — is the tinning genuinely food safe for citrus?",
      status: "NEW" as const,
      createdDaysAgo: 0,
    },
  ];

  // Messages have no natural key, so only seed them into an empty inbox.
  const existing = await prisma.message.count();
  if (existing > 0) {
    console.log(`  messages .... skipped (${existing} already present)`);
    return;
  }

  for (const draft of drafts) {
    await prisma.message.create({
      data: {
        name: draft.name,
        email: draft.email,
        topic: draft.topic,
        subject: draft.subject,
        body: draft.body,
        status: draft.status,
        reply: "reply" in draft ? (draft.reply as string) : null,
        repliedAt: "reply" in draft ? daysAgo(draft.createdDaysAgo - 1) : null,
        createdAt: daysAgo(draft.createdDaysAgo),
      },
    });
  }
  console.log(`  messages .... ${drafts.length}`);
}

async function main() {
  console.log("\nSeeding The Maker\n");
  await seedAdmin();
  await seedProducts();
  await seedPosts();
  await seedOrders();
  await seedMessages();
  console.log("\nDone.\n");
}

main()
  .catch((error) => {
    console.error("\nSeed failed:\n", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

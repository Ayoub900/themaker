import { z } from "zod";

import { getCluster } from "@/config/clusters";

/** Every form in the app — public and dashboard — validates through here. */

const trimmed = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Passwords are at least 8 characters.").max(200),
});

export const contactSchema = z.object({
  name: trimmed(2, 120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  topic: z.enum(["GENERAL", "COMMISSION", "REPAIR", "ORDER", "PRESS", "VISIT"]),
  subject: trimmed(3, 160),
  body: trimmed(10, 5000),
  /** Honeypot. Accepted by the schema so the handler can fail silently. */
  company: z.string().max(200).optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(25),
});

export const checkoutSchema = z.object({
  customerName: trimmed(2, 120),
  customerEmail: z.string().trim().toLowerCase().email("Enter a valid email address."),
  customerPhone: z
    .string()
    .trim()
    .min(6, "Enter a telephone number we can reach you on.")
    .max(40),
  line1: trimmed(3, 160),
  line2: z.string().trim().max(160).optional().or(z.literal("")),
  city: trimmed(2, 90),
  postalCode: trimmed(2, 20),
  country: trimmed(2, 90),
  customerNote: z.string().trim().max(2000).optional().or(z.literal("")),
  items: z.array(cartItemSchema).min(1, "Your cart is empty.").max(50),
  /** Honeypot. Accepted by the schema so the handler can fail silently. */
  company: z.string().max(200).optional(),
});

const contentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const productSchema = z.object({
  name: trimmed(2, 160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  reference: trimmed(1, 40),
  material: trimmed(2, 120),
  collection: trimmed(2, 80),
  summary: trimmed(10, 300),
  description: trimmed(10, 20000),
  priceCents: z.number().int().min(0).max(100_000_000),
  stock: z.number().int().min(0).max(10_000),
  leadTime: trimmed(2, 120),
  dimensions: z.string().trim().max(200).optional().or(z.literal("")),
  weight: z.string().trim().max(120).optional().or(z.literal("")),
  care: z.string().trim().max(2000).optional().or(z.literal("")),
  imageSlot: z.string().trim().max(120),
  status: contentStatus,
  featured: z.boolean(),
  sortIndex: z.number().int().min(0).max(9999),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(180).optional().or(z.literal("")),
});

export const postSchema = z.object({
  title: trimmed(3, 200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  category: trimmed(2, 60),
  excerpt: trimmed(10, 400),
  body: trimmed(20, 100_000),
  readMinutes: z.number().int().min(1).max(120),
  author: trimmed(2, 120),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  imageSlot: z.string().trim().max(120),
  status: contentStatus,
  featured: z.boolean(),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(180).optional().or(z.literal("")),
  cluster: z
    .string()
    .trim()
    .refine((key) => key === "" || getCluster(key) !== null, "Pick a guide from the list.")
    .transform((key) => key || null),
  products: z.array(z.string().max(200)).max(8),
  takeaways: z.array(z.string().max(400, "Keep each point under 400 characters.")).max(8),
  faqs: z
    .array(z.object({ q: z.string().max(300), a: z.string().max(2000) }))
    .max(12),
});

export const orderUpdateSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "SHIPPED",
    "COMPLETED",
    "CANCELLED",
  ]),
  internalNote: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const messageUpdateSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]),
  reply: z.string().trim().max(8000).optional().or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8).max(200),
    newPassword: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(200)
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[0-9]/, "Include a digit."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The two new passwords do not match.",
    path: ["confirmPassword"],
  });

export type ContactInput = z.infer<typeof contactSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type PostInput = z.infer<typeof postSchema>;

/** Flatten a ZodError into `{ field: "first message" }` for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

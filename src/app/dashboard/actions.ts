"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { inspectImage } from "@/lib/image-file";
import {
  MAX_IMAGE_ALT,
  MAX_PRODUCT_IMAGES,
  isImageId,
  type ImageRef,
} from "@/lib/images";
import { hashPassword, verifyPassword } from "@/lib/password";
import { parsePriceToCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { deleteUploads, readUpload } from "@/lib/uploads";
import { readingMinutes, slugify } from "@/lib/utils";
import {
  fieldErrors,
  messageUpdateSchema,
  orderUpdateSchema,
  passwordChangeSchema,
  postSchema,
  productSchema,
} from "@/lib/validation";

/**
 * Every action below calls `requireSession` first. Middleware only guards
 * navigations — an action is a POST endpoint of its own and has to check.
 */

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

const str = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const bool = (data: FormData, key: string) => data.get(key) === "on" || data.get(key) === "true";
const int = (data: FormData, key: string, fallback = 0) => {
  const value = Number.parseInt(str(data, key), 10);
  return Number.isFinite(value) ? value : fallback;
};

/* ------------------------------------------------------------ photographs */

/**
 * Photographs arrive as parallel `imageId`/`imageAlt` inputs. The files
 * themselves went up the moment they were chosen, so the form carries only
 * their ids — see `/api/dashboard/images`.
 *
 * The pixel size is read back from the file itself rather than taken from the
 * form. It is what every page reserves its space with, and an action is a
 * public POST endpoint whose fields can say anything.
 */
async function readImages(
  data: FormData,
  fallbackAlt: string,
  max: number,
): Promise<ImageRef[]> {
  const alts = data.getAll("imageAlt").map((value) => String(value).trim());

  const chosen = data
    .getAll("imageId")
    .map((value, index) => ({ id: String(value).trim(), alt: alts[index] ?? "" }))
    .filter((entry) => isImageId(entry.id))
    .slice(0, max);

  if (chosen.length === 0) return [];

  const stored = await Promise.all(
    chosen.map(async (entry) => {
      const bytes = await readUpload(entry.id);
      return bytes ? inspectImage(bytes) : null;
    }),
  );

  // An id with no file behind it is dropped rather than saved as a
  // reference to nothing — the upload can only have been deleted since.
  return chosen.flatMap((entry, index) => {
    const image = stored[index];
    if (!image) return [];
    return [
      {
        id: entry.id,
        width: image.width,
        height: image.height,
        alt: (entry.alt || fallbackAlt).slice(0, MAX_IMAGE_ALT),
      },
    ];
  });
}

/**
 * Delete the files a piece has stopped pointing at. Nothing else references
 * them — a photograph belongs to one product or one post — so removing it
 * from the form, replacing it, or deleting the piece all mean the same thing.
 */
async function discardImages(
  previous: readonly { id: string }[],
  keeping: readonly { id: string }[] = [],
): Promise<void> {
  const kept = new Set(keeping.map((image) => image.id));
  const dropped = previous.filter((image) => !kept.has(image.id)).map((image) => image.id);

  if (dropped.length > 0) {
    await deleteUploads(dropped);
  }
}

/** Turn a thrown auth error into something the form can render. */
function authFailure(error: unknown): ActionState | null {
  if (error instanceof Error && (error.message === "UNAUTHORISED" || error.message === "FORBIDDEN")) {
    return { ok: false, message: "Your session has expired. Sign in again." };
  }
  return null;
}

/** Refresh the public pages a change can affect. */
function revalidateProduct(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/products/${slug}`);
}

function revalidatePost(slug?: string) {
  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/journal/${slug}`);
}

/* -------------------------------------------------------------- products */

function readProductForm(data: FormData) {
  const name = str(data, "name");
  return {
    name,
    slug: slugify(str(data, "slug") || name),
    reference: str(data, "reference"),
    material: str(data, "material"),
    collection: str(data, "collection") || "Catalogue",
    summary: str(data, "summary"),
    description: str(data, "description"),
    priceCents: parsePriceToCents(str(data, "price")),
    stock: int(data, "stock"),
    leadTime: str(data, "leadTime") || "Ships in 5 working days",
    dimensions: str(data, "dimensions"),
    weight: str(data, "weight"),
    care: str(data, "care"),
    imageSlot: str(data, "imageSlot") || "[ product ]",
    status: str(data, "status") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    featured: bool(data, "featured"),
    sortIndex: int(data, "sortIndex"),
    seoTitle: str(data, "seoTitle"),
    seoDescription: str(data, "seoDescription"),
  };
}

/** Specs arrive as parallel `specLabel`/`specValue` inputs. */
function readSpecs(data: FormData) {
  const labels = data.getAll("specLabel").map((value) => String(value).trim());
  const values = data.getAll("specValue").map((value) => String(value).trim());

  return labels
    .map((label, index) => ({ label, value: values[index] ?? "" }))
    .filter((spec) => spec.label.length > 0 && spec.value.length > 0)
    .slice(0, 12);
}

export async function saveProduct(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    await requireSession();

    const id = str(data, "id");
    const parsed = productSchema.safeParse(readProductForm(data));

    if (!parsed.success) {
      return {
        ok: false,
        message: "Some fields need attention.",
        errors: fieldErrors(parsed.error),
      };
    }

    const specs = readSpecs(data);
    const images = await readImages(data, parsed.data.name, MAX_PRODUCT_IMAGES);

    // Slugs are the public URL, so a collision has to be caught explicitly.
    const clash = await prisma.product.findFirst({
      where: { slug: parsed.data.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return {
        ok: false,
        message: "Another product already uses that address.",
        errors: { slug: "This slug is taken." },
      };
    }

    const values = { ...parsed.data, specs, images };

    if (id) {
      const before = await prisma.product.findUnique({
        where: { id },
        select: { images: true },
      });

      const product = await prisma.product.update({ where: { id }, data: values });
      await discardImages(before?.images ?? [], images);

      revalidateProduct(product.slug);
      revalidatePath(`/dashboard/products/${id}`);
      return { ok: true, message: "Saved." };
    }

    const created = await prisma.product.create({ data: values });
    revalidateProduct(created.slug);
    redirectTo = `/dashboard/products/${created.id}`;
  } catch (error) {
    const failure = authFailure(error);
    if (failure) return failure;
    console.error("saveProduct failed", error);
    return { ok: false, message: "That could not be saved. Try again." };
  }

  // redirect() throws, so it must sit outside the try block.
  if (redirectTo) redirect(redirectTo);
  return { ok: true };
}

export async function deleteProduct(data: FormData): Promise<void> {
  await requireSession();
  const id = str(data, "id");
  if (!id) return;

  const product = await prisma.product.delete({ where: { id } });
  await discardImages(product.images);

  revalidateProduct(product.slug);
  redirect("/dashboard/products");
}

/* ----------------------------------------------------------------- posts */

function readPostForm(data: FormData) {
  const title = str(data, "title");
  const body = str(data, "body");
  const declared = int(data, "readMinutes");

  return {
    title,
    slug: slugify(str(data, "slug") || title),
    category: str(data, "category") || "Workshop",
    excerpt: str(data, "excerpt"),
    body,
    readMinutes: declared > 0 ? declared : readingMinutes(body),
    author: str(data, "author") || "The Maker",
    tags: str(data, "tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 12),
    imageSlot: str(data, "imageSlot") || "[ journal image ]",
    status: str(data, "status") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    featured: bool(data, "featured"),
    seoTitle: str(data, "seoTitle"),
    seoDescription: str(data, "seoDescription"),
  };
}

export async function savePost(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    await requireSession();

    const id = str(data, "id");
    const parsed = postSchema.safeParse(readPostForm(data));

    if (!parsed.success) {
      return {
        ok: false,
        message: "Some fields need attention.",
        errors: fieldErrors(parsed.error),
      };
    }

    const clash = await prisma.post.findFirst({
      where: { slug: parsed.data.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return {
        ok: false,
        message: "Another post already uses that address.",
        errors: { slug: "This slug is taken." },
      };
    }

    const existing = id
      ? await prisma.post.findUnique({
          where: { id },
          select: { publishedAt: true, image: true },
        })
      : null;

    const [image] = await readImages(data, parsed.data.title, 1);

    // Stamp the publication date the first time it goes live, and keep it.
    const publishedAt =
      parsed.data.status === "PUBLISHED"
        ? (existing?.publishedAt ?? new Date())
        : (existing?.publishedAt ?? null);

    const values = { ...parsed.data, publishedAt, image: image ?? null };

    if (id) {
      const post = await prisma.post.update({ where: { id }, data: values });
      await discardImages(existing?.image ? [existing.image] : [], image ? [image] : []);

      revalidatePost(post.slug);
      revalidatePath(`/dashboard/posts/${id}`);
      return { ok: true, message: "Saved." };
    }

    const created = await prisma.post.create({ data: values });
    revalidatePost(created.slug);
    redirectTo = `/dashboard/posts/${created.id}`;
  } catch (error) {
    const failure = authFailure(error);
    if (failure) return failure;
    console.error("savePost failed", error);
    return { ok: false, message: "That could not be saved. Try again." };
  }

  if (redirectTo) redirect(redirectTo);
  return { ok: true };
}

export async function deletePost(data: FormData): Promise<void> {
  await requireSession();
  const id = str(data, "id");
  if (!id) return;

  const post = await prisma.post.delete({ where: { id } });
  await discardImages(post.image ? [post.image] : []);

  revalidatePost(post.slug);
  redirect("/dashboard/posts");
}

/* ---------------------------------------------------------------- orders */

export async function updateOrder(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  try {
    await requireSession();

    const parsed = orderUpdateSchema.safeParse({
      id: str(data, "id"),
      status: str(data, "status"),
      internalNote: str(data, "internalNote"),
    });

    if (!parsed.success) {
      return { ok: false, message: "That status is not valid." };
    }

    const { id, status, internalNote } = parsed.data;
    const before = await prisma.order.findUnique({ where: { id } });
    if (!before) return { ok: false, message: "That order no longer exists." };

    // Confirming an order is what takes the pieces out of stock; cancelling a
    // confirmed order puts them back. Both are done once, never twice.
    const wasCommitted = before.status !== "PENDING" && before.status !== "CANCELLED";
    const willCommit = status !== "PENDING" && status !== "CANCELLED";

    if (!wasCommitted && willCommit) {
      await Promise.all(
        before.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );
    } else if (wasCommitted && status === "CANCELLED") {
      await Promise.all(
        before.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          }),
        ),
      );
    }

    await prisma.order.update({
      where: { id },
      data: { status, internalNote: internalNote || null },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    revalidatePath("/products");

    return { ok: true, message: "Order updated." };
  } catch (error) {
    const failure = authFailure(error);
    if (failure) return failure;
    console.error("updateOrder failed", error);
    return { ok: false, message: "That could not be saved. Try again." };
  }
}

/* -------------------------------------------------------------- messages */

export async function updateMessage(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  try {
    await requireSession();

    const parsed = messageUpdateSchema.safeParse({
      id: str(data, "id"),
      status: str(data, "status"),
      reply: str(data, "reply"),
    });

    if (!parsed.success) {
      return { ok: false, message: "That could not be saved." };
    }

    const { id, status, reply } = parsed.data;

    await prisma.message.update({
      where: { id },
      data: {
        status,
        reply: reply || null,
        repliedAt: status === "REPLIED" ? new Date() : null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${id}`);

    return { ok: true, message: "Saved." };
  } catch (error) {
    const failure = authFailure(error);
    if (failure) return failure;
    console.error("updateMessage failed", error);
    return { ok: false, message: "That could not be saved. Try again." };
  }
}

/** Mark as read on open, without blocking the render. */
export async function markMessageRead(id: string): Promise<void> {
  await requireSession();
  await prisma.message.updateMany({
    where: { id, status: "NEW" },
    data: { status: "READ" },
  });
  revalidatePath("/dashboard/messages");
}

export async function deleteMessage(data: FormData): Promise<void> {
  await requireSession();
  const id = str(data, "id");
  if (!id) return;

  await prisma.message.delete({ where: { id } });
  revalidatePath("/dashboard/messages");
  redirect("/dashboard/messages");
}

/* --------------------------------------------------------------- account */

export async function changePassword(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  try {
    const session = await requireSession();

    const parsed = passwordChangeSchema.safeParse({
      currentPassword: str(data, "currentPassword"),
      newPassword: str(data, "newPassword"),
      confirmPassword: str(data, "confirmPassword"),
    });

    if (!parsed.success) {
      return {
        ok: false,
        message: "Check the fields below.",
        errors: fieldErrors(parsed.error),
      };
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return { ok: false, message: "That account no longer exists." };

    const currentOk = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!currentOk) {
      return {
        ok: false,
        message: "That is not your current password.",
        errors: { currentPassword: "Incorrect." },
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });

    return { ok: true, message: "Password changed." };
  } catch (error) {
    const failure = authFailure(error);
    if (failure) return failure;
    console.error("changePassword failed", error);
    return { ok: false, message: "That could not be saved. Try again." };
  }
}

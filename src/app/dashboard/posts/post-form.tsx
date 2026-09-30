"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deletePost, savePost, type ActionState } from "@/app/dashboard/actions";
import { ImageField } from "@/components/dashboard/image-field";
import { Field, Panel, dashButton, inputClass } from "@/components/dashboard/ui";
import { clusters } from "@/config/clusters";
import { type ImageRef } from "@/lib/images";

export type PostFormValues = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  readMinutes: number;
  author: string;
  tags: string[];
  imageSlot: string;
  image: ImageRef | null;
  status: string;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  cluster: string | null;
  products: string[];
  takeaways: string[];
  faqs: { q: string; a: string }[];
};

/** The inverse of `parseFaqs` in the save action. */
function formatFaqs(faqs: readonly { q: string; a: string }[]): string {
  return faqs.map((faq) => `Q: ${faq.q}\nA: ${faq.a}`).join("\n\n");
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : isNew ? "Create post" : "Save changes"}
    </button>
  );
}

export function PostForm({ post }: { post?: PostFormValues }) {
  const isNew = !post?.id;
  const [state, formAction] = useActionState<ActionState, FormData>(savePost, {});
  const error = (field: string) => state.errors?.[field];

  return (
    <form action={formAction} className="grid gap-6 lg:gap-8 lg:grid-cols-[1.6fr_1fr]">
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="The piece of writing">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label="Title" error={error("title")} className="sm:col-span-2">
              <input name="title" defaultValue={post?.title} required className={inputClass} />
            </Field>

            <Field
              label="Address (slug)"
              hint="Leave empty to build it from the title."
              error={error("slug")}
            >
              <input name="slug" defaultValue={post?.slug} className={inputClass} />
            </Field>

            <Field label="Category" error={error("category")}>
              <input
                name="category"
                defaultValue={post?.category ?? "Workshop"}
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Excerpt"
              hint="One or two lines. Shown on cards and used as the meta description."
              error={error("excerpt")}
              className="sm:col-span-2"
            >
              <textarea
                name="excerpt"
                defaultValue={post?.excerpt}
                required
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Body"
              hint="Markdown. Use ## for section headings. Raw HTML is ignored on purpose."
              error={error("body")}
              className="sm:col-span-2"
            >
              <textarea
                name="body"
                defaultValue={post?.body}
                required
                rows={26}
                className={`${inputClass} resize-y font-mono text-[13px] leading-relaxed`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Short answer and questions">
          <div className="grid gap-5 p-4 sm:p-6">
            <Field
              label="The short answer"
              hint="One point per line, each one a complete sentence that makes sense on its own. Shown above the body — it is what search and AI answers quote."
              error={error("takeaways")}
            >
              <textarea
                name="takeaways"
                defaultValue={post?.takeaways?.join("\n") ?? ""}
                rows={5}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Questions"
              hint="Start a question with “Q:” and its answer with “A:”, one blank line between pairs. Shown at the end and marked up for search."
              error={error("faqs")}
            >
              <textarea
                name="faqs"
                defaultValue={formatFaqs(post?.faqs ?? [])}
                rows={10}
                placeholder={"Q: How do I clean it?\nA: With a dry cloth.\n\nQ: …\nA: …"}
                className={`${inputClass} resize-y font-mono text-[13px] leading-relaxed`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Photograph">
          <ImageField
            images={post?.image ? [post.image] : []}
            altFallback={post?.title || "What this photograph shows"}
          />
        </Panel>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="Publishing">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Status">
              <select name="status" defaultValue={post?.status ?? "DRAFT"} className={inputClass}>
                <option value="DRAFT">Draft — not on the site</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 text-[14px]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={post?.featured}
                className="size-4 accent-[#C69B54]"
              />
              Feature at the top of the journal
            </label>

            <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
              <SaveButton isNew={isNew} />
              {post?.id ? (
                <Link
                  href={`/journal/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={dashButton.outline}
                >
                  View ↗
                </Link>
              ) : null}
            </div>

            {state.message ? (
              <p role="status" className={`text-[13px] ${state.ok ? "text-muted" : "text-gold"}`}>
                {state.message}
              </p>
            ) : null}
          </div>
        </Panel>

        <Panel title="Attribution">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Author" error={error("author")}>
              <input
                name="author"
                defaultValue={post?.author ?? "The Maker"}
                className={inputClass}
              />
            </Field>

            <Field
              label="Reading time"
              hint="Leave at 0 and we count the words for you."
              error={error("readMinutes")}
            >
              <input
                type="number"
                name="readMinutes"
                min={0}
                max={120}
                defaultValue={post?.readMinutes ?? 0}
                className={inputClass}
              />
            </Field>

            <Field label="Tags" hint="Comma separated. Twelve at most." error={error("tags")}>
              <input
                name="tags"
                defaultValue={post?.tags?.join(", ") ?? ""}
                placeholder="brass, patina, process"
                className={inputClass}
              />
            </Field>

            <Field
              label="Image slot"
              hint="The brief, shown in its place until a photograph is uploaded."
            >
              <input
                name="imageSlot"
                defaultValue={post?.imageSlot ?? "[ journal image ]"}
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Guide and links">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field
              label="Guide"
              hint="The topic cluster this post belongs to. It links up to that guide and the guide lists it."
              error={error("cluster")}
            >
              <select name="cluster" defaultValue={post?.cluster ?? ""} className={inputClass}>
                <option value="">None</option>
                {clusters.map((cluster) => (
                  <option key={cluster.key} value={cluster.key}>
                    {cluster.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Products"
              hint="Slugs of the pieces this post recommends, comma separated. Shown under the post, and the post is linked from each product page."
              error={error("products")}
            >
              <input
                name="products"
                defaultValue={post?.products?.join(", ") ?? ""}
                placeholder="star-chandelier, courtyard-pendant"
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Search appearance">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="SEO title" hint="Up to 70 characters." error={error("seoTitle")}>
              <input
                name="seoTitle"
                maxLength={70}
                defaultValue={post?.seoTitle ?? ""}
                className={inputClass}
              />
            </Field>

            <Field
              label="Meta description"
              hint="Up to 180 characters. Falls back to the excerpt."
              error={error("seoDescription")}
            >
              <textarea
                name="seoDescription"
                maxLength={180}
                rows={3}
                defaultValue={post?.seoDescription ?? ""}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </Panel>

        {post?.id ? (
          <Panel title="Danger">
            <div className="flex flex-col gap-3 p-4 sm:p-6">
              <p className="text-[13px] leading-relaxed text-faint">
                Deleting removes the post and its public page for good.
              </p>
              <button
                type="submit"
                formAction={deletePost}
                formNoValidate
                className={`${dashButton.danger} self-start`}
              >
                Delete post
              </button>
            </div>
          </Panel>
        ) : null}
      </div>
    </form>
  );
}

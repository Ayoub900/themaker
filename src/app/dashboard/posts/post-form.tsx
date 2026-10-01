"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deletePost, savePost, type ActionState } from "@/app/dashboard/actions";
import { ImageField } from "@/components/dashboard/image-field";
import { ConfirmButton } from "@/components/dashboard/confirm-button";
import { Field, FormMessage, Panel, dashButton, inputClass } from "@/components/dashboard/ui";
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
      {pending ? "Saving…" : isNew ? "Save the new article" : "Save changes"}
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
        <Panel title="The article">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label="Title" error={error("title")} className="sm:col-span-2">
              <input name="title" defaultValue={post?.title} required className={inputClass} />
            </Field>

            <Field
              label="Web address (optional)"
              hint="Leave empty — it is created from the title for you."
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
              label="Short introduction"
              hint="One or two sentences, shown in the list of articles."
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
              label="The article itself"
              hint="Leave an empty line between paragraphs. To make a section title, start the line with ## and a space."
              error={error("body")}
              className="sm:col-span-2"
            >
              <textarea
                name="body"
                defaultValue={post?.body}
                required
                rows={20}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Quick answer and common questions (optional)">
          <div className="grid gap-5 p-4 sm:p-6">
            <Field
              label="The quick answer"
              hint="A few key points, one per line, each a full sentence. Shown above the article — Google and AI assistants often quote them."
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
              label="Common questions"
              hint="Write “Q:” before each question and “A:” before its answer, with an empty line between pairs. Shown at the end of the article."
              error={error("faqs")}
            >
              <textarea
                name="faqs"
                defaultValue={formatFaqs(post?.faqs ?? [])}
                rows={10}
                placeholder={"Q: How do I clean it?\nA: With a dry cloth.\n\nQ: …\nA: …"}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Photo">
          <ImageField
            images={post?.image ? [post.image] : []}
            altFallback={post?.title || "What this photograph shows"}
          />
        </Panel>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="Show it on the website?">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Visibility">
              <select name="status" defaultValue={post?.status ?? "DRAFT"} className={inputClass}>
                <option value="DRAFT">Hidden — not on the website yet</option>
                <option value="PUBLISHED">Shown on the website</option>
                <option value="ARCHIVED">Put away — hidden, but kept</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 text-[16px]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={post?.featured}
                className="size-4 accent-[#C69B54]"
              />
              Pin this article at the top
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
                  See it on the website ↗
                </Link>
              ) : null}
            </div>

            {state.message ? <FormMessage ok={state.ok}>{state.message}</FormMessage> : null}
          </div>
        </Panel>

        <Panel title="Extra information">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Written by" error={error("author")}>
              <input
                name="author"
                defaultValue={post?.author ?? "The Maker"}
                className={inputClass}
              />
            </Field>

            <Field
              label="Reading time (minutes)"
              hint="Leave at 0 and it is worked out for you."
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

            <Field label="Tags" hint="Keywords separated by commas. Up to twelve." error={error("tags")}>
              <input
                name="tags"
                defaultValue={post?.tags?.join(", ") ?? ""}
                placeholder="brass, patina, process"
                className={inputClass}
              />
            </Field>

            <Field
              label="Photo description"
              hint="Shown in place of the photo until you add one. You can leave it as it is."
            >
              <input
                name="imageSlot"
                defaultValue={post?.imageSlot ?? "[ journal image ]"}
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Links to other pages">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field
              label="Related guide"
              hint="Pick the guide this article belongs to, if any."
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
              label="Related products"
              hint="Optional. The web addresses of products to show under the article, separated by commas."
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

        <Panel title="How it looks on Google (optional)">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Title on Google" hint="Leave empty and the article title is used." error={error("seoTitle")}>
              <input
                name="seoTitle"
                maxLength={70}
                defaultValue={post?.seoTitle ?? ""}
                className={inputClass}
              />
            </Field>

            <Field
              label="Description on Google"
              hint="Leave empty and the short introduction is used."
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
          <Panel title="Delete this article">
            <div className="flex flex-col gap-3 p-4 sm:p-6">
              <p className="text-[15px] leading-relaxed text-muted">
                This removes the article from the website for good. If you only want to hide it, choose “Put away” above instead.
              </p>
              <ConfirmButton
                formAction={deletePost}
                formNoValidate
                confirm="Delete this article for good? It will disappear from the website. This cannot be undone."
                className={`${dashButton.danger} self-start`}
              >
                Delete this article
              </ConfirmButton>
            </div>
          </Panel>
        ) : null}
      </div>
    </form>
  );
}

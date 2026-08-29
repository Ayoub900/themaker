"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteProduct, saveProduct, type ActionState } from "@/app/dashboard/actions";
import { ImageField } from "@/components/dashboard/image-field";
import { Field, Panel, dashButton, inputClass } from "@/components/dashboard/ui";
import { currency } from "@/config/site";
import { MAX_PRODUCT_IMAGES, type ImageRef } from "@/lib/images";
import { centsToInput } from "@/lib/money";

type Spec = { label: string; value: string };

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: string;
  reference: string;
  material: string;
  collection: string;
  summary: string;
  description: string;
  priceCents: number;
  stock: number;
  leadTime: string;
  dimensions: string | null;
  weight: string | null;
  care: string | null;
  imageSlot: string;
  images: ImageRef[];
  specs: Spec[];
  status: string;
  featured: boolean;
  sortIndex: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
    </button>
  );
}

export function ProductForm({ product }: { product?: ProductFormValues }) {
  const isNew = !product?.id;
  const [state, formAction] = useActionState<ActionState, FormData>(saveProduct, {});
  const [specs, setSpecs] = useState<Spec[]>(
    product?.specs?.length ? product.specs : [{ label: "", value: "" }],
  );

  const error = (field: string) => state.errors?.[field];

  return (
    <form action={formAction} className="grid gap-6 lg:gap-8 lg:grid-cols-[1.6fr_1fr]">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}

      {/* ------------------------------------------------------- main column */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="The piece">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label="Name" error={error("name")} className="sm:col-span-2">
              <input name="name" defaultValue={product?.name} required className={inputClass} />
            </Field>

            <Field
              label="Address (slug)"
              hint="Leave empty to build it from the name."
              error={error("slug")}
            >
              <input name="slug" defaultValue={product?.slug} className={inputClass} />
            </Field>

            <Field label="Reference" hint="e.g. 01 / 24" error={error("reference")}>
              <input name="reference" defaultValue={product?.reference} required className={inputClass} />
            </Field>

            <Field label="Material" error={error("material")}>
              <input name="material" defaultValue={product?.material} required className={inputClass} />
            </Field>

            <Field label="Collection" error={error("collection")}>
              <input
                name="collection"
                defaultValue={product?.collection ?? "Catalogue"}
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Summary"
              hint="One line. Used on cards and as the meta description fallback."
              error={error("summary")}
              className="sm:col-span-2"
            >
              <input name="summary" defaultValue={product?.summary} required className={inputClass} />
            </Field>

            <Field
              label="Description"
              hint="Markdown. Headings, lists and links; raw HTML is ignored."
              error={error("description")}
              className="sm:col-span-2"
            >
              <textarea
                name="description"
                defaultValue={product?.description}
                required
                rows={12}
                className={`${inputClass} resize-y font-mono text-[13px]`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Photographs">
          <ImageField
            images={product?.images ?? []}
            max={MAX_PRODUCT_IMAGES}
            altFallback={product?.name || "What this photograph shows"}
          />
        </Panel>

        <Panel title="Details">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label="Dimensions" error={error("dimensions")}>
              <input
                name="dimensions"
                defaultValue={product?.dimensions ?? ""}
                placeholder="Ø 220 mm × 65 mm high"
                className={inputClass}
              />
            </Field>

            <Field label="Weight" error={error("weight")}>
              <input
                name="weight"
                defaultValue={product?.weight ?? ""}
                placeholder="780 g"
                className={inputClass}
              />
            </Field>

            <Field label="Lead time" error={error("leadTime")} className="sm:col-span-2">
              <input
                name="leadTime"
                defaultValue={product?.leadTime ?? "Ships in 5 working days"}
                className={inputClass}
              />
            </Field>

            <Field label="Care note" error={error("care")} className="sm:col-span-2">
              <textarea
                name="care"
                defaultValue={product?.care ?? ""}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <input
              type="hidden"
              name="imageSlot"
              defaultValue={product?.imageSlot ?? "[ product ]"}
            />
          </div>
        </Panel>

        <Panel
          title="Specification"
          action={
            <button
              type="button"
              onClick={() => setSpecs((rows) => [...rows, { label: "", value: "" }])}
              className={dashButton.outline}
            >
              Add row
            </button>
          }
        >
          <div className="flex flex-col gap-3 p-4 sm:p-6">
            {specs.map((spec, index) => (
              <div key={index} className="flex flex-wrap gap-3">
                <input
                  name="specLabel"
                  defaultValue={spec.label}
                  placeholder="Metal"
                  className={`${inputClass} sm:w-48`}
                />
                <input
                  name="specValue"
                  defaultValue={spec.value}
                  placeholder="CuZn37 sheet brass, 1.5 mm"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => setSpecs((rows) => rows.filter((_, i) => i !== index))}
                  aria-label={`Remove specification row ${index + 1}`}
                  className="px-3 text-[18px] leading-none text-faint hover:text-gold"
                >
                  ×
                </button>
              </div>
            ))}
            <p className="text-[12px] text-faint">
              Empty rows are dropped when you save. Twelve at most.
            </p>
          </div>
        </Panel>
      </div>

      {/* -------------------------------------------------------- side column */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="Publishing">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Status">
              <select
                name="status"
                defaultValue={product?.status ?? "DRAFT"}
                className={inputClass}
              >
                <option value="DRAFT">Draft — not on the site</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 text-[14px]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="size-4 accent-[#C69B54]"
              />
              Show on the home page
            </label>

            <Field label="Sort order" hint="Lower numbers come first.">
              <input
                type="number"
                name="sortIndex"
                min={0}
                defaultValue={product?.sortIndex ?? 0}
                className={inputClass}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
              <SaveButton isNew={isNew} />
              {product?.id ? (
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={dashButton.outline}
                >
                  View ↗
                </Link>
              ) : null}
            </div>

            {state.message ? (
              <p
                role="status"
                className={`text-[13px] ${state.ok ? "text-muted" : "text-gold"}`}
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </Panel>

        <Panel title="Price & stock">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label={`Price (${currency.symbol})`} error={error("priceCents")}>
              <input
                name="price"
                inputMode="decimal"
                defaultValue={product ? centsToInput(product.priceCents) : ""}
                placeholder="240.00"
                required
                className={inputClass}
              />
            </Field>

            <Field label="In stock" error={error("stock")}>
              <input
                type="number"
                name="stock"
                min={0}
                defaultValue={product?.stock ?? 0}
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Search appearance">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field
              label="SEO title"
              hint="Up to 70 characters. Falls back to the product name."
              error={error("seoTitle")}
            >
              <input
                name="seoTitle"
                maxLength={70}
                defaultValue={product?.seoTitle ?? ""}
                className={inputClass}
              />
            </Field>

            <Field
              label="Meta description"
              hint="Up to 180 characters. Falls back to the summary."
              error={error("seoDescription")}
            >
              <textarea
                name="seoDescription"
                maxLength={180}
                rows={3}
                defaultValue={product?.seoDescription ?? ""}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </Panel>

        {product?.id ? (
          <Panel title="Danger">
            <div className="flex flex-col gap-3 p-4 sm:p-6">
              <p className="text-[13px] leading-relaxed text-faint">
                Deleting removes the product and its public page. Past orders keep their
                own copy of the line, so history is not affected.
              </p>
              <button
                type="submit"
                formAction={deleteProduct}
                formNoValidate
                className={`${dashButton.danger} self-start`}
              >
                Delete product
              </button>
            </div>
          </Panel>
        ) : null}
      </div>
    </form>
  );
}

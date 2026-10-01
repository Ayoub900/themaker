"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteProduct, saveProduct, type ActionState } from "@/app/dashboard/actions";
import { ImageField } from "@/components/dashboard/image-field";
import { ConfirmButton } from "@/components/dashboard/confirm-button";
import { Field, FormMessage, Panel, dashButton, inputClass } from "@/components/dashboard/ui";
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
  stock: number | null;
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

/** Stock is optional: most pieces are made on demand, so it is off by default. */
function StockField({ initial, error }: { initial: number | null; error?: string }) {
  const [tracked, setTracked] = useState(initial !== null);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-start gap-3 text-[16px]">
        <input
          type="checkbox"
          name="trackStock"
          checked={tracked}
          onChange={(event) => setTracked(event.target.checked)}
          className="mt-1"
        />
        <span>
          Count how many I have ready
          <span className="block text-[14px] text-muted">
            Leave this off if you make each one only when it is ordered.
          </span>
        </span>
      </label>
      {tracked ? (
        <Field label="How many are ready" error={error}>
          <input
            type="number"
            name="stock"
            min={0}
            defaultValue={initial ?? 1}
            className={inputClass}
          />
        </Field>
      ) : null}
    </div>
  );
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : isNew ? "Save the new product" : "Save changes"}
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
        <Panel title="About this product">
          <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-2">
            <Field label="Name" error={error("name")} className="sm:col-span-2">
              <input name="name" defaultValue={product?.name} required className={inputClass} />
            </Field>

            <Field
              label="Web address (optional)"
              hint="Leave empty — it is created from the name for you."
              error={error("slug")}
            >
              <input name="slug" defaultValue={product?.slug} className={inputClass} />
            </Field>

            <Field label="Product code" hint="Your own short code, for example 01 / 24." error={error("reference")}>
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
              hint="One short sentence, shown under the name in lists."
              error={error("summary")}
              className="sm:col-span-2"
            >
              <input name="summary" defaultValue={product?.summary} required className={inputClass} />
            </Field>

            <Field
              label="Description"
              hint="Tell the story of the piece. Leave an empty line between paragraphs."
              error={error("description")}
              className="sm:col-span-2"
            >
              <textarea
                name="description"
                defaultValue={product?.description}
                required
                rows={10}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Photos">
          <ImageField
            images={product?.images ?? []}
            max={MAX_PRODUCT_IMAGES}
            altFallback={product?.name || "What this photograph shows"}
          />
        </Panel>

        <Panel title="Size and delivery">
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

            <Field label="Delivery time" error={error("leadTime")} className="sm:col-span-2">
              <input
                name="leadTime"
                defaultValue={product?.leadTime ?? "Ships in 5 working days"}
                className={inputClass}
              />
            </Field>

            <Field label="How to look after it" error={error("care")} className="sm:col-span-2">
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
          title="Extra details (optional)"
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
            <p className="text-[14px] text-muted">
              For example “Metal” and “Brass”. Empty lines are ignored. Up to twelve.
            </p>
          </div>
        </Panel>
      </div>

      {/* -------------------------------------------------------- side column */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <Panel title="Show it on the website?">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field label="Visibility">
              <select
                name="status"
                defaultValue={product?.status ?? "DRAFT"}
                className={inputClass}
              >
                <option value="DRAFT">Hidden — not on the website yet</option>
                <option value="PUBLISHED">Shown on the website</option>
                <option value="ARCHIVED">Put away — hidden, but kept</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 text-[16px]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="size-4 accent-[#C69B54]"
              />
              Show on the home page
            </label>

            <Field label="Position in the list" hint="1 is first, then 2, 3… Leave at 0 if unsure.">
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
                  See it on the website ↗
                </Link>
              ) : null}
            </div>

            {state.message ? <FormMessage ok={state.ok}>{state.message}</FormMessage> : null}
          </div>
        </Panel>

        <Panel title="Price">
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

            <StockField initial={product?.stock ?? null} error={error("stock")} />
          </div>
        </Panel>

        <Panel title="How it looks on Google (optional)">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <Field
              label="Title on Google"
              hint="Leave empty and the product name is used."
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
              label="Description on Google"
              hint="Leave empty and the short summary is used."
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
          <Panel title="Delete this product">
            <div className="flex flex-col gap-3 p-4 sm:p-6">
              <p className="text-[15px] leading-relaxed text-muted">
                This removes the product and its page from the website for good. Past orders keep their
                own copy, so your sales history is safe. If you only want to hide it, choose “Put away” above instead.
              </p>
              <ConfirmButton
                formAction={deleteProduct}
                formNoValidate
                confirm="Delete this product for good? It will disappear from the website. This cannot be undone."
                className={`${dashButton.danger} self-start`}
              >
                Delete this product
              </ConfirmButton>
            </div>
          </Panel>
        ) : null}
      </div>
    </form>
  );
}

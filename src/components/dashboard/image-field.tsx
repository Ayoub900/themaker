"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { dashButton } from "@/components/dashboard/ui";
import {
  IMAGE_ACCEPT,
  MAX_IMAGE_ALT,
  MAX_IMAGE_BYTES,
  formatBytes,
  imageUrl,
  type ImageRef,
} from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Photographs for a product or a post.
 *
 * A file goes up the moment it is chosen rather than when the form is saved:
 * a Server Action's body is capped at 1 MB, and an editor who mistypes a slug
 * should not have to choose their files again when the form comes back with
 * the error. What the form carries is a hidden id per photograph, paired with
 * the description beside it — `saveProduct` and `savePost` read the two lists
 * in step, so the order here is the order on the site.
 */

type Item = ImageRef & {
  /** Uploaded during this edit, so removing it can throw the file away. */
  fresh: boolean;
};

export function ImageField({
  images,
  max = 1,
  altFallback,
}: {
  images: ImageRef[];
  max?: number;
  /** Used as the description wherever the editor leaves one blank. */
  altFallback: string;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    images.slice(0, max).map((image) => ({ ...image, fresh: false })),
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const room = max - items.length;
  const multiple = max > 1;

  async function upload(files: File[]) {
    setError(null);

    const accepted = files.slice(0, room);
    if (accepted.length === 0) {
      if (files.length > 0) {
        setError(
          multiple
            ? `There is room for ${max} photographs in all.`
            : "There is room for one photograph.",
        );
      }
      return;
    }

    setUploading((count) => count + accepted.length);

    for (const file of accepted) {
      try {
        const body = new FormData();
        body.set("file", file);

        const response = await fetch("/api/dashboard/images", {
          method: "POST",
          body,
        });
        const payload = (await response.json().catch(() => null)) as
          | { id?: string; width?: number; height?: number; message?: string }
          | null;

        if (!response.ok || !payload?.id) {
          setError(payload?.message ?? "That photograph could not be uploaded.");
          continue;
        }

        const uploaded: Item = {
          id: payload.id,
          width: payload.width ?? 0,
          height: payload.height ?? 0,
          alt: "",
          fresh: true,
        };

        // Check the ceiling again rather than trusting `room`: several files
        // upload in turn, each against whatever the ones before it left.
        setItems((current) =>
          current.length >= max ? current : [...current, uploaded],
        );
      } catch {
        setError("The upload could not be sent. Check your connection and try again.");
      } finally {
        setUploading((count) => count - 1);
      }
    }
  }

  function remove(item: Item) {
    setItems((current) => current.filter((entry) => entry.id !== item.id));

    // A photograph that was already saved is left in place until the form is
    // saved, so removing one and changing your mind costs nothing.
    if (item.fresh) {
      void fetch(`/api/dashboard/images/${item.id}`, {
        method: "DELETE",
        keepalive: true,
      });
    }
  }

  function move(index: number, by: number) {
    setItems((current) => {
      const target = index + by;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function describe(id: string, alt: string) {
    setItems((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, alt } : entry)),
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={item.id} className="flex gap-4 border border-ink/10 p-3">
              <div className="relative size-20 shrink-0 overflow-hidden bg-parchment">
                <Image
                  src={imageUrl(item.id)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input type="hidden" name="imageId" value={item.id} />
                <input
                  name="imageAlt"
                  value={item.alt}
                  onChange={(event) => describe(item.id, event.target.value)}
                  maxLength={MAX_IMAGE_ALT}
                  placeholder={altFallback}
                  aria-label={`What photograph ${index + 1} shows`}
                  className="w-full border border-ink/20 bg-paper px-3 py-2 text-[16px] transition-colors focus:border-gold focus:outline-none sm:text-[13px]"
                />

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] text-faint">
                  <span className="lining-nums tabular-nums">
                    {item.width}×{item.height}
                    {multiple && index === 0 ? " · shown first" : ""}
                  </span>

                  <span className="flex items-center gap-3">
                    {multiple ? (
                      <>
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move photograph ${index + 1} earlier`}
                          className="text-[14px] leading-none transition-colors hover:text-gold disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={index === items.length - 1}
                          aria-label={`Move photograph ${index + 1} later`}
                          className="text-[14px] leading-none transition-colors hover:text-gold disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="uppercase tracking-[0.14em] transition-colors hover:text-gold"
                    >
                      Remove
                    </button>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {room > 0 ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void upload([...event.dataTransfer.files]);
          }}
          className={cn(
            "flex flex-col items-center gap-2.5 border border-dashed px-4 py-7 text-center transition-colors",
            dragging ? "border-gold bg-cream" : "border-ink/20",
          )}
        >
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading > 0}
            className={dashButton.outline}
          >
            {uploading > 0
              ? "Uploading…"
              : items.length > 0
                ? "Add another"
                : "Choose a photograph"}
          </button>

          <p className="text-[12px] leading-relaxed text-faint">
            or drop {multiple ? "files" : "a file"} here. JPEG, PNG, WebP or GIF, up
            to {formatBytes(MAX_IMAGE_BYTES)}
            {multiple ? ` · room for ${room} more` : ""}.
          </p>

          {/* Deliberately unnamed: the file itself must not travel with the
              form, whose body the framework caps at 1 MB. */}
          <input
            ref={fileInput}
            type="file"
            accept={IMAGE_ACCEPT}
            multiple={multiple}
            hidden
            onChange={(event) => {
              const chosen = [...(event.target.files ?? [])];
              // Cleared first, so choosing the same file twice fires again.
              event.target.value = "";
              void upload(chosen);
            }}
          />
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-[12px] text-gold">
          {error}
        </p>
      ) : null}

      <p className="text-[12px] leading-relaxed text-faint">
        {multiple
          ? "The first is used by listings and the top of the product page; the next two fill the detail frames."
          : "Shown at the head of the post and on every card that links to it."}{" "}
        Describe what each one shows — that description is read aloud to anyone who
        cannot see it, and stands in if the image fails to load.
      </p>
    </div>
  );
}

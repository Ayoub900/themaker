"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageSlot } from "@/components/ui";
import { imageUrl, type ImageRef } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Every photograph of a piece, not the first three.
 *
 * The frames sit in one horizontal track that snaps: a swipe on a phone, the
 * arrows or a thumbnail on a desktop. The track carries the position, and a
 * settled scroll always has the last word on which frame is showing, so a
 * gesture and a press cannot leave the counter and the photograph disagreeing.
 */
export function ProductGallery({
  images,
  label,
  name,
  ratio = "4 / 5",
}: {
  images: ImageRef[];
  /** The brief for the photography, shown while there is none. */
  label: string;
  name: string;
  ratio?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  /** Mirrors `index` so a second press lands before the first has rendered. */
  const indexRef = useRef(0);
  const count = images.length;

  const setFrame = useCallback((next: number) => {
    indexRef.current = next;
    setIndex(next);
  }, []);

  /** Read the frame in view back off the track after any scroll. */
  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    setFrame(Math.max(0, Math.min(count - 1, next)));
  }, [count, setFrame]);

  /**
   * Move the track. The index is set here rather than waiting for the scroll
   * to land, so the arrows and thumbnails answer the moment they are pressed;
   * the scroll handler then owns it again for swipes. Position is assigned
   * rather than animated in JS — `scroll-smooth` on the track does the easing,
   * and still lands where asked where that animation is unavailable.
   */
  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track) return;
      setFrame(target);
      track.scrollLeft = target * track.clientWidth;
    },
    [setFrame],
  );

  /** A resize changes what `scrollLeft` means; re-read rather than guess. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(syncIndex);
    observer.observe(track);
    return () => observer.disconnect();
  }, [syncIndex]);

  // Nothing shot yet: the frames that belong here, carrying their briefs.
  if (count === 0) {
    return (
      <div className="flex flex-col gap-5">
        <ImageSlot label={label} ratio={ratio} sizes="(min-width: 1024px) 45vw, 90vw" priority />
        <div className="grid grid-cols-2 gap-5">
          <ImageSlot label="[ detail — surface ]" ratio="1 / 1" />
          <ImageSlot label="[ detail — in use ]" ratio="1 / 1" />
        </div>
      </div>
    );
  }

  if (count === 1) {
    return (
      <ImageSlot
        label={label}
        image={images[0]}
        ratio={ratio}
        sizes="(min-width: 1024px) 45vw, 90vw"
        priority
      />
    );
  }

  const step = (delta: number) =>
    goTo(Math.max(0, Math.min(count - 1, indexRef.current + delta)));

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative">
        <div
          ref={trackRef}
          onScroll={syncIndex}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              step(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              step(-1);
            }
          }}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} — photographs`}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain motion-safe:scroll-smooth"
        >
          {images.map((image, position) => (
            <div
              key={image.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${position + 1} of ${count}`}
              className="relative w-full shrink-0 snap-center overflow-hidden bg-parchment"
              style={{ aspectRatio: ratio }}
            >
              <Image
                src={imageUrl(image.id)}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                priority={position === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <GalleryArrow
          direction="previous"
          onClick={() => step(-1)}
          disabled={index === 0}
        />
        <GalleryArrow
          direction="next"
          onClick={() => step(1)}
          disabled={index === count - 1}
        />

        <span
          aria-live="polite"
          className="absolute bottom-3.5 right-3.5 bg-paper/85 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted lining-nums tabular-nums"
        >
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 py-1">
        {images.map((image, position) => (
          <button
            key={image.id}
            type="button"
            onClick={() => goTo(position)}
            aria-label={`Show photograph ${position + 1} of ${count}`}
            aria-current={position === index}
            className={cn(
              "relative aspect-square w-[70px] shrink-0 overflow-hidden bg-parchment transition-opacity sm:w-[84px]",
              position === index
                ? "outline outline-1 outline-offset-2 outline-gold"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={imageUrl(image.id)}
              alt=""
              fill
              sizes="84px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const next = direction === "next";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={next ? "Next photograph" : "Previous photograph"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center bg-paper/85 text-lg leading-none text-ink transition-all duration-200 hover:bg-gold hover:text-paper disabled:pointer-events-none disabled:opacity-0 sm:flex",
        next ? "right-3.5" : "left-3.5",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {next ? "→" : "←"}
    </button>
  );
}

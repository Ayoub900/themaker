"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


import { useCart } from "@/components/shop/cart-provider";
import { brand, mainNav, site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  // The drawer is closed by the links themselves rather than by watching the
  // route, so there is no render-then-correct pass on every navigation.
  const close = () => setOpen(false);

  // Stop the page behind the drawer from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-[12px] focus:uppercase focus:tracking-[0.18em] focus:text-paper"
      >
        Skip to content
      </a>

      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-6 py-5 md:px-10 lg:px-16">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex shrink-0 items-center gap-3 md:gap-4"
        >
          <Image
            src={brand.logo.mark}
            alt=""
            width={124}
            height={112}
            priority
            sizes="(min-width: 768px) 62px, 52px"
            className="h-11 w-auto md:h-[3.25rem]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.45rem] leading-none text-ink md:text-[1.7rem]">
              {site.name}
            </span>
            <span className="mt-1.5 text-[9px] uppercase tracking-[0.28em] text-faint md:text-[10px]">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-[11px] uppercase tracking-[0.2em] transition-colors",
                isActive(item.href) ? "text-ink" : "text-muted hover:text-gold",
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/cart"
            className="bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold"
          >
            Cart ({ready ? count : 0})
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink md:hidden"
        >
          <span className="flex flex-col gap-[5px]" aria-hidden="true">
            <span
              className={cn(
                "block h-px w-6 bg-ink transition-transform",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span className={cn("block h-px w-6 bg-ink transition-opacity", open && "opacity-0")} />
            <span
              className={cn(
                "block h-px w-6 bg-ink transition-transform",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-ink/10 bg-paper px-6 pb-8 pt-4 md:hidden"
        >
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-ink/8">
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-4 font-serif text-2xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/cart"
            onClick={close}
            className="mt-6 flex items-center justify-center bg-ink px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-paper"
          >
            Cart ({ready ? count : 0})
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

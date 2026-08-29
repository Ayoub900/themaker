import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { brand, dashboard, site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Workshop sign in",
  description: "Sign in to the workshop dashboard.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-parchment px-6 py-16">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-4"
          aria-label={`${site.name} — home`}
        >
          <Image
            src={brand.logo.mark}
            alt=""
            width={140}
            height={126}
            priority
            sizes="70px"
            className="h-14 w-auto"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.7rem] leading-none text-ink">{site.name}</span>
            <span className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-faint">
              {site.tagline}
            </span>
          </span>
        </Link>

        <div className="bg-paper p-8 shadow-[0_20px_60px_rgba(20,17,14,0.08)] md:p-10">
          <h1 className="font-serif text-[2rem] leading-tight">Workshop</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Catalogue, journal, orders and the inbox. Sessions last{" "}
            {dashboard.sessionMaxAge / 3600} hours.
          </p>

          <div className="mt-8">
            <Suspense
              fallback={<div className="h-72 animate-pulse bg-parchment" aria-hidden="true" />}
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="mt-8 text-center text-[12px] text-faint">
          <Link href="/" className="border-b border-gold pb-0.5 hover:text-gold">
            Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "@/app/login/actions";

const fieldClass =
  "w-full border border-ink/20 bg-paper px-4 py-3.5 text-[16px] sm:text-[15px] transition-colors focus:border-gold focus:outline-none";
const labelClass = "text-[11px] uppercase tracking-[0.18em] text-muted";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-ink px-7 py-4 text-[12px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-gold disabled:opacity-50"
    >
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className="border-l-2 border-gold bg-parchment px-4 py-3 text-[14px] text-ink-soft">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

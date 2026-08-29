"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { changePassword, type ActionState } from "@/app/dashboard/actions";
import { Field, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Changing…" : "Change password"}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(changePassword, {});
  const error = (field: string) => state.errors?.[field];

  return (
    <Panel title="Password">
      <form action={formAction} className="flex max-w-md flex-col gap-5 p-4 sm:p-6">
        <Field label="Current password" error={error("currentPassword")}>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </Field>

        <Field
          label="New password"
          hint="At least 12 characters, with an uppercase letter, a lowercase letter and a digit."
          error={error("newPassword")}
        >
          <input
            type="password"
            name="newPassword"
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>

        <Field label="Repeat the new password" error={error("confirmPassword")}>
          <input
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-5">
          <SaveButton />
          {state.message ? (
            <p role="status" className={`text-[13px] ${state.ok ? "text-muted" : "text-gold"}`}>
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </Panel>
  );
}

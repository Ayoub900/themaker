"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { changePassword, type ActionState } from "@/app/dashboard/actions";
import { Field, FormMessage, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Changing…" : "Change my password"}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(changePassword, {});
  const error = (field: string) => state.errors?.[field];

  return (
    <Panel title="Change my password">
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
          hint="At least 12 characters, with a capital letter, a small letter and a number."
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

        <Field label="New password again" error={error("confirmPassword")}>
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
          {state.message ? <FormMessage ok={state.ok}>{state.message}</FormMessage> : null}
        </div>
      </form>
    </Panel>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateOrder, type ActionState } from "@/app/dashboard/actions";
import { Field, FormMessage, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

const STATUSES = [
  { value: "PENDING", label: "1. Waiting for you — not confirmed yet" },
  { value: "CONFIRMED", label: "2. Confirmed — payment received" },
  { value: "IN_PRODUCTION", label: "3. Being made" },
  { value: "SHIPPED", label: "4. Sent to the customer" },
  { value: "COMPLETED", label: "5. Done — the customer has it" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function OrderEditor({
  id,
  status,
  internalNote,
}: {
  id: string;
  status: string;
  internalNote: string | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateOrder, {});

  return (
    <Panel title="Where is this order?">
      <form action={formAction} className="flex flex-col gap-5 p-4 sm:p-6">
        <input type="hidden" name="id" value={id} />

        <Field
          label="Progress"
          hint="Change this as the order moves along. Once you move it past “Waiting for you”, the stock count of ready pieces goes down by itself."
        >
          {/* Keyed on the server value: an uncontrolled select ignores a
              changed defaultValue, so without this it would keep showing the
              old status after a save. The key remounts it instead. */}
          <select
            key={status}
            name="status"
            defaultValue={status}
            className={inputClass}
          >
            {STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Your private notes" hint="Only you can see this. The customer never does.">
          <textarea
            name="internalNote"
            defaultValue={internalNote ?? ""}
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="For example: customer wants it before the 15th. Brass arrives Thursday."
          />
        </Field>

        <div className="flex flex-col gap-4 border-t border-ink/10 pt-5">
          <div>
            <SaveButton />
          </div>
          {state.message ? <FormMessage ok={state.ok}>{state.message}</FormMessage> : null}
        </div>
      </form>
    </Panel>
  );
}

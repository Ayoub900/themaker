"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateOrder, type ActionState } from "@/app/dashboard/actions";
import { Field, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

const STATUSES = [
  { value: "PENDING", label: "Pending — needs confirming" },
  { value: "CONFIRMED", label: "Confirmed — stock committed" },
  { value: "IN_PRODUCTION", label: "In production" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled — stock returned" },
] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : "Update order"}
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
    <Panel title="Workshop">
      <form action={formAction} className="flex flex-col gap-5 p-4 sm:p-6">
        <input type="hidden" name="id" value={id} />

        <Field
          label="Status"
          hint="Moving off Pending commits the stock. Cancelling a committed order returns it."
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

        <Field label="Internal note" hint="Only ever seen here.">
          <textarea
            name="internalNote"
            defaultValue={internalNote ?? ""}
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="Quoted the drop at 1.4 m. Bronze arriving Thursday."
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

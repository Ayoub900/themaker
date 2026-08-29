"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deleteMessage, updateMessage, type ActionState } from "@/app/dashboard/actions";
import { Field, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={dashButton.solid}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function MessageEditor({
  id,
  status,
  reply,
}: {
  id: string;
  status: string;
  reply: string | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateMessage, {});

  return (
    <Panel title="Handling">
      <form action={formAction} className="flex flex-col gap-5 p-4 sm:p-6">
        <input type="hidden" name="id" value={id} />

        <Field label="Status">
          {/* Keyed so a save that changes the status remounts the select
              rather than leaving the previous value on screen. */}
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

        <Field
          label="What we said"
          hint="A record of the reply, kept so the next person to touch this knows what was promised. It is not emailed from here."
        >
          <textarea
            name="reply"
            defaultValue={reply ?? ""}
            rows={7}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-5">
          <SaveButton />
          <button
            type="submit"
            formAction={deleteMessage}
            formNoValidate
            className={dashButton.danger}
          >
            Delete
          </button>
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

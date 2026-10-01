"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deleteMessage, updateMessage, type ActionState } from "@/app/dashboard/actions";
import { ConfirmButton } from "@/components/dashboard/confirm-button";
import { Field, FormMessage, Panel, dashButton, inputClass } from "@/components/dashboard/ui";

const STATUSES = [
  { value: "NEW", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Answered" },
  { value: "ARCHIVED", label: "Put away (hide from the main list)" },
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
    <Panel title="What to do with this message">
      <form action={formAction} className="flex flex-col gap-5 p-4 sm:p-6">
        <input type="hidden" name="id" value={id} />

        <Field label="Has it been dealt with?">
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
          label="Copy of your answer"
          hint="Optional. Paste what you wrote back, so you remember what you promised. This does not send anything — use “Reply by email” above for that."
        >
          <textarea
            name="reply"
            defaultValue={reply ?? ""}
            rows={7}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <div className="flex flex-col gap-4 border-t border-ink/10 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <SaveButton />
            <ConfirmButton
              formAction={deleteMessage}
              formNoValidate
              confirm="Delete this message for good? This cannot be undone."
              className={dashButton.danger}
            >
              Delete message
            </ConfirmButton>
          </div>
          {state.message ? <FormMessage ok={state.ok}>{state.message}</FormMessage> : null}
        </div>
      </form>
    </Panel>
  );
}

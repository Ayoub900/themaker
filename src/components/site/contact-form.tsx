"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";

const TOPICS = [
  { value: "COMMISSION", label: "A commission" },
  { value: "GENERAL", label: "General question" },
  { value: "ORDER", label: "An existing order" },
  { value: "REPAIR", label: "A repair" },
  { value: "VISIT", label: "Visiting the workshop" },
  { value: "PRESS", label: "Press" },
] as const;

const fieldClass =
  "w-full border border-ink/20 bg-transparent px-4 py-3.5 text-[16px] sm:text-[15px] transition-colors placeholder:text-faint/70 focus:border-gold focus:outline-none";

const labelClass = "text-[11px] uppercase tracking-[0.18em] text-muted";

export function ContactForm() {
  const params = useSearchParams();
  const requested = params.get("topic")?.toUpperCase();
  const initialTopic =
    TOPICS.find((topic) => topic.value === requested)?.value ?? "COMMISSION";

  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload: { message?: string; errors?: Record<string, string> } =
        await response.json();

      if (!response.ok) {
        setState("error");
        setErrors(payload.errors ?? {});
        setMessage(payload.message ?? "That did not send. Try again in a moment.");
        return;
      }

      setState("sent");
      setMessage(payload.message ?? "Message received.");
      form.reset();
    } catch {
      setState("error");
      setMessage("No connection. Try again in a moment.");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="border border-gold/40 bg-parchment px-8 py-12">
        <h2 className="font-serif text-[2rem] leading-tight">Thank you — it arrived.</h2>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft">
          {message} One of us reads everything, usually the same day, and you will have a
          proper answer within two working days.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setMessage("");
          }}
          className="mt-6 border-b border-gold pb-1 text-[11px] uppercase tracking-[0.18em] hover:text-gold"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="text-[13px] text-gold">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="text-[13px] text-gold">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className={labelClass}>
          What about
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={initialTopic}
          className={fieldClass}
        >
          {TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          required
          className={fieldClass}
          placeholder="Door pulls for a stair hall"
          aria-invalid={Boolean(errors.subject)}
        />
        {errors.subject ? (
          <p className="text-[13px] text-gold">{errors.subject}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className={labelClass}>
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={7}
          className={`${fieldClass} resize-y`}
          placeholder="Dimensions, the metal you have in mind, and your deadline."
          aria-invalid={Boolean(errors.body)}
        />
        {errors.body ? <p className="text-[13px] text-gold">{errors.body}</p> : null}
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send it"}
        </Button>
        <p role="status" aria-live="polite" className="text-[13px] text-gold">
          {state === "error" ? message : ""}
        </p>
      </div>
    </form>
  );
}

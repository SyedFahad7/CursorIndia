"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";

export function ContactForm() {
  const dict = useDict();
  const t = dict.pages.submit.form;

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-text)]">
            {t.nameLabel}
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder={t.namePlaceholder}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-text)]">
            {t.emailLabel}
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-text)]">
          {t.cityLabel}
        </span>
        <input
          type="text"
          name="city"
          autoComplete="address-level2"
          placeholder={t.cityPlaceholder}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-text)]">
          {t.messageLabel}
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className={cn(inputClass, "resize-y min-h-[120px]")}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="md" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </Button>
        {status === "success" ? (
          <p className="text-sm text-[var(--color-success)]" role="status">
            {t.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-[var(--color-danger)]" role="alert">
            {t.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

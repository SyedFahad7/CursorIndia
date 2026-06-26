"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ArrowUpRight, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatIST } from "@/lib/utils";
import type { CursorIndiaEvent, EventPhoto } from "@/lib/types";
import type { EventRecap } from "@/lib/types";

interface RecapEditorProps {
  city: string;
  event: CursorIndiaEvent;
  existing?: EventRecap | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function RecapEditor({ city, event, existing, onSaved, onCancel }: RecapEditorProps) {
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [photoCredit, setPhotoCredit] = useState(existing?.photoCredit ?? "");
  const [photos, setPhotos] = useState<EventPhoto[]>(existing?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);
      setError("");
      try {
        const next = [...photos];
        for (const file of Array.from(files)) {
          const form = new FormData();
          form.set("city", city);
          form.set("eventSlug", event.slug);
          form.set("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: form });
          const data = (await res.json()) as { src?: string; error?: string };
          if (!res.ok || !data.src) {
            throw new Error(data.error ?? "Upload failed");
          }
          next.push({ src: data.src, alt: `${event.title} — photo` });
        }
        setPhotos(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [city, event.slug, event.title, photos],
  );

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/recaps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          eventSlug: event.slug,
          summary,
          photoCredit: photoCredit || undefined,
          photos,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      onSaved();
    } catch {
      setError("Network error — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-5 md:p-6">
      <div>
        <Heading level={3} size="sm">
          {existing ? "Edit recap" : "Add recap"} — {event.title}
        </Heading>
        <Text variant="muted" className="mt-1 text-sm">
          {formatIST(event.date)}
        </Text>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Summary</span>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="What happened at the event? Demos, people, vibe…"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Photo credit (optional)</span>
        <input
          type="text"
          value={photoCredit}
          onChange={(e) => setPhotoCredit(e.target.value)}
          placeholder="e.g. Arundhati Shenoy"
          className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Photos ({photos.length})</span>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[var(--color-coral)] hover:underline">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            Upload
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                void uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-elevated)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Text variant="muted" className="text-sm">
            Drop event photos here — they appear on the city page and recap page.
          </Text>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void onSave()} disabled={saving || uploading}>
          {saving ? "Publishing…" : "Publish recap"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {existing ? (
          <a
            href={`/recaps/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:underline"
          >
            Preview recap
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

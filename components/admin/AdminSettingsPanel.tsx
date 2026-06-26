"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export interface AdminSettingsState {
  city: {
    slug: string;
    name: string;
    lumaCalendarId: string;
    lumaPublicUrl: string;
    defaultLumaCalendarId: string;
    defaultLumaPublicUrl: string;
    effectiveLumaCalendarId: string;
    hasDbOverride: boolean;
  };
  ambassador: {
    handle: string;
    name: string;
    photoUrl: string;
    xUrl: string;
    linkedinUrl: string;
    email: string;
    defaults: {
      name: string;
      photoUrl: string;
      xUrl: string;
      linkedinUrl: string;
      email: string;
    };
    hasDbOverride: boolean;
  } | null;
}

interface AdminSettingsPanelProps {
  city: string;
  initial: AdminSettingsState;
  onSaved: (next: AdminSettingsState) => void;
}

const inputClass =
  "h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

export function AdminSettingsPanel({ city, initial, onSaved }: AdminSettingsPanelProps) {
  const [data, setData] = useState(initial);
  const [lumaCalId, setLumaCalId] = useState(initial.city.lumaCalendarId);
  const [lumaUrl, setLumaUrl] = useState(initial.city.lumaPublicUrl);
  const [name, setName] = useState(initial.ambassador?.name ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial.ambassador?.photoUrl ?? "");
  const [xUrl, setXUrl] = useState(initial.ambassador?.xUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initial.ambassador?.linkedinUrl ?? "");
  const [email, setEmail] = useState(initial.ambassador?.email ?? "");
  const [savingCity, setSavingCity] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function saveCitySettings() {
    setSavingCity(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          citySettings: { lumaCalendarId: lumaCalId, lumaPublicUrl: lumaUrl },
        }),
      });
      const json = (await res.json()) as AdminSettingsState & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setData(json);
      setLumaCalId(json.city.lumaCalendarId);
      setLumaUrl(json.city.lumaPublicUrl);
      setSuccess("City & Luma settings saved. Events sync within ~1 minute.");
      onSaved(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingCity(false);
    }
  }

  async function saveProfile() {
    setSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          ambassadorSettings: {
            name,
            photoUrl,
            xUrl,
            linkedinUrl,
            email,
          },
        }),
      });
      const json = (await res.json()) as AdminSettingsState & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setData(json);
      if (json.ambassador) {
        setName(json.ambassador.name);
        setPhotoUrl(json.ambassador.photoUrl);
      }
      setSuccess("Profile saved — visible on the site immediately.");
      onSaved(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function resetCitySettings() {
    if (!confirm("Reset Luma settings to site defaults?")) return;
    setSavingCity(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, citySettings: { reset: true } }),
      });
      const json = (await res.json()) as AdminSettingsState & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Reset failed");
      setData(json);
      setLumaCalId("");
      setLumaUrl("");
      setSuccess("Luma settings reset.");
      onSaved(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSavingCity(false);
    }
  }

  async function resetProfile() {
    if (!confirm("Reset your profile to site defaults?")) return;
    setSavingProfile(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, ambassadorSettings: { reset: true } }),
      });
      const json = (await res.json()) as AdminSettingsState & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Reset failed");
      setData(json);
      if (json.ambassador) {
        setName(json.ambassador.defaults.name);
        setPhotoUrl(json.ambassador.defaults.photoUrl);
        setXUrl(json.ambassador.defaults.xUrl);
        setLinkedinUrl(json.ambassador.defaults.linkedinUrl);
        setEmail(json.ambassador.defaults.email);
      }
      setSuccess("Profile reset to defaults.");
      onSaved(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function uploadPhoto(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("city", city);
      form.set("file", files[0]);
      const res = await fetch("/api/admin/upload-avatar", { method: "POST", body: form });
      const json = (await res.json()) as { src?: string; error?: string };
      if (!res.ok || !json.src) throw new Error(json.error ?? "Upload failed");
      setPhotoUrl(json.src);
      // Auto-save profile with new photo
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          ambassadorSettings: {
            name,
            photoUrl: json.src,
            xUrl,
            linkedinUrl,
            email,
          },
        }),
      });
      const saved = (await saveRes.json()) as AdminSettingsState & { error?: string };
      if (saveRes.ok) {
        setData(saved);
        onSaved(saved);
        setSuccess("Headshot uploaded and saved.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-[var(--color-coral)]" role="status">
          {success}
        </p>
      ) : null}

      <Card className="flex flex-col gap-5 p-5 md:p-6">
        <div>
          <Heading level={2} size="md">
            City & Luma calendar
          </Heading>
          <Text variant="muted" className="mt-1 text-sm">
            Once saved, your events (upcoming + past) sync automatically — about 1 minute after
            you publish on Luma. No redeploy needed.
          </Text>
        </div>

        {data.city.effectiveLumaCalendarId ? (
          <Text variant="muted" className="text-xs">
            Live calendar ID:{" "}
            <code className="text-[var(--color-text)]">{data.city.effectiveLumaCalendarId}</code>
          </Text>
        ) : (
          <Text variant="muted" className="text-xs">
            No calendar connected yet — add your Calendar ID below.
          </Text>
        )}

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Luma calendar page URL</span>
          <input
            className={inputClass}
            value={lumaUrl}
            onChange={(e) => setLumaUrl(e.target.value)}
            placeholder="https://luma.com/cursor-hyderabad-india"
          />
          <span className="text-xs text-[var(--color-muted)]">
            Public RSVP page — shown as “Subscribe for Updates” on your city page.
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Luma Calendar ID</span>
          <input
            className={inputClass}
            value={lumaCalId}
            onChange={(e) => setLumaCalId(e.target.value)}
            placeholder="cal-Ap2jcMAsVNDdimN"
          />
          <span className="text-xs text-[var(--color-muted)] leading-relaxed">
            Luma → your calendar → <strong>Settings</strong> → <strong>Calendar API</strong> → copy
            the <code className="text-[11px]">cal-…</code> from the iCal link. Example:{" "}
            <code className="text-[11px]">cal-Ap2jcMAsVNDdimN</code>
          </span>
        </label>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void saveCitySettings()} disabled={savingCity}>
            {savingCity ? "Saving…" : "Save Luma settings"}
          </Button>
          {data.city.hasDbOverride ? (
            <Button variant="secondary" onClick={() => void resetCitySettings()} disabled={savingCity}>
              Reset to defaults
            </Button>
          ) : null}
        </div>
      </Card>

      {data.ambassador ? (
        <Card className="flex flex-col gap-5 p-5 md:p-6">
          <div>
            <Heading level={2} size="md">
              Your profile
            </Heading>
            <Text variant="muted" className="mt-1 text-sm">
              Shown on /ambassadors and your city page. Updates go live immediately.
            </Text>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-elevated)]">
              {photoUrl ? (
                <Image src={photoUrl} alt={name} fill sizes="80px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-[var(--color-muted)]">
                  No photo
                </span>
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[var(--color-coral)] hover:underline">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-4 w-4" aria-hidden />
              )}
              Upload headshot
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  void uploadPhoto(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Display name</span>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">X (Twitter) URL</span>
            <input
              className={inputClass}
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              placeholder="https://x.com/yourhandle"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">LinkedIn URL</span>
            <input
              className={inputClass}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Email</span>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void saveProfile()} disabled={savingProfile || uploading}>
              {savingProfile ? "Saving…" : "Save profile"}
            </Button>
            {data.ambassador.hasDbOverride ? (
              <Button
                variant="secondary"
                onClick={() => void resetProfile()}
                disabled={savingProfile}
              >
                Reset to defaults
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

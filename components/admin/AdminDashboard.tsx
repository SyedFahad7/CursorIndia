"use client";

import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RecapEditor } from "@/components/admin/RecapEditor";
import {
  AdminSettingsPanel,
  type AdminSettingsState,
} from "@/components/admin/AdminSettingsPanel";
import { formatIST } from "@/lib/utils";
import type { CursorIndiaEvent, EventRecap } from "@/lib/types";

interface AdminDashboardProps {
  city: string;
  cityName: string;
  settings: AdminSettingsState;
  events: CursorIndiaEvent[];
  recaps: EventRecap[];
}

export function AdminDashboard({
  city,
  cityName,
  settings: initialSettings,
  events,
  recaps,
}: AdminDashboardProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [recapList, setRecapList] = useState(recaps);

  const recapBySlug = useMemo(
    () => new Map(recapList.map((r) => [r.eventSlug, r])),
    [recapList],
  );

  const past = events.filter((e) => e.status === "past").sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));

  async function refreshRecaps() {
    const res = await fetch(`/api/admin/recaps?city=${encodeURIComponent(city)}`);
    if (res.ok) {
      const data = (await res.json()) as { recaps: EventRecap[] };
      setRecapList(data.recaps);
    }
    setEditingSlug(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const editingEvent = editingSlug ? past.find((e) => e.slug === editingSlug) : null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Heading level={1} size="lg">
            {cityName} admin
          </Heading>
          <Text variant="muted" className="mt-1 text-sm max-w-2xl">
            Update your profile, connect Luma, and publish event recaps — all from here. Changes
            go live without redeploying the site.
          </Text>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void logout()}>
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </div>

      <AdminSettingsPanel
        city={city}
        initial={settings}
        onSaved={(next) => setSettings(next)}
      />

      {editingEvent ? (
        <RecapEditor
          city={city}
          event={editingEvent}
          existing={recapBySlug.get(editingEvent.slug)}
          onSaved={() => void refreshRecaps()}
          onCancel={() => setEditingSlug(null)}
        />
      ) : null}

      <section className="flex flex-col gap-4">
        <Heading level={2} size="md">
          Past events — add recaps
        </Heading>
        {past.length === 0 ? (
          <Card className="p-6 text-center">
            <Text variant="muted">
              No past events yet. Connect your Luma Calendar ID above — past events import
              automatically.
            </Text>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {past.map((event) => {
              const recap = recapBySlug.get(event.slug);
              return (
                <Card
                  key={event.slug}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{event.title}</p>
                    <Text variant="muted" className="text-sm">
                      {formatIST(event.date)}
                      {recap ? ` · ${recap.photos.length} photos · recap live` : " · no recap yet"}
                    </Text>
                  </div>
                  <Button
                    variant={recap ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => setEditingSlug(event.slug)}
                    className="shrink-0"
                  >
                    {recap ? "Edit recap" : "Add recap"}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2} size="md">
          Upcoming (from Luma)
        </Heading>
        {upcoming.length === 0 ? (
          <Text variant="muted" className="text-sm">
            Nothing upcoming — publish on Luma or connect your Calendar ID above.
          </Text>
        ) : (
          <ul className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
            {upcoming.map((e) => (
              <li key={e.slug}>
                {e.title} — {formatIST(e.date)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

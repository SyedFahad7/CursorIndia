"use client";

import { Command } from "cmdk";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Compass,
  CornerDownLeft,
  FileText,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import type { SearchItem, SearchKind } from "@/lib/search";

interface CmdKDialogProps {
  index: SearchItem[];
}

const kindIcon: Record<SearchKind, React.ComponentType<{ className?: string }>> = {
  event: Calendar,
  city: MapPin,
  ambassador: Users,
  page: FileText,
};

const kindLabel: Record<SearchKind, string> = {
  event: "Events",
  city: "Cities",
  ambassador: "Ambassadors",
  page: "Pages",
};

export function CmdKDialog({ index }: CmdKDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const grouped = useMemo(() => {
    const byKind = new Map<SearchKind, SearchItem[]>();
    for (const item of index) {
      const arr = byKind.get(item.kind) ?? [];
      arr.push(item);
      byKind.set(item.kind, arr);
    }
    const order: SearchKind[] = ["event", "city", "ambassador", "page"];
    return order
      .map((k) => ({ kind: k, items: byKind.get(k) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [index]);

  return (
    <>
      <FloatingTrigger onOpen={() => setOpen(true)} />

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[10vh] md:pt-[15vh]"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl overflow-hidden"
          >
            <Command
              label="Search Cursor India"
              filter={(value, search) => {
                const v = value.toLowerCase();
                const s = search.toLowerCase();
                if (!s) return 1;
                if (v.includes(s)) return 1;
                const parts = s.split(/\s+/).filter(Boolean);
                if (parts.every((p) => v.includes(p))) return 0.75;
                return 0;
              }}
            >
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/50 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <Search
                    className="h-4 w-4 text-[var(--color-muted)]"
                    aria-hidden
                  />
                </span>
                <Command.Input
                  autoFocus
                  placeholder="Search events, cities, ambassadors…"
                  className="h-9 flex-1 bg-transparent text-[15px] leading-none text-[var(--color-text)] placeholder:text-[var(--color-subtle)] focus:outline-none"
                />
                <kbd className="hidden h-6 shrink-0 items-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 font-mono text-[10px] leading-none text-[var(--color-muted)] sm:inline-flex">
                  esc
                </kbd>
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto px-3 py-3">
                <Command.Empty className="px-2 py-8 text-center text-sm text-[var(--color-muted)]">
                  Nothing matches. Try a city or event name.
                </Command.Empty>

                {grouped.map((g, groupIndex) => {
                  const Icon = kindIcon[g.kind];
                  return (
                    <Command.Group
                      key={g.kind}
                      heading={kindLabel[g.kind]}
                      className={
                        groupIndex > 0
                          ? "mt-4 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-[var(--color-subtle)]"
                          : "[&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-[var(--color-subtle)]"
                      }
                    >
                      {g.items.map((it) => (
                        <Command.Item
                          key={it.id}
                          value={`${it.title} ${it.subtitle ?? ""} ${it.keywords}`}
                          onSelect={() => {
                            setOpen(false);
                            if (/^https?:\/\//.test(it.href)) {
                              window.open(it.href, "_blank", "noopener,noreferrer");
                            } else {
                              router.push(it.href);
                            }
                          }}
                          className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text)] aria-selected:bg-[var(--color-elevated)] aria-selected:text-[var(--color-text)]"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-elevated)]">
                            <Icon
                              className="h-4 w-4 text-[var(--color-muted)]"
                              aria-hidden
                            />
                          </span>
                          <div className="flex min-w-0 flex-col gap-0.5 leading-snug">
                            <span className="font-medium">{it.title}</span>
                            {it.subtitle ? (
                              <span className="text-xs leading-relaxed text-[var(--color-muted)]">
                                {it.subtitle}
                              </span>
                            ) : null}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>

              <div className="flex h-11 items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-elevated)]/30 px-4 text-[11px] leading-none text-[var(--color-subtle)]">
                <span className="inline-flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>Cursor India</span>
                </span>
                <span className="hidden items-center gap-4 sm:inline-flex">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-[10px] leading-none">
                        <ArrowUp className="h-3 w-3" aria-hidden strokeWidth={1.75} />
                      </kbd>
                      <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-[10px] leading-none">
                        <ArrowDown className="h-3 w-3" aria-hidden strokeWidth={1.75} />
                      </kbd>
                    </span>
                    <span>navigate</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-[10px] leading-none">
                      <CornerDownLeft className="h-3 w-3" aria-hidden strokeWidth={1.75} />
                    </kbd>
                    <span>open</span>
                  </span>
                </span>
              </div>
            </Command>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Subtle floating "press ⌘K" affordance, bottom-right on desktop. */
function FloatingTrigger({ onOpen }: { onOpen: () => void }) {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac/i.test(navigator.platform));
    }
  }, []);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open search"
      className="fixed bottom-4 right-4 z-30 hidden md:inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)]/90 px-3 py-2 text-xs font-medium text-[var(--color-muted)] shadow-lg backdrop-blur hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
    >
      <Search className="h-3.5 w-3.5" aria-hidden />
      Search
      <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-subtle)]">
        {isMac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemedLogo } from "@/components/ui/ThemedLogo";
import { useDict } from "@/lib/i18n/LocaleProvider";
import type { Dict } from "@/lib/i18n/dictionaries";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { cn } from "@/lib/utils";

type NavKey = keyof Dict["nav"];

const nav: { key: NavKey; href: string }[] = [
  { key: "events", href: "/events" },
  { key: "cities", href: "/cities" },
  { key: "ambassadors", href: "/ambassadors" },
  { key: "gallery", href: "/gallery" },
  { key: "about", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const dict = useDict();
  const t = dict.nav;

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] border-b border-[var(--color-border)]">
      <Container width="wide">
        <div className="flex h-14 items-center justify-between gap-4 md:h-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded"
            aria-label={t.homeAria}
          >
            <ThemedLogo
              dark="/images/logos/LOCKUP_HORIZONTAL_2D_DARK.png"
              light="/images/logos/LOCKUP_HORIZONTAL_2D_LIGHT.png"
              alt="Cursor"
              width={6717}
              height={1597}
              priority
              className="h-5 w-auto md:h-6"
              sizes="(min-width: 768px) 100px, 84px"
            />
            <span className="mt-px text-base font-semibold tracking-tight text-[var(--color-text)] md:text-[18px]">
              India
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label={t.primaryAria}>
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors",
                    active
                      ? "text-[var(--color-text)] bg-[var(--color-elevated)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]",
                  )}
                >
                  {t[item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button href="/join" size="sm">
                {t.join}
              </Button>
            </div>
            <div className="hidden md:block">
              <LocaleToggle />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? t.closeMenu : t.openMenu}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-0 top-14 z-30 bg-[var(--color-bg)]"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          <Container>
            <nav className="flex flex-col gap-1 pt-6" aria-label={t.mobileAria}>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-3 text-base font-medium rounded-[var(--radius-md)] text-[var(--color-text)] hover:bg-[var(--color-elevated)]"
                >
                  {t[item.key]}
                </Link>
              ))}
              <Link
                href="/join"
                className="mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)]"
              >
                {t.joinFull}
              </Link>
              <div className="mt-4 px-3">
                <LocaleToggle />
              </div>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}


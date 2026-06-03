"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  dictionaries,
  isLocale,
  type Dict,
  type Locale,
} from "./dictionaries";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: Dict;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  dict: dictionaries[DEFAULT_LOCALE],
});

function readDocumentLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const attr = document.documentElement.getAttribute("data-locale");
  return isLocale(attr) ? attr : DEFAULT_LOCALE;
}

function writeCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  // Set a long-lived (1 year) cookie. Path "/" so it applies to all routes.
  // SameSite=Lax is the safe default for navigation-driven cookies.
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie =
    `${COOKIE_NAME}=${locale}; path=/; max-age=${oneYear}; samesite=lax`;
}

function applyToDocument(l: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l;
  document.documentElement.setAttribute("data-locale", l);
}

interface ProviderProps {
  children: React.ReactNode;
  /** Initial locale resolved on the server from the request cookie. Drives
   *  the very first client render so we never hydrate with the wrong dict. */
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: ProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  // The server set <html lang> / data-locale correctly already; in case
  // something else (extension, older boot script) mutated it, sync once.
  useEffect(() => {
    const fromDoc = readDocumentLocale();
    if (fromDoc !== locale) setLocaleState(fromDoc);
    // Intentionally run only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      setLocaleState(l);
      writeCookie(l);
      applyToDocument(l);
      // Re-run server components with the new cookie so SSR-rendered text
      // (page titles, async data, server-only translations) updates too.
      router.refresh();
    },
    [locale, router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, dict: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

/** Convenience hook returning just the active dictionary. */
export function useDict(): Dict {
  return useContext(LocaleContext).dict;
}

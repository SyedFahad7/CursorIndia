"use client";

// import { useRouter } from "next/navigation";
import {
  createContext,
  // useCallback,
  useContext,
  // useEffect,
  useMemo,
  // useState,
} from "react";

import {
  // COOKIE_NAME,
  DEFAULT_LOCALE,
  dictionaries,
  // isLocale,
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

/*
function readDocumentLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const attr = document.documentElement.getAttribute("data-locale");
  return isLocale(attr) ? attr : DEFAULT_LOCALE;
}

function writeCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie =
    `${COOKIE_NAME}=${locale}; path=/; max-age=${oneYear}; samesite=lax`;
}

function applyToDocument(l: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l;
  document.documentElement.setAttribute("data-locale", l);
}
*/

interface ProviderProps {
  children: React.ReactNode;
  /** Initial locale from the server. English-only while multi-locale is paused. */
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale: _initialLocale }: ProviderProps) {
  // Multi-locale switching paused — English only until we support several languages.
  // const [locale, setLocaleState] = useState<Locale>(initialLocale);
  // const router = useRouter();

  // useEffect(() => {
  //   const fromDoc = readDocumentLocale();
  //   if (fromDoc !== locale) setLocaleState(fromDoc);
  // }, []);

  // const setLocale = useCallback(
  //   (l: Locale) => {
  //     if (l === locale) return;
  //     setLocaleState(l);
  //     writeCookie(l);
  //     applyToDocument(l);
  //     router.refresh();
  //   },
  //   [locale, router],
  // );

  const setLocale = (_l: Locale) => {};

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: DEFAULT_LOCALE,
      setLocale,
      dict: dictionaries[DEFAULT_LOCALE],
    }),
    [],
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

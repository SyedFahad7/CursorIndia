import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/lib/theme";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CmdK } from "@/components/search/CmdK";
import { siteConfig } from "@/content/site.config";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${dict.meta.titleSuffix}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: dict.meta.description,
    applicationName: siteConfig.name,
    keywords: [
      "Cursor",
      "Cursor India",
      "AI coding",
      "developer community",
      "India",
      "Bengaluru",
      "Hyderabad",
      "Delhi",
      "Mumbai",
      "Pune",
      "Chennai",
      "meetup",
      "hackathon",
      "Café Cursor",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${dict.meta.titleSuffix}`,
      description: dict.meta.description,
      url: siteConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${dict.meta.titleSuffix}`,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      shortcut: "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1b1b1b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Theme-only boot script. Locale is now driven by a server-read cookie, so we
// no longer need to mutate <html lang> from this inline script — the server
// already set it correctly during SSR.
const themeBootScript = `
(function(){try{
  var t = localStorage.getItem('cursor-india-theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme','light');
  }
}catch(e){}})();
`.trim();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      data-locale={locale}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <LocaleProvider initialLocale={locale}>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <CmdK />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

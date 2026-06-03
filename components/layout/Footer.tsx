import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/content/site.config";
import { getDict } from "@/lib/i18n/server";
import { ThemedLogo } from "../ui/ThemedLogo";

export async function Footer() {
  const dict = await getDict();
  const t = dict.footer;

  const siteLinks = [
    { label: t.nav.events, href: "/events" },
    { label: t.nav.cities, href: "/cities" },
    { label: t.nav.ambassadors, href: "/ambassadors" },
    { label: t.nav.gallery, href: "/gallery" },
  ];

  const generalLinks: {
    label: string;
    href: string;
    external?: boolean;
  }[] = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.codeOfConduct, href: "/code-of-conduct" },
    {
      label: t.cursor.joinWhatsapp,
      href: siteConfig.community.whatsapp ?? "#",
      external: true,
    },
  ];

  const communityLinks: { label: string; href: string }[] = [
    {
      label: t.cursor.community,
      href: siteConfig.cursorOfficial.community,
    },
    {
      label: t.cursor.followX,
      href: siteConfig.cursorOfficial.x ?? "#",
    },
  ];

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] py-10 md:py-12">
      <Container width="wide">
        <div className="mb-10 flex max-w-sm flex-col gap-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            aria-label="Cursor India"
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
          <p className="text-sm text-[var(--color-muted)]">{t.tagline}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 md:gap-12">
          <FooterColumn title={t.sections.site}>
            {siteLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t.sections.general}>
            {generalLinks.map((item) =>
              item.external ? (
                <FooterExternalLink key={item.href} href={item.href}>
                  {item.label}
                </FooterExternalLink>
              ) : (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ),
            )}
          </FooterColumn>

          <FooterColumn title={t.sections.community}>
            {communityLinks.map((item) => (
              <FooterExternalLink key={item.href} href={item.href} arrow>
                {item.label}
              </FooterExternalLink>
            ))}
          </FooterColumn>
        </div>
      </Container>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-subtle)]">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

const linkClass =
  "w-fit text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

function FooterExternalLink({
  href,
  children,
  arrow = false,
}: {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        arrow
          ? "inline-flex w-fit items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] hover:underline underline-offset-4"
          : linkClass
      }
    >
      {children}
      {arrow ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
    </a>
  );
}

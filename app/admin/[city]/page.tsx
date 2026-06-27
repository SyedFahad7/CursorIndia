import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { getCityBySlug } from "@/content/cities";
import { getAdminCity, isAdminConfigured, isValidCitySlug } from "@/lib/admin-auth";
import { getAdminSettingsPayload } from "@/lib/admin-settings";
import { getEventsByCity } from "@/lib/events";
import { getRecapsByCity } from "@/lib/recaps";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "City admin",
};

interface PageProps {
  params: Promise<{ city: string }>;
}

export default async function AdminCityPage({ params }: PageProps) {
  const { city: cityParam } = await params;
  const citySlug = cityParam.trim().toLowerCase();

  if (!isValidCitySlug(citySlug)) notFound();

  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const configured = isAdminConfigured() && isSupabaseConfigured();
  const sessionCity = await getAdminCity();
  const isAuthed = sessionCity === citySlug;

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(45%_80%_at_50%_0%,var(--color-coral-glow)_0%,transparent_72%)]"
      />
      <Container width="wide" className="relative">
        {!configured ? (
          <Card className="mx-auto max-w-lg p-6 md:p-8">
            <Text variant="muted" className="text-sm leading-relaxed">
              Admin is not configured yet. Add Supabase and ambassador passwords to your{" "}
              <code className="text-xs">.env.local</code> (see{" "}
              <code className="text-xs">docs/supabase-setup.md</code>).
            </Text>
          </Card>
        ) : isAuthed ? (
          <AdminDashboard
            city={citySlug}
            cityName={city.name}
            settings={await getAdminSettingsPayload(citySlug)}
            events={await getEventsByCity(citySlug)}
            recaps={await getRecapsByCity(citySlug)}
          />
        ) : (
          <AdminLoginForm city={citySlug} cityName={city.name} />
        )}
      </Container>
    </section>
  );
}

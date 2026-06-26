import { Hero } from "@/components/home/Hero";
import { IntroCard } from "@/components/home/IntroCard";
import { StatStrip } from "@/components/home/StatStrip";
import { NextEvent } from "@/components/home/NextEvent";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CitiesGrid } from "@/components/home/CitiesGrid";
import { AmbassadorsStrip } from "@/components/home/AmbassadorsStrip";
import { PhotoCarousel } from "@/components/home/PhotoCarousel";
import { GlobalEventsCard } from "@/components/home/GlobalEventsCard";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { SectionBreak } from "@/components/ui/SectionBreak";
import { LUMA_REVALIDATE_SECONDS } from "@/lib/revalidate";

export const revalidate = LUMA_REVALIDATE_SECONDS;

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionBreak />
      <IntroCard />
      <SectionBreak />
      <StatStrip />
      <SectionBreak />
      <NextEvent />
      <SectionBreak />
      <UpcomingEvents />
      <SectionBreak />
      <CitiesGrid />
      <SectionBreak />
      <AmbassadorsStrip />
      <SectionBreak />
      <HomeFAQ />
      <SectionBreak />
      <PhotoCarousel />
      <SectionBreak />
      <GlobalEventsCard />
    </>
  );
}

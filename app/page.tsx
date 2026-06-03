import { Hero } from "@/components/home/Hero";
import { IntroCard } from "@/components/home/IntroCard";
import { StatStrip } from "@/components/home/StatStrip";
import { NextEvent } from "@/components/home/NextEvent";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CitiesGrid } from "@/components/home/CitiesGrid";
import { AmbassadorsStrip } from "@/components/home/AmbassadorsStrip";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";
import { LetterFromAPAC } from "@/components/home/LetterFromAPAC";

export const revalidate = 21600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroCard />
      <StatStrip />
      <NextEvent />
      <UpcomingEvents />
      <CitiesGrid />
      <AmbassadorsStrip />
      <PhotoMarquee />
      <LetterFromAPAC />
    </>
  );
}

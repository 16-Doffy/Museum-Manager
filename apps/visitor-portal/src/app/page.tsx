'use client';

import { HeroSection } from '@/components/HeroSection';
import { FeaturedExhibits } from '@/components/FeaturedExhibits';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { MuseumStats } from '@/components/MuseumStats';
import { VirtualTour } from '@/components/VirtualTour';
import { NewsSection } from '@/components/NewsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MuseumStats />
      <FeaturedExhibits />
      <UpcomingEvents />
      <VirtualTour />
      <NewsSection />
    </div>
  );
}

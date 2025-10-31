'use client';

import { HeroSection } from '@/components/HeroSection';
import { FeaturedExhibits } from '@/components/FeaturedExhibits';
import { MuseumStats } from '@/components/MuseumStats';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MuseumStats />
      <FeaturedExhibits />
    </div>
  );
}

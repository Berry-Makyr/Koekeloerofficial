import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedTabs from '@/components/home/FeaturedTabs';
import PromoBanner from '@/components/home/PromoBanner';
import BrandStorySection from '@/components/home/BrandStorySection';
import StoreLocationsPreview from '@/components/home/StoreLocationsPreview';
import InstagramLookbook from '@/components/home/InstagramLookbook';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Carousel */}
      <HeroSlider />

      {/* 2. Beachsand-Inspired Category Grid */}
      <CategoryGrid />

      {/* 3. Featured Tabbed Product Showcase */}
      <FeaturedTabs />

      {/* 4. Seasonal Promo Banner */}
      <PromoBanner />

      {/* 5. Our Story & Heritage Section */}
      <BrandStorySection />

      {/* 6. Western Cape Store Locations */}
      <StoreLocationsPreview />

      {/* 7. Social Media Lookbook */}
      <InstagramLookbook />

      {/* 8. Testimonials & Customer Reviews */}
      <TestimonialsSection />
    </div>
  );
}

import { HeroSection } from '@/components/blocks/hero-section';
import { Features } from '@/components/blocks/features-9';
import { HowItWorks } from '@/components/blocks/how-it-works';
import { PricingTable } from '@clerk/nextjs';
import { MorphingText } from '@/components/ui/morphing-text';
import { Footer } from '@/components/blocks/footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* New Features Section */}
      <Features />

      {/* How It Works Timeline */}
      <HowItWorks />

      {/* Clerk Pricing Section */}
      <div className="py-24 bg-background flex justify-center">
         <div className="w-full max-w-6xl px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Simple, Transparent Pricing
            </h2>
            <PricingTable />
         </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import { HeroSection } from '@/components/blocks/hero-section';
import { Features } from '@/components/blocks/features-9';
import { HowItWorks } from '@/components/blocks/how-it-works';
import { PricingSlider } from '@/components/ui/pricing-slider';
import { MorphingText } from '@/components/ui/morphing-text';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* New Features Section */}
      <Features />

      {/* How It Works Timeline */}
      <HowItWorks />

      {/* New Pricing Section */}
      <PricingSlider />

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg flex items-center justify-center">
                <Image src="/icon.png" alt="STrack Logo" width={32} height={32} className="size-8" />
              </div>
              <div className="w-64 h-6 relative">
                 <MorphingText texts={["STrack", "Subscription Track"]} className="font-bold text-xl text-foreground !w-full !h-full" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 STrack with ❤️. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SUBSCRIPTION_TIERS = [
  { count: 1, price: 1.99 },
  { count: 3, price: 1.99 },
  { count: 5, price: 1.99 },
  { count: 10, price: '5%' },
  { count: 20, price: '5%' },
  { count: 50, price: '5%' },
  { count: 100, price: '5%' },
  { count: 500, price: '5%' },
  { count: 1000, price: '5%' },
];

export const PricingSlider = () => {
  const [sliderIndex, setSliderIndex] = useState(2); // Default to 5 subs
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const currentTier = SUBSCRIPTION_TIERS[sliderIndex];
  const isFree = currentTier.count <= 5;
  const isPercentage = false; // logic removed based on new request

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderIndex(Number(e.target.value));
  };

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }
    
    // For free tier, maybe just redirect to dashboard?
    // simulating flow anyway
    setLoading(true);

    try {
      // Simulate Stripe delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create the subscription in the dashboard
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: isFree ? 'STrack Free' : 'STrack Pro',
          url: 'https://strack.app', 
          cost: isFree ? 0 : 1.99,
          currency: 'USD',
          billingCycle: 'monthly',
          category: 'software',
          startDate: new Date().toISOString(),
          notes: isFree ? 'Free Tier (Up to 5 subs)' : 'Pro Tier ($1.99/mo)',
        }),
      });

      if (!response.ok) throw new Error('Failed to create subscription');

      toast.success(isFree ? 'Free plan activated!' : 'Subscription activated! Welcome to STrack Pro.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6" id="pricing">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card: Calculator */}
        <div className="flex-1 rounded-2xl border border-border/50 bg-card p-8 relative shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Estimate your cost
          </h2>
          <div className="text-4xl font-bold text-foreground mb-8">
            {currentTier.count >= 1000 ? '1000+' : currentTier.count} {currentTier.count === 1 ? 'Subscription' : 'Subscriptions'}
          </div>
          
          <input
            type="range"
            min={0}
            max={SUBSCRIPTION_TIERS.length - 1}
            step={1}
            value={sliderIndex}
            onChange={handleSliderChange}
            className="w-full appearance-none h-3 rounded-full bg-secondary mb-12 cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-primary-custom) 0%, var(--color-primary-custom) ${
                (sliderIndex / (SUBSCRIPTION_TIERS.length - 1)) * 100
              }%, var(--muted) ${(sliderIndex / (SUBSCRIPTION_TIERS.length - 1)) * 100}%, var(--muted) 100%)`,
            }}
          />

          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 28px;
              height: 28px;
              background: #ffffff;
              border: 4px solid var(--color-primary-custom);
              border-radius: 50%;
              cursor: grab;
              margin-top: -1px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          
           <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
             <span>{isFree ? "Free forever" : "$1.99 only"}</span>
          </div>

        </div>

        {/* Right Card: Plan Details */}
        <div className="flex-1 rounded-2xl border border-border/50 bg-secondary/30 p-8 flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Your Plan
          </h2>
          
          <div className="mb-6">
            <h3 className="text-5xl font-bold text-foreground tracking-tight">
              {isFree ? 'Free' : '$1.99'}
              {!isFree && <span className="text-lg text-muted-foreground font-normal ml-2">/ month</span>}
            </h3>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
            {isFree
              ? "Start for free. Track up to 5 subscriptions forever."
              : "Unlimited tracking. Just $1.99 per month for power users."}
          </p>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-[var(--color-primary-custom)] hover:opacity-90 text-[var(--color-primary-content)] text-lg font-semibold py-4 rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Processing...
              </>
            ) : (
                isFree ? 'Get Started' : 'Subscribe Now'
            )}
          </button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
             {isFree ? 'No credit card required' : 'Secured by Stripe (Simulated)'}
          </p>
        </div>
      </div>
    </section>
  );
};

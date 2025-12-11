import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import DynamicTextSlider from "@/components/ui/dynamic-text-slider";

export function HowItWorks() {
  const data = [
    {
      title: "Step 1",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <strong>Paste Your Link.</strong> simply copy any subscription confirmation email URL or billing page link. We understand format from thousands of providers.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070&auto=format&fit=crop"
                    alt="Email Confirmation"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
                    alt="Copy Link"
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
             <strong>We Parse It For You.</strong> Our intelligent engine extracts the cost, billing cycle, and renewal date automatically. No manual data entry needed (with easy manual fallback available just in case).
          </p>
          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                    alt="Data Processing"
                    fill
                    className="object-cover"
                />
            </div>
             <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2070&auto=format&fit=crop"
                    alt="Analytics"
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
             <strong>Stay Informed.</strong> Get notified before every charge. view your total monthly spend and cancel unwanted subscriptions with one click.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                    alt="Dashboard"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full relative">
                 <Image
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"
                    alt="Savings"
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <DynamicTextSlider />
      <Timeline data={data} showHeader={false} />
    </div>
  );
}

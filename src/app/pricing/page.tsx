import { PricingTable } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pricing - Simple & Transparent Plans",
  description: "Choose the perfect STrack plan for you. Start free with 5 subscriptions or upgrade to Pro for unlimited tracking. No hidden fees, cancel anytime.",
  keywords: ["subscription tracker pricing", "free subscription manager", "subscription app cost", "pro plan"],
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "STrack Pricing - Free & Pro Plans",
    description: "Start free or upgrade to Pro for unlimited subscription tracking.",
    url: "/pricing",
  }
}

export default function PricingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 1rem' }}>
        <PricingTable />
      </div>
    </div>
  )
}

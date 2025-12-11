import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 1rem' }}>
        <PricingTable />
      </div>
    </div>
  )
}

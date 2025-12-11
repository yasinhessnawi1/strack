import { Footer } from '@/components/blocks/footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read STrack's Terms of Service. Understand your rights and obligations when using our subscription tracking platform.",
  alternates: {
    canonical: "/terms"
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is STrack's refund policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pro plan subscriptions can be canceled at any time. We offer pro-rated refunds for annual plans within the first 30 days."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel my Pro subscription anytime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can cancel your Pro subscription at any time. Your subscription will remain active until the end of your current billing period."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to my data if I cancel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your data remains accessible for 30 days after cancellation. After that, it will be permanently deleted unless you reactivate your account."
      }
    }
  ]
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StructuredData data={faqSchema} />
      
      <header className="px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <span className="font-bold text-lg">STrack</span>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using STrack ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              STrack provides a subscription management platform allowing users to track recurring expenses, receive notifications, and analyze spending habits. The Service is provided "as is" and assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. STrack reserves the right to refuse service, terminate accounts, remove or edit content in its sole discretion.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">4. Pro Plans and Payments</h2>
            <p className="text-muted-foreground">
              Optional paid services such as "Pro" or "Unlimited" plans are available on the Service. By selecting a paid service, you agree to pay STrack the monthly or annual subscription fees indicated for that service. Payments will be charged on a pre-pay basis on the day you sign up for an Upgrade and will cover the use of that service for a monthly or annual subscription period as indicated.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall STrack, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="space-y-4 mb-8">
             <h2 className="text-2xl font-semibold">7. Contact Us</h2>
             <p className="text-muted-foreground">
               If you have any questions about these Terms, please contact us at support@strack.website.
             </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

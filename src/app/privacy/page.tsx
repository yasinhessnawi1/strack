import { Footer } from '@/components/blocks/footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "STrack's Privacy Policy. Learn how we collect, use, and protect your data. GDPR & CCPA compliant.",
  keywords: ["privacy policy", "data protection", "GDPR", "CCPA", "data security"],
  alternates: {
    canonical: "/privacy"
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What personal data does STrack collect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We collect information you provide directly: name, email, payment details (via Stripe), and your subscription tracking data. We don't sell your data to third parties."
      }
    },
    {
      "@type": "Question",
      "name": "Is my subscription data encrypted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all data is encrypted in transit using HTTPS and at rest in our Firebase database. We follow industry-standard security practices."
      }
    },
    {
      "@type": "Question",
      "name": "Can I delete my account and data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can request account deletion at any time. All your data will be permanently deleted within 30 days."
      }
    },
    {
      "@type": "Question",
      "name": "Does STrack comply with GDPR and CCPA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we are fully compliant with GDPR and CCPA regulations. You have the right to access, correct, delete, or port your data."
      }
    }
  ]
}

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Information Collection</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This information may include your name, email address, payment information, and your subscription tracking details.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. Use of Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, including to process transactions, send you technical notices and support messages, and to communicate with you about products, services, offers, and events offered by STrack.
            </p>
          </section>

           <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not share your personal information with third parties except as described in this policy. We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processing via Stripe, authentication via Clerk).
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p className="text-muted-foreground">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet transmission is completely secure, and we cannot guarantee different security.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">6. Your Rights (GDPR & CCPA)</h2>
            <p className="text-muted-foreground">
              Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or port your data. To exercise these rights, please contact us at support@strack.website.
            </p>
          </section>

          <section className="space-y-4 mb-8">
             <h2 className="text-2xl font-semibold">7. Contact Us</h2>
             <p className="text-muted-foreground">
               If you have any questions about this Privacy Policy, please contact us at support@strack.website.
             </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

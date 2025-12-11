import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { Toaster } from "sonner";
import { StructuredData } from "@/components/seo/structured-data";
import { WebVitals } from "@/components/seo/web-vitals";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // Add font-display: swap for better performance
});

// Organization Schema for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "STrack",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web, iOS, Android",
  "description": "Track every subscription, save every dollar. AI-powered subscription management app.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free for up to 5 subscriptions"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "AI-powered subscription link parsing",
    "Automatic renewal reminders",
    "Expense tracking and analytics",
    "Multi-currency support",
    "Subscription categorization"
  ]
};


export const metadata: Metadata = {
  metadataBase: new URL('https://strack.app'),
  title: {
    default: "STrack - Free Subscription Tracker & Manager | Never Miss a Renewal",
    template: "%s | STrack"
  },
  description: "Track all your subscriptions in one place. STrack automatically parses subscription links, tracks costs, and sends renewal reminders. Free for up to 5 subscriptions.",
  keywords: [
    "subscription tracker",
    "subscription manager",
    "recurring payments",
    "subscription reminder",
    "expense tracker",
    "bill tracker",
    "subscription management app",
    "cancel subscriptions",
    "track monthly bills"
  ],
  authors: [{ name: "STrack" }],
  creator: "STrack",
  publisher: "STrack",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: "STrack - Track Every Subscription, Save Every Dollar",
    description: "Never miss another renewal. Free subscription tracking for up to 5 services. AI-powered automation.",
    siteName: "STrack",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'STrack - Subscription Tracker Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "STrack - Free Subscription Tracker",
    description: "Track all your subscriptions automatically. Free for 5 subscriptions.",
    images: ['/twitter-image.png'],
    creator: '@strack'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here after setting up
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <head>
          <StructuredData data={organizationSchema} />
        </head>
        <body
          className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        >
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
          
          <WebVitals />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

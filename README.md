<p align="center">
  <img src="public/icon.png" alt="STrack Logo" width="80" height="80" />
</p>

<h1 align="center">STrack</h1>

<p align="center">
  <strong>Track Every Subscription, Save Every Dollar</strong>
</p>

<p align="center">
  Never miss another renewal. STrack automatically parses subscription links, tracks costs, and reminds you before payments hit.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#license">License</a>
</p>

---

## What is STrack?

STrack is a modern subscription management SaaS that helps you take control of your recurring expenses. Simply paste a subscription link or type a service name — STrack uses AI-powered parsing to automatically extract pricing, billing cycles, and service details from 100+ known services.

## Features

### 🔗 Smart Link Parsing
Paste any subscription URL (Netflix, Spotify, Adobe, etc.) and STrack automatically extracts:
- Service name and logo
- Pricing details
- Billing cycle (monthly, yearly, weekly, quarterly)
- Cancel and manage URLs

### 💰 Multi-Currency Support
- Track subscriptions in any currency
- Automatic currency conversion using live exchange rates
- View your total spend in your preferred display currency

### 📊 Visual Analytics
- See your monthly and yearly spending at a glance
- Track upcoming payments
- Visualize spending trends over time with beautiful charts

### 🔔 Smart Notifications (Coming Soon)
Get reminded before renewals hit:
- 3-day advance payment reminders
- Never get charged for subscriptions you forgot about

### 🌍 100+ Pre-configured Services
Built-in support for popular services including:
- **Streaming**: Netflix, Spotify, Disney+, HBO Max, Hulu, Amazon Prime, YouTube Premium
- **Software**: Adobe Creative Cloud, Figma, JetBrains, GitHub, Notion
- **AI Tools**: ChatGPT, Claude, Midjourney, GitHub Copilot, Cursor
- **Cloud**: Dropbox, Google One, iCloud+, Vercel, Netlify
- **Productivity**: Slack, Zoom, Microsoft 365, Trello, Asana
- **And many more...**

### 🔐 100% Private
Your subscription data stays secure with:
- Clerk authentication
- Firebase-backed secure storage
- No selling of your data

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Firebase](https://firebase.google.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Radix UI, custom components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI Extraction**: Google Gemini API
- **Form Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/subscription-manager.git
cd subscription-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Google AI (for subscription parsing)
GOOGLE_AI_API_KEY=your-gemini-api-key

# Currency API (optional)
EXCHANGE_RATE_API_KEY=your-api-key
```

## Project Structure

```
subscription-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── subscriptions/  # Subscription CRUD endpoints
│   │   │   ├── currency/       # Currency conversion
│   │   │   └── user/           # User preferences
│   │   ├── dashboard/          # Main dashboard
│   │   ├── pricing/            # Pricing page
│   │   └── ...
│   ├── components/
│   │   ├── blocks/             # Page sections (hero, features, etc.)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── ui/                 # Reusable UI components
│   │   └── seo/                # SEO components
│   ├── lib/
│   │   ├── subscription-extractor/  # AI-powered parsing logic
│   │   ├── firebase.ts         # Firebase configuration
│   │   └── currency.ts         # Currency utilities
│   ├── models/                 # Data models
│   └── services/               # Business logic services
├── public/                     # Static assets
└── ...
```

## Deployment

### Deploy on Vercel

The easiest way to deploy STrack is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  Built with ❤️ for people tired of surprise subscription charges
</p>

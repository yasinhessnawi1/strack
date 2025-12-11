import { SubscriptionCategory } from '@/models/subscription';

/**
 * Billing cycle options for subscriptions
 */
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Source that successfully extracted the subscription data
 */
export type ExtractionSource = 'ai' | 'scraper' | 'manual' | 'known_service';

/**
 * Supported currencies with their codes
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SEK' | 'NOK' | 'DKK';

/**
 * Input types that the resolver can handle
 */
export type InputType = 'url' | 'service_name' | 'partial_url';

/**
 * Resolved input with normalized data
 */
export interface ResolvedInput {
  originalInput: string;
  inputType: InputType;
  url: string | null;
  serviceName: string | null;
  planHint: string | null;
  billingHint: BillingCycle | null;
  knownServiceKey: string | null;
}

/**
 * Pricing tier from AI extraction
 */
export interface PricingTier {
  plan: string;
  cost: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
}

/**
 * Recommended plan from AI
 */
export interface RecommendedPlan {
  cost: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  reason: string;
}

/**
 * Expected response structure from Gemini AI
 */
export interface GeminiExtractionResponse {
  name: string | null;
  description: string | null;
  pricing: PricingTier[];
  recommendedPlan: RecommendedPlan | null;
  category: SubscriptionCategory | null;
  manageUrl: string | null;
  cancelUrl: string | null;
  logoUrl: string | null;
  confidence: number;
}

/**
 * Result of an extraction attempt
 */
export interface ExtractionAttempt {
  method: ExtractionSource;
  success: boolean;
  error?: string;
  durationMs: number;
}

/**
 * Final extraction result returned to the API
 */
export interface ExtractionResult {
  success: boolean;
  source: ExtractionSource;
  confidence: number;
  attempts: ExtractionAttempt[];

  // Extracted data
  name: string | null;
  description: string | null;
  cost: number | null;
  currency: CurrencyCode | null;
  billingCycle: BillingCycle | null;
  category: SubscriptionCategory | null;
  logoUrl: string | null;
  manageUrl: string | null;
  cancelUrl: string | null;

  // Fields that need manual input
  requiresManualInput: string[];

  // Original input for reference
  resolvedInput: ResolvedInput;
}

/**
 * Known service definition with pre-populated data
 */
export interface KnownService {
  name: string;
  domain: string;
  aliases: string[];
  defaultCurrency: CurrencyCode;
  defaultBillingCycle: BillingCycle;
  category: SubscriptionCategory;
  logoUrl?: string;
  pricingUrl?: string;
  manageUrl?: string;
  cancelUrl?: string;
  typicalPrices?: {
    plan: string;
    cost: number;
    billingCycle: BillingCycle;
  }[];
}

/**
 * Scraped page content for AI processing
 */
export interface ScrapedContent {
  title: string | null;
  description: string | null;
  bodyText: string;
  metaTags: Record<string, string>;
  jsonLd: object[];
  links: { href: string; text: string }[];
}

/**
 * Validation result for inputs
 */
export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
}

/**
 * Configuration for the extraction pipeline
 */
export interface ExtractionConfig {
  aiEnabled: boolean;
  scraperEnabled: boolean;
  aiConfidenceThreshold: number;
  aiTimeoutMs: number;
  scraperTimeoutMs: number;
  maxRetries: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: ExtractionConfig = {
  aiEnabled: true,
  scraperEnabled: true,
  aiConfidenceThreshold: 0.7,
  aiTimeoutMs: 15000,
  scraperTimeoutMs: 10000,
  maxRetries: 2,
};

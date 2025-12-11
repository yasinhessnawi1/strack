import { ResolvedInput, InputType, BillingCycle, CurrencyCode } from './types';
import { findKnownService, findKnownServiceByUrl, KNOWN_SERVICES } from './known-services';
import { validateUserInput, sanitizeString, validatePrice } from './validators';

/**
 * Keywords that hint at billing cycles
 */
const BILLING_HINTS: Record<string, BillingCycle> = {
  weekly: 'weekly',
  week: 'weekly',
  'per week': 'weekly',
  'a week': 'weekly',
  'every week': 'weekly',
  monthly: 'monthly',
  month: 'monthly',
  'per month': 'monthly',
  'a month': 'monthly',
  'every month': 'monthly',
  '/mo': 'monthly',
  quarterly: 'quarterly',
  quarter: 'quarterly',
  '3 months': 'quarterly',
  'every 3 months': 'quarterly',
  yearly: 'yearly',
  annual: 'yearly',
  annually: 'yearly',
  year: 'yearly',
  'per year': 'yearly',
  'a year': 'yearly',
  'every year': 'yearly',
  '/yr': 'yearly',
};

/**
 * Keywords that hint at specific plans
 */
const PLAN_HINTS = [
  'free',
  'basic',
  'starter',
  'standard',
  'plus',
  'pro',
  'premium',
  'professional',
  'business',
  'enterprise',
  'team',
  'teams',
  'family',
  'individual',
  'student',
  'unlimited',
  'ultimate',
];

/**
 * Currency symbols and their codes
 */
const CURRENCY_SYMBOLS: Record<string, CurrencyCode> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  'kr': 'SEK',
  'dollar': 'USD',
  'dollars': 'USD',
  'euro': 'EUR',
  'euros': 'EUR',
  'pound': 'GBP',
  'pounds': 'GBP',
  'usd': 'USD',
  'eur': 'EUR',
  'gbp': 'GBP',
  'sek': 'SEK',
  'nok': 'NOK',
  'dkk': 'DKK',
};

/**
 * Extended resolved input with price extraction for custom subscriptions
 */
export interface ExtendedResolvedInput extends ResolvedInput {
  isCustomSubscription: boolean;
  extractedPrice: number | null;
  extractedCurrency: CurrencyCode | null;
  customDescription: string | null;
}

/**
 * Determine if input looks like a URL
 */
function looksLikeUrl(input: string): boolean {
  // Has protocol
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return true;
  }

  // Looks like a domain (contains dots and common TLDs)
  const domainPattern = /^[\w-]+\.[\w.-]+$/;
  if (domainPattern.test(input)) {
    return true;
  }

  // Contains URL-like patterns
  if (input.includes('www.') || input.includes('.com') || input.includes('.io')) {
    return true;
  }

  return false;
}

/**
 * Determine if input looks like a partial URL (domain without protocol)
 */
function looksLikePartialUrl(input: string): boolean {
  // Must contain a dot
  if (!input.includes('.')) {
    return false;
  }

  // Should not have spaces
  if (input.includes(' ')) {
    return false;
  }

  // Common TLD patterns
  const tldPattern = /\.(com|org|net|io|co|app|so|us|ai|tv|me|dev|cloud)$/i;
  return tldPattern.test(input);
}

/**
 * Extract billing cycle hint from input string
 */
function extractBillingHint(input: string): BillingCycle | null {
  const lowerInput = input.toLowerCase();

  for (const [hint, cycle] of Object.entries(BILLING_HINTS)) {
    if (lowerInput.includes(hint)) {
      return cycle;
    }
  }

  return null;
}

/**
 * Extract plan hint from input string
 */
function extractPlanHint(input: string): string | null {
  const lowerInput = input.toLowerCase();

  for (const hint of PLAN_HINTS) {
    if (lowerInput.includes(hint)) {
      return hint;
    }
  }

  return null;
}

/**
 * Extract price from input string
 * Handles formats like: "$10", "10 dollars", "10 USD", "€50", etc.
 */
function extractPrice(input: string): { price: number | null; currency: CurrencyCode | null } {
  const lowerInput = input.toLowerCase();

  // Pattern: $10, €50, £20
  const symbolFirstPattern = /[$€£]\s*(\d+(?:[.,]\d{1,2})?)/;
  const symbolFirstMatch = input.match(symbolFirstPattern);
  if (symbolFirstMatch) {
    const symbol = input.match(/[$€£]/)?.[0];
    const price = validatePrice(symbolFirstMatch[1]);
    const currency = symbol ? CURRENCY_SYMBOLS[symbol] : null;
    return { price, currency };
  }

  // Pattern: 10 dollars, 50 euros, 20 USD
  const priceWordPattern = /(\d+(?:[.,]\d{1,2})?)\s*(dollars?|euros?|pounds?|usd|eur|gbp|sek|nok|dkk|kr)/i;
  const priceWordMatch = lowerInput.match(priceWordPattern);
  if (priceWordMatch) {
    const price = validatePrice(priceWordMatch[1]);
    const currencyWord = priceWordMatch[2].toLowerCase();
    const currency = CURRENCY_SYMBOLS[currencyWord] || null;
    return { price, currency };
  }

  // Pattern: just a number in context (e.g., "training for 10 a month")
  // Be more careful here - only extract if there's billing context
  const hasBillingContext = Object.keys(BILLING_HINTS).some(hint =>
    lowerInput.includes(hint)
  );

  if (hasBillingContext) {
    const standaloneNumberPattern = /(?:for|costs?|price|at|=)\s*(\d+(?:[.,]\d{1,2})?)/i;
    const standaloneMatch = lowerInput.match(standaloneNumberPattern);
    if (standaloneMatch) {
      const price = validatePrice(standaloneMatch[1]);
      return { price, currency: null };
    }
  }

  return { price: null, currency: null };
}

/**
 * Detect if input looks like a custom/personal subscription
 * (not a known service, contains price and billing info)
 */
function isLikelyCustomSubscription(input: string): boolean {
  const lowerInput = input.toLowerCase();

  // Must have some billing context
  const hasBillingContext = Object.keys(BILLING_HINTS).some(hint =>
    lowerInput.includes(hint)
  );

  // Should have price indicators
  const hasPriceIndicator = /[$€£]|\d+\s*(dollars?|euros?|pounds?|usd|eur|gbp)/i.test(lowerInput);

  // Common patterns for custom subscriptions
  const customPatterns = [
    /training/i,
    /lesson/i,
    /class/i,
    /tutor/i,
    /gift/i,
    /allowance/i,
    /membership/i,
    /gym/i,
    /club/i,
    /donation/i,
    /support/i,
    /payment/i,
    /fee/i,
    /rent/i,
    /service/i,
    /subscription/i,
  ];

  const hasCustomPattern = customPatterns.some(pattern => pattern.test(lowerInput));

  // If it has billing context with price, and either has custom patterns
  // or doesn't look like a URL/known service, it's likely custom
  return (hasBillingContext || hasPriceIndicator) && (hasCustomPattern || !looksLikeUrl(input));
}

/**
 * Extract a clean name from custom subscription input
 * e.g., "private training for 10 dollars a month" -> "Private Training"
 */
function extractCustomName(input: string): string {
  let cleaned = input;

  // Remove price patterns
  cleaned = cleaned.replace(/[$€£]\s*\d+(?:[.,]\d{1,2})?/g, '');
  cleaned = cleaned.replace(/\d+(?:[.,]\d{1,2})?\s*(dollars?|euros?|pounds?|usd|eur|gbp|sek|nok|dkk|kr)/gi, '');
  cleaned = cleaned.replace(/(?:for|costs?|price|at|=)\s*\d+/gi, '');

  // Remove billing hints
  for (const hint of Object.keys(BILLING_HINTS)) {
    cleaned = cleaned.replace(new RegExp(`\\s*${hint}\\s*`, 'gi'), ' ');
  }

  // Remove common filler words
  cleaned = cleaned.replace(/\b(for|my|the|a|an|to|of|per)\b/gi, ' ');

  // Clean up whitespace
  cleaned = cleaned.trim().replace(/\s+/g, ' ');

  // Capitalize first letter of each word
  return cleaned
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Clean service name by removing plan and billing hints
 */
function cleanServiceName(input: string): string {
  let cleaned = input.toLowerCase();

  // Remove billing hints
  for (const hint of Object.keys(BILLING_HINTS)) {
    cleaned = cleaned.replace(new RegExp(`\\s*${hint}\\s*`, 'gi'), ' ');
  }

  // Remove plan hints
  for (const hint of PLAN_HINTS) {
    cleaned = cleaned.replace(new RegExp(`\\s*${hint}\\s*`, 'gi'), ' ');
  }

  return cleaned.trim().replace(/\s+/g, ' ');
}

/**
 * Try to construct a URL from a service name
 */
function constructServiceUrl(serviceName: string): string | null {
  const cleaned = cleanServiceName(serviceName);

  // Try to find in known services first
  const knownService = findKnownService(cleaned);
  if (knownService) {
    return knownService.pricingUrl || `https://www.${knownService.domain}`;
  }

  // Try to construct a URL from the cleaned name
  const urlFriendlyName = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

  if (urlFriendlyName.length < 2) {
    return null;
  }

  // Return a generic domain guess
  return `https://www.${urlFriendlyName}.com`;
}

/**
 * Normalize a URL by adding protocol if missing
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();

  // Remove leading/trailing whitespace and quotes
  normalized = normalized.replace(/^["']|["']$/g, '');

  // Add protocol if missing
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  // Remove trailing slash for consistency
  normalized = normalized.replace(/\/$/, '');

  return normalized;
}

/**
 * Resolve user input to structured data
 * Handles URLs, partial URLs, service names, and custom subscriptions
 *
 * Examples:
 * - "https://netflix.com" -> URL input, known service
 * - "spotify.com" -> Partial URL, known service
 * - "spotify monthly" -> Service name, known service
 * - "private training for $10 a month" -> Custom subscription
 * - "gifts to children 50 dollars every month" -> Custom subscription
 */
export function resolveInput(rawInput: string): ExtendedResolvedInput {
  // Validate and sanitize input
  const validation = validateUserInput(rawInput);
  const input = validation.isValid ? validation.sanitizedValue : sanitizeString(rawInput);

  // Default result
  const result: ExtendedResolvedInput = {
    originalInput: rawInput,
    inputType: 'service_name',
    url: null,
    serviceName: null,
    planHint: null,
    billingHint: null,
    knownServiceKey: null,
    isCustomSubscription: false,
    extractedPrice: null,
    extractedCurrency: null,
    customDescription: null,
  };

  // Extract hints first (they're useful regardless of input type)
  result.billingHint = extractBillingHint(input);
  result.planHint = extractPlanHint(input);

  // Check if this looks like a custom subscription first
  // (before checking URLs, since custom subscriptions might accidentally match URL patterns)
  if (isLikelyCustomSubscription(input) && !findKnownService(cleanServiceName(input))) {
    result.isCustomSubscription = true;
    result.inputType = 'service_name';

    // Extract price and currency
    const priceInfo = extractPrice(input);
    result.extractedPrice = priceInfo.price;
    result.extractedCurrency = priceInfo.currency;

    // Extract a clean name
    result.serviceName = extractCustomName(input);
    if (!result.serviceName || result.serviceName.length < 2) {
      result.serviceName = 'Custom Subscription';
    }

    // Store original as description
    result.customDescription = input;

    // No URL for custom subscriptions
    result.url = null;

    return result;
  }

  // Determine input type and resolve
  if (looksLikeUrl(input)) {
    result.inputType = 'url';
    result.url = normalizeUrl(input);

    // Try to find known service from URL
    const knownService = findKnownServiceByUrl(result.url);
    if (knownService) {
      result.serviceName = knownService.name;
      result.knownServiceKey = knownService.domain;
    } else {
      // Extract service name from domain
      try {
        const urlObj = new URL(result.url);
        const hostname = urlObj.hostname.replace('www.', '');
        const domainParts = hostname.split('.');
        result.serviceName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
      } catch {
        // URL parsing failed, leave serviceName null
      }
    }
  } else if (looksLikePartialUrl(input)) {
    result.inputType = 'partial_url';
    result.url = normalizeUrl(input);

    // Try to find known service
    const knownService = findKnownServiceByUrl(result.url);
    if (knownService) {
      result.serviceName = knownService.name;
      result.knownServiceKey = knownService.domain;
    }
  } else {
    // Treat as service name
    result.inputType = 'service_name';
    const cleanedName = cleanServiceName(input);
    result.serviceName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);

    // Try to find known service
    const knownService = findKnownService(input);
    if (knownService) {
      result.serviceName = knownService.name;
      result.knownServiceKey = knownService.domain;
      result.url = knownService.pricingUrl || `https://www.${knownService.domain}`;
    } else {
      // Construct a URL from the service name
      result.url = constructServiceUrl(input);
    }
  }

  return result;
}

/**
 * Get the best URL to scrape for a resolved input
 */
export function getBestUrlForScraping(resolved: ResolvedInput): string | null {
  if (resolved.knownServiceKey) {
    const service = KNOWN_SERVICES[resolved.knownServiceKey];
    if (service?.pricingUrl) {
      return service.pricingUrl;
    }
  }

  return resolved.url;
}

/**
 * Get known service data if available
 */
export function getKnownServiceData(resolved: ResolvedInput) {
  if (resolved.knownServiceKey) {
    return KNOWN_SERVICES[resolved.knownServiceKey];
  }

  return null;
}

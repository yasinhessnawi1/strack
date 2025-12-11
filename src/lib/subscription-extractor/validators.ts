import {
  ValidationResult,
  CurrencyCode,
  BillingCycle,
  GeminiExtractionResponse,
  ExtractionResult,
} from './types';
import { SubscriptionCategory } from '@/models/subscription';

/**
 * Maximum allowed input length to prevent abuse
 */
const MAX_INPUT_LENGTH = 2000;
const MAX_URL_LENGTH = 2048;
const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Valid currency codes
 */
const VALID_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK'];

/**
 * Valid billing cycles
 */
const VALID_BILLING_CYCLES: BillingCycle[] = ['weekly', 'monthly', 'quarterly', 'yearly'];

/**
 * Valid subscription categories
 */
const VALID_CATEGORIES: SubscriptionCategory[] = [
  'streaming',
  'software',
  'cloud',
  'productivity',
  'entertainment',
  'education',
  'finance',
  'health',
  'news',
  'other',
];

/**
 * Sanitize a string by removing potential XSS vectors and trimming
 */
export function sanitizeString(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Limit length
    .slice(0, maxLength);
}

/**
 * Validate and sanitize user input (URL or service name)
 */
export function validateUserInput(input: unknown): ValidationResult {
  const errors: string[] = [];

  // Type check
  if (typeof input !== 'string') {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['Input must be a string'],
    };
  }

  // Empty check
  if (!input.trim()) {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['Input cannot be empty'],
    };
  }

  // Length check
  if (input.length > MAX_INPUT_LENGTH) {
    errors.push(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
  }

  const sanitized = sanitizeString(input);

  // Check if it looks malicious
  if (containsSuspiciousPatterns(sanitized)) {
    errors.push('Input contains suspicious patterns');
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: sanitized,
    errors,
  };
}

/**
 * Validate a URL string
 */
export function validateUrl(url: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof url !== 'string') {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['URL must be a string'],
    };
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['URL cannot be empty'],
    };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    errors.push(`URL exceeds maximum length of ${MAX_URL_LENGTH} characters`);
  }

  // Add protocol if missing
  let urlToValidate = trimmed;
  if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
    urlToValidate = `https://${urlToValidate}`;
  }

  // Validate URL format
  try {
    const parsed = new URL(urlToValidate);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      errors.push('Only HTTP and HTTPS protocols are allowed');
    }

    // Check for suspicious patterns in URL
    if (containsSuspiciousPatterns(urlToValidate)) {
      errors.push('URL contains suspicious patterns');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: urlToValidate,
      errors,
    };
  } catch {
    return {
      isValid: false,
      sanitizedValue: trimmed,
      errors: ['Invalid URL format'],
    };
  }
}

/**
 * Check for suspicious patterns that might indicate malicious input
 */
function containsSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /onclick/i,
    /onerror/i,
    /onload/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate and normalize currency code
 */
export function validateCurrency(currency: unknown): CurrencyCode | null {
  if (typeof currency !== 'string') {
    return null;
  }

  const normalized = currency.toUpperCase().trim() as CurrencyCode;

  if (VALID_CURRENCIES.includes(normalized)) {
    return normalized;
  }

  // Try to map common alternatives
  const currencyMap: Record<string, CurrencyCode> = {
    DOLLAR: 'USD',
    DOLLARS: 'USD',
    '$': 'USD',
    EURO: 'EUR',
    EUROS: 'EUR',
    POUND: 'GBP',
    POUNDS: 'GBP',
    STERLING: 'GBP',
    KRONA: 'SEK',
    KRONOR: 'SEK',
    KRONE: 'NOK',
    KRONER: 'DKK',
  };

  return currencyMap[normalized] || null;
}

/**
 * Validate and normalize billing cycle
 */
export function validateBillingCycle(cycle: unknown): BillingCycle | null {
  if (typeof cycle !== 'string') {
    return null;
  }

  const normalized = cycle.toLowerCase().trim() as BillingCycle;

  if (VALID_BILLING_CYCLES.includes(normalized)) {
    return normalized;
  }

  // Try to map common alternatives
  const cycleMap: Record<string, BillingCycle> = {
    week: 'weekly',
    'per week': 'weekly',
    month: 'monthly',
    'per month': 'monthly',
    '/mo': 'monthly',
    '/month': 'monthly',
    quarter: 'quarterly',
    'per quarter': 'quarterly',
    '3 months': 'quarterly',
    year: 'yearly',
    annual: 'yearly',
    annually: 'yearly',
    'per year': 'yearly',
    '/yr': 'yearly',
    '/year': 'yearly',
  };

  return cycleMap[normalized] || null;
}

/**
 * Validate subscription category
 */
export function validateCategory(category: unknown): SubscriptionCategory | null {
  if (typeof category !== 'string') {
    return null;
  }

  const normalized = category.toLowerCase().trim() as SubscriptionCategory;

  if (VALID_CATEGORIES.includes(normalized)) {
    return normalized;
  }

  return null;
}

/**
 * Validate price/cost value
 */
export function validatePrice(price: unknown): number | null {
  if (typeof price === 'number') {
    if (isNaN(price) || !isFinite(price)) {
      return null;
    }

    // Reasonable price range (0 to 10000)
    if (price < 0 || price > 10000) {
      return null;
    }

    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
  }

  if (typeof price === 'string') {
    // Remove currency symbols and whitespace
    const cleaned = price.replace(/[$€£\s,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed) || !isFinite(parsed)) {
      return null;
    }

    if (parsed < 0 || parsed > 10000) {
      return null;
    }

    return Math.round(parsed * 100) / 100;
  }

  return null;
}

/**
 * Validate confidence score
 */
export function validateConfidence(confidence: unknown): number {
  if (typeof confidence !== 'number') {
    return 0;
  }

  if (isNaN(confidence) || !isFinite(confidence)) {
    return 0;
  }

  // Clamp to 0-1 range
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Validate the AI extraction response and convert to safe types
 */
export function validateGeminiResponse(response: unknown): GeminiExtractionResponse | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const data = response as Record<string, unknown>;

  try {
    const validated: GeminiExtractionResponse = {
      name: typeof data.name === 'string' ? sanitizeString(data.name, MAX_NAME_LENGTH) : null,
      description:
        typeof data.description === 'string'
          ? sanitizeString(data.description, MAX_DESCRIPTION_LENGTH)
          : null,
      pricing: validatePricingArray(data.pricing),
      recommendedPlan: validateRecommendedPlan(data.recommendedPlan),
      category: validateCategory(data.category),
      manageUrl: validateUrlField(data.manageUrl),
      cancelUrl: validateUrlField(data.cancelUrl),
      logoUrl: validateUrlField(data.logoUrl),
      confidence: validateConfidence(data.confidence),
    };

    return validated;
  } catch {
    return null;
  }
}

/**
 * Validate a URL field from AI response
 */
function validateUrlField(url: unknown): string | null {
  if (typeof url !== 'string' || !url.trim()) {
    return null;
  }

  const result = validateUrl(url);
  return result.isValid ? result.sanitizedValue : null;
}

/**
 * Validate pricing array from AI response
 */
function validatePricingArray(pricing: unknown): GeminiExtractionResponse['pricing'] {
  if (!Array.isArray(pricing)) {
    return [];
  }

  return pricing
    .filter((item): item is Record<string, unknown> => item && typeof item === 'object')
    .map((item) => ({
      plan: typeof item.plan === 'string' ? sanitizeString(item.plan, 100) : 'Standard',
      cost: validatePrice(item.cost) ?? 0,
      currency: validateCurrency(item.currency) ?? 'USD',
      billingCycle: validateBillingCycle(item.billingCycle) ?? 'monthly',
    }))
    .filter((item) => item.cost > 0);
}

/**
 * Validate recommended plan from AI response
 */
function validateRecommendedPlan(
  plan: unknown
): GeminiExtractionResponse['recommendedPlan'] {
  if (!plan || typeof plan !== 'object') {
    return null;
  }

  const data = plan as Record<string, unknown>;
  const cost = validatePrice(data.cost);

  if (cost === null || cost <= 0) {
    return null;
  }

  return {
    cost,
    currency: validateCurrency(data.currency) ?? 'USD',
    billingCycle: validateBillingCycle(data.billingCycle) ?? 'monthly',
    reason:
      typeof data.reason === 'string' ? sanitizeString(data.reason, 500) : 'Cheapest available',
  };
}

/**
 * Determine which fields require manual input based on extraction result
 */
export function getRequiredManualFields(result: Partial<ExtractionResult>): string[] {
  const requiredFields: string[] = [];

  if (!result.name) {
    requiredFields.push('name');
  }

  if (result.cost === null || result.cost === undefined || result.cost <= 0) {
    requiredFields.push('cost');
  }

  if (!result.currency) {
    requiredFields.push('currency');
  }

  if (!result.billingCycle) {
    requiredFields.push('billingCycle');
  }

  return requiredFields;
}

/**
 * Validate the final extraction result
 */
export function validateExtractionResult(result: unknown): boolean {
  if (!result || typeof result !== 'object') {
    return false;
  }

  const data = result as Record<string, unknown>;

  // Must have a source
  if (!['ai', 'scraper', 'manual', 'known_service'].includes(data.source as string)) {
    return false;
  }

  // Must have requiresManualInput array
  if (!Array.isArray(data.requiresManualInput)) {
    return false;
  }

  return true;
}

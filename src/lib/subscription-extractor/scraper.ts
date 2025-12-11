import * as cheerio from 'cheerio';
import {
  ScrapedContent,
  ExtractionAttempt,
  BillingCycle,
  CurrencyCode,
  DEFAULT_CONFIG,
} from './types';
import { validateUrl, validatePrice, sanitizeString } from './validators';

/**
 * Price detection patterns for various currencies and formats
 */
const PRICE_PATTERNS = [
  // Currency symbol first: $9.99, €9,99, £9.99
  { pattern: /\$\s*(\d+(?:[.,]\d{1,2})?)/g, currency: 'USD' as CurrencyCode },
  { pattern: /€\s*(\d+(?:[.,]\d{1,2})?)/g, currency: 'EUR' as CurrencyCode },
  { pattern: /£\s*(\d+(?:[.,]\d{1,2})?)/g, currency: 'GBP' as CurrencyCode },
  // Amount then currency: 9.99 USD, 99 SEK
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*USD/gi, currency: 'USD' as CurrencyCode },
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*EUR/gi, currency: 'EUR' as CurrencyCode },
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*GBP/gi, currency: 'GBP' as CurrencyCode },
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*SEK/gi, currency: 'SEK' as CurrencyCode },
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*NOK/gi, currency: 'NOK' as CurrencyCode },
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*DKK/gi, currency: 'DKK' as CurrencyCode },
  // Scandinavian format: 99 kr, 99:-
  { pattern: /(\d+(?:[.,]\d{1,2})?)\s*kr/gi, currency: 'SEK' as CurrencyCode },
  { pattern: /(\d+):-/g, currency: 'SEK' as CurrencyCode },
];

/**
 * Billing cycle detection patterns
 */
const BILLING_PATTERNS: { pattern: RegExp; cycle: BillingCycle }[] = [
  { pattern: /per\s*week|weekly|\/\s*week|\/wk/i, cycle: 'weekly' },
  { pattern: /per\s*month|monthly|\/\s*mo(?:nth)?|\/mo\b/i, cycle: 'monthly' },
  { pattern: /per\s*quarter|quarterly|every\s*3\s*months?|\/\s*qtr/i, cycle: 'quarterly' },
  { pattern: /per\s*year|yearly|annually|annual|\/\s*yr|\/\s*year/i, cycle: 'yearly' },
];

/**
 * CSS selectors for pricing elements (commonly used by pricing pages)
 */
const PRICING_SELECTORS = [
  // Common pricing container classes
  '.pricing',
  '.price',
  '[class*="pricing"]',
  '[class*="price"]',
  '[class*="plan"]',
  '[class*="tier"]',
  '[class*="subscription"]',
  // Specific price amount selectors
  '.price-amount',
  '.plan-price',
  '.subscription-price',
  '[data-price]',
  '[data-amount]',
  // Common pricing card structures
  '.pricing-card',
  '.plan-card',
  '.pricing-table',
];

/**
 * CSS selectors for cancel/manage links
 */
const CANCEL_LINK_SELECTORS = [
  'a[href*="cancel"]',
  'a[href*="unsubscribe"]',
  'a:contains("Cancel")',
  'a:contains("Unsubscribe")',
];

const MANAGE_LINK_SELECTORS = [
  'a[href*="account"]',
  'a[href*="manage"]',
  'a[href*="settings"]',
  'a[href*="subscription"]',
  'a[href*="billing"]',
  'a:contains("Account")',
  'a:contains("Manage")',
  'a:contains("Settings")',
];

/**
 * User agent to use for requests
 */
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Fetch a URL with timeout and error handling
 */
async function fetchUrl(
  url: string,
  timeoutMs: number = DEFAULT_CONFIG.scraperTimeoutMs
): Promise<string | null> {
  const validation = validateUrl(url);
  if (!validation.isValid) {
    console.error('Invalid URL:', validation.errors);
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(validation.sanitizedValue, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Fetch error:', error.message);
      }
    }
    return null;
  }
}

/**
 * Extract all prices from text
 */
function extractPrices(text: string): { amount: number; currency: CurrencyCode }[] {
  const prices: { amount: number; currency: CurrencyCode }[] = [];
  const seen = new Set<string>();

  for (const { pattern, currency } of PRICE_PATTERNS) {
    // Reset pattern state
    pattern.lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const amount = validatePrice(match[1]);
      if (amount !== null && amount > 0 && amount < 10000) {
        const key = `${amount}-${currency}`;
        if (!seen.has(key)) {
          seen.add(key);
          prices.push({ amount, currency });
        }
      }
    }
  }

  return prices;
}

/**
 * Detect billing cycle from text
 */
function detectBillingCycle(text: string): BillingCycle | null {
  for (const { pattern, cycle } of BILLING_PATTERNS) {
    if (pattern.test(text)) {
      return cycle;
    }
  }
  return null;
}

/**
 * Extract JSON-LD structured data from page
 */
function extractJsonLd($: cheerio.CheerioAPI): object[] {
  const jsonLdData: object[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLdData.push(parsed);
      }
    } catch {
      // Invalid JSON, skip
    }
  });

  return jsonLdData;
}

/**
 * Extract meta tags from page
 */
function extractMetaTags($: cheerio.CheerioAPI): Record<string, string> {
  const metaTags: Record<string, string> = {};

  // Open Graph tags
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr('property');
    const content = $(el).attr('content');
    if (property && content) {
      metaTags[property] = sanitizeString(content, 500);
    }
  });

  // Twitter cards
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr('name');
    const content = $(el).attr('content');
    if (name && content) {
      metaTags[name] = sanitizeString(content, 500);
    }
  });

  // Description
  const description = $('meta[name="description"]').attr('content');
  if (description) {
    metaTags['description'] = sanitizeString(description, 500);
  }

  return metaTags;
}

/**
 * Extract links from page
 */
function extractLinks($: cheerio.CheerioAPI, baseUrl: string): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();

    if (href && text) {
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        links.push({
          href: absoluteUrl,
          text: sanitizeString(text, 200),
        });
      } catch {
        // Invalid URL, skip
      }
    }
  });

  return links;
}

/**
 * Find cancel URL from links
 */
function findCancelUrl(links: { href: string; text: string }[]): string | null {
  const cancelKeywords = ['cancel', 'unsubscribe', 'end subscription', 'stop subscription'];

  for (const { href, text } of links) {
    const lowerText = text.toLowerCase();
    const lowerHref = href.toLowerCase();

    for (const keyword of cancelKeywords) {
      if (lowerText.includes(keyword) || lowerHref.includes(keyword)) {
        return href;
      }
    }
  }

  return null;
}

/**
 * Find manage URL from links
 */
function findManageUrl(links: { href: string; text: string }[]): string | null {
  const manageKeywords = [
    'account',
    'manage',
    'settings',
    'subscription',
    'billing',
    'profile',
    'my account',
    'my subscription',
  ];

  for (const { href, text } of links) {
    const lowerText = text.toLowerCase();
    const lowerHref = href.toLowerCase();

    for (const keyword of manageKeywords) {
      if (lowerText.includes(keyword) || lowerHref.includes(keyword)) {
        return href;
      }
    }
  }

  return null;
}

/**
 * Extract pricing-related text from page
 */
function extractPricingText($: cheerio.CheerioAPI): string {
  const pricingTexts: string[] = [];

  // Try pricing-specific selectors first
  for (const selector of PRICING_SELECTORS) {
    $(selector).each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        pricingTexts.push(text);
      }
    });
  }

  // If no pricing sections found, use full body text
  if (pricingTexts.length === 0) {
    return $('body').text().replace(/\s+/g, ' ').trim();
  }

  return pricingTexts.join(' ');
}

/**
 * Scrape a URL and extract content for AI processing
 */
export async function scrapeUrl(
  url: string,
  timeoutMs: number = DEFAULT_CONFIG.scraperTimeoutMs
): Promise<{
  content: ScrapedContent | null;
  attempt: ExtractionAttempt;
}> {
  const startTime = Date.now();

  const attempt: ExtractionAttempt = {
    method: 'scraper',
    success: false,
    durationMs: 0,
  };

  const html = await fetchUrl(url, timeoutMs);

  if (!html) {
    attempt.error = 'Failed to fetch URL';
    attempt.durationMs = Date.now() - startTime;
    return { content: null, attempt };
  }

  try {
    const $ = cheerio.load(html);

    // Extract various content types
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[property="og:site_name"]').attr('content') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      null;

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      null;

    const metaTags = extractMetaTags($);
    const jsonLd = extractJsonLd($);
    const links = extractLinks($, url);

    // Get body text, prioritizing pricing sections
    const pricingText = extractPricingText($);
    const bodyText = pricingText.slice(0, 10000); // Limit for AI processing

    const content: ScrapedContent = {
      title: title ? sanitizeString(title, 200) : null,
      description: description ? sanitizeString(description, 500) : null,
      bodyText,
      metaTags,
      jsonLd,
      links,
    };

    attempt.success = true;
    attempt.durationMs = Date.now() - startTime;

    return { content, attempt };
  } catch (error) {
    attempt.error = error instanceof Error ? error.message : 'Parse error';
    attempt.durationMs = Date.now() - startTime;
    return { content: null, attempt };
  }
}

/**
 * Extract subscription data directly from scraped content
 * (fallback when AI is not available)
 */
export function extractFromScrapedContent(
  content: ScrapedContent,
  url: string
): {
  name: string | null;
  cost: number | null;
  currency: CurrencyCode | null;
  billingCycle: BillingCycle | null;
  logoUrl: string | null;
  cancelUrl: string | null;
  manageUrl: string | null;
} {
  // Extract name from title
  const name = content.title;

  // Extract logo from meta tags
  const logoUrl =
    content.metaTags['og:image'] ||
    content.metaTags['twitter:image'] ||
    null;

  // Extract prices from body text
  const prices = extractPrices(content.bodyText);

  // Get the cheapest price as default
  let cost: number | null = null;
  let currency: CurrencyCode | null = null;

  if (prices.length > 0) {
    // Sort by amount and take the cheapest
    prices.sort((a, b) => a.amount - b.amount);
    // Filter out suspiciously low prices (likely not subscription prices)
    const validPrices = prices.filter((p) => p.amount >= 0.99);

    if (validPrices.length > 0) {
      cost = validPrices[0].amount;
      currency = validPrices[0].currency;
    }
  }

  // Detect billing cycle
  const billingCycle = detectBillingCycle(content.bodyText);

  // Find cancel and manage URLs
  const cancelUrl = findCancelUrl(content.links);
  const manageUrl = findManageUrl(content.links);

  return {
    name,
    cost,
    currency,
    billingCycle,
    logoUrl,
    cancelUrl,
    manageUrl,
  };
}

/**
 * Check if a URL looks like a pricing page
 */
export function isPricingPage(url: string): boolean {
  const pricingKeywords = [
    'pricing',
    'plans',
    'subscribe',
    'subscription',
    'buy',
    'purchase',
    'checkout',
    'signup',
  ];

  const lowerUrl = url.toLowerCase();
  return pricingKeywords.some((keyword) => lowerUrl.includes(keyword));
}

/**
 * Try to find the pricing page URL from a base URL
 */
export function getPricingPageUrls(baseUrl: string): string[] {
  try {
    const urlObj = new URL(baseUrl);
    const origin = urlObj.origin;

    return [
      baseUrl, // Original URL first
      `${origin}/pricing`,
      `${origin}/plans`,
      `${origin}/subscribe`,
      `${origin}/subscription`,
      `${origin}/pro`,
      `${origin}/premium`,
    ];
  } catch {
    return [baseUrl];
  }
}

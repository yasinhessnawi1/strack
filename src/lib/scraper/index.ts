import * as cheerio from 'cheerio';
import { ParsedSubscriptionData } from '@/models/subscription';

// Known subscription services with their typical pricing patterns
const KNOWN_SERVICES: Record<string, Partial<ParsedSubscriptionData>> = {
  'netflix.com': {
    name: 'Netflix',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'spotify.com': {
    name: 'Spotify',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'disneyplus.com': {
    name: 'Disney+',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'hbomax.com': {
    name: 'HBO Max',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'hulu.com': {
    name: 'Hulu',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'amazon.com': {
    name: 'Amazon Prime',
    billingCycle: 'yearly',
    currency: 'USD',
  },
  'primevideo.com': {
    name: 'Amazon Prime Video',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'apple.com': {
    name: 'Apple Subscription',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'github.com': {
    name: 'GitHub',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'notion.so': {
    name: 'Notion',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'figma.com': {
    name: 'Figma',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'slack.com': {
    name: 'Slack',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'dropbox.com': {
    name: 'Dropbox',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'adobe.com': {
    name: 'Adobe Creative Cloud',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'microsoft.com': {
    name: 'Microsoft 365',
    billingCycle: 'monthly',
    currency: 'USD',
  },
  'zoom.us': {
    name: 'Zoom',
    billingCycle: 'monthly',
    currency: 'USD',
  },
};

/**
 * Normalizes a URL and extracts the domain
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Parses price from text, handling various formats
 */
export function parsePrice(text: string): { amount: number; currency: string } | null {
  // Match various price formats: $9.99, 9.99 USD, €9,99, etc.
  const pricePatterns = [
    /\$\s*(\d+(?:[.,]\d{1,2})?)/,
    /€\s*(\d+(?:[.,]\d{1,2})?)/,
    /£\s*(\d+(?:[.,]\d{1,2})?)/,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:USD|EUR|GBP|SEK|NOK|DKK)/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:kr|:-)/i,
  ];

  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'));
      let currency = 'USD';
      
      if (text.includes('€') || /EUR/i.test(text)) currency = 'EUR';
      else if (text.includes('£') || /GBP/i.test(text)) currency = 'GBP';
      else if (/SEK/i.test(text) || (text.includes('kr') && /\bse\b/i.test(text))) currency = 'SEK';
      else if (/NOK/i.test(text)) currency = 'NOK';
      else if (/DKK/i.test(text)) currency = 'DKK';
      
      return { amount, currency };
    }
  }
  
  return null;
}

/**
 * Detects billing cycle from text
 */
export function detectBillingCycle(text: string): 'monthly' | 'yearly' | 'weekly' | 'quarterly' | null {
  const lowerText = text.toLowerCase();
  
  if (/per\s*week|weekly|\/\s*week/i.test(lowerText)) return 'weekly';
  if (/per\s*month|monthly|\/\s*mo(?:nth)?/i.test(lowerText)) return 'monthly';
  if (/per\s*quarter|quarterly|every\s*3\s*months?/i.test(lowerText)) return 'quarterly';
  if (/per\s*year|yearly|annually|\/\s*yr|\/\s*year/i.test(lowerText)) return 'yearly';
  
  return null;
}

/**
 * Attempts to fetch and parse subscription info from a URL
 */
export async function parseSubscriptionUrl(url: string): Promise<ParsedSubscriptionData> {
  const domain = extractDomain(url);
  const result: ParsedSubscriptionData = {
    requiresManualInput: [],
  };

  // Check if it's a known service
  for (const [knownDomain, data] of Object.entries(KNOWN_SERVICES)) {
    if (domain.includes(knownDomain)) {
      Object.assign(result, data);
      break;
    }
  }

  try {
    // Attempt to fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      // Try to extract name from meta tags or title
      if (!result.name) {
        result.name = $('meta[property="og:site_name"]').attr('content') ||
                      $('meta[property="og:title"]').attr('content') ||
                      $('title').text().split('|')[0].split('-')[0].trim() ||
                      undefined;
      }

      // Try to extract logo
      if (!result.logoUrl) {
        result.logoUrl = $('meta[property="og:image"]').attr('content') ||
                        $('link[rel="icon"]').attr('href') ||
                        $('link[rel="shortcut icon"]').attr('href') ||
                        undefined;
        
        // Make logo URL absolute if it's relative
        if (result.logoUrl && !result.logoUrl.startsWith('http')) {
          try {
            result.logoUrl = new URL(result.logoUrl, url).href;
          } catch {
            result.logoUrl = undefined;
          }
        }
      }

      // Look for pricing information in the page
      const pageText = $('body').text();
      
      // Try to find price
      if (!result.cost) {
        const priceInfo = parsePrice(pageText);
        if (priceInfo) {
          result.cost = priceInfo.amount;
          if (!result.currency) {
            result.currency = priceInfo.currency;
          }
        }
      }

      // Try to detect billing cycle
      if (!result.billingCycle) {
        result.billingCycle = detectBillingCycle(pageText) || undefined;
      }

      // Look for cancel/manage URLs
      const links = $('a');
      links.each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().toLowerCase();
        
        if (href) {
          if (text.includes('cancel') || text.includes('unsubscribe')) {
            try {
              result.cancelUrl = new URL(href, url).href;
            } catch {
              // Invalid URL, skip
            }
          }
          if (text.includes('manage') || text.includes('account') || text.includes('subscription')) {
            try {
              result.manageUrl = new URL(href, url).href;
            } catch {
              // Invalid URL, skip
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error parsing subscription URL:', error);
    // Continue with partial data
  }

  // Determine what requires manual input
  if (!result.name) result.requiresManualInput.push('name');
  if (!result.cost) result.requiresManualInput.push('cost');
  if (!result.currency) result.requiresManualInput.push('currency');
  if (!result.billingCycle) result.requiresManualInput.push('billingCycle');

  return result;
}

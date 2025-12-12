/**
 * Currency conversion service using frankfurter.app API
 * - Free, no API key required
 * - European Central Bank rates
 * - Updated daily on working days
 */

// In-memory cache for exchange rates
interface CacheEntry {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

const ratesCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Fallback rates (approximate, updated periodically as backup)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  NZD: 1.65,
  SEK: 10.45,
  NOK: 10.80,
  DKK: 6.88,
  PLN: 4.02,
  CZK: 23.20,
  HUF: 362.50,
  RON: 4.58,
  BGN: 1.80,
  HRK: 6.95,
  ISK: 137.50,
  CNY: 7.24,
  INR: 83.30,
  KRW: 1320.00,
  SGD: 1.34,
  HKD: 7.82,
  TWD: 31.50,
  THB: 35.20,
  MYR: 4.72,
  IDR: 15750.00,
  PHP: 56.20,
  VND: 24500.00,
  PKR: 278.50,
  BDT: 110.00,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.38,
  ILS: 3.68,
  TRY: 32.50,
  ZAR: 18.80,
  EGP: 48.50,
  NGN: 1550.00,
  KES: 153.00,
  MAD: 10.05,
  BRL: 4.95,
  MXN: 17.15,
  ARS: 870.00,
  CLP: 925.00,
  COP: 3950.00,
  PEN: 3.72,
  UYU: 39.50,
  RUB: 92.50,
  UAH: 41.20,
};

/**
 * Fetch exchange rates from frankfurter.app API
 * Rates are relative to the base currency (1 base = X target)
 */
export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
  const cacheKey = baseCurrency.toUpperCase();
  const cached = ratesCache.get(cacheKey);

  // Return cached rates if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.rates;
  }

  try {
    // frankfurter.app is free and doesn't require an API key
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${baseCurrency}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Add the base currency with rate 1
    const rates: Record<string, number> = {
      [baseCurrency]: 1,
      ...data.rates,
    };

    // Update cache
    ratesCache.set(cacheKey, {
      rates,
      base: baseCurrency,
      timestamp: Date.now(),
    });

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);

    // Try to return cached rates even if expired
    if (cached) {
      console.log('Using expired cached rates as fallback');
      return cached.rates;
    }

    // Return fallback rates converted to the requested base
    console.log('Using fallback rates');
    return convertFallbackRates(baseCurrency);
  }
}

/**
 * Convert fallback rates to a different base currency
 */
function convertFallbackRates(baseCurrency: string): Record<string, number> {
  const baseRate = FALLBACK_RATES[baseCurrency] || 1;
  const converted: Record<string, number> = {};

  for (const [currency, rate] of Object.entries(FALLBACK_RATES)) {
    converted[currency] = rate / baseRate;
  }

  return converted;
}

/**
 * Convert an amount from one currency to another
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rates - Exchange rates object (rates relative to base currency)
 * @param baseCurrency - The base currency the rates are relative to
 */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  baseCurrency: string = 'USD'
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // If rates are based on the fromCurrency, we can convert directly
  if (baseCurrency === fromCurrency) {
    const rate = rates[toCurrency];
    if (rate) {
      return amount * rate;
    }
  }

  // If rates are based on the toCurrency, we divide
  if (baseCurrency === toCurrency) {
    const rate = rates[fromCurrency];
    if (rate) {
      return amount / rate;
    }
  }

  // General case: convert through the base currency
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // Convert: amount in fromCurrency -> base currency -> toCurrency
  // If rates are "1 base = X currency", then:
  // amount / fromRate = amount in base
  // (amount / fromRate) * toRate = amount in toCurrency
  return (amount / fromRate) * toRate;
}

/**
 * Get cached rates without fetching (for client-side use)
 */
export function getCachedRates(baseCurrency: string = 'USD'): Record<string, number> | null {
  const cached = ratesCache.get(baseCurrency.toUpperCase());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.rates;
  }
  return null;
}

/**
 * Check if rates are currently cached and valid
 */
export function hasValidCache(baseCurrency: string = 'USD'): boolean {
  const cached = ratesCache.get(baseCurrency.toUpperCase());
  return cached !== undefined && Date.now() - cached.timestamp < CACHE_TTL;
}

/**
 * Clear the rates cache (useful for testing)
 */
export function clearRatesCache(): void {
  ratesCache.clear();
}

/**
 * Get the timestamp of when rates were last fetched
 */
export function getRatesCacheAge(baseCurrency: string = 'USD'): number | null {
  const cached = ratesCache.get(baseCurrency.toUpperCase());
  return cached ? Date.now() - cached.timestamp : null;
}

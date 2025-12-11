/**
 * Subscription Extraction Pipeline
 *
 * This module orchestrates the extraction of subscription data using a multi-stage pipeline:
 * 1. Input Resolution - Parse user input (URL, service name, or custom subscription)
 * 2. Known Service Lookup - Check against database of known services
 * 3. AI Extraction (Primary) - Use Gemini API to extract structured data
 * 4. Web Scraping (Fallback) - Scrape the website for pricing info
 * 5. Manual Entry (Final Fallback) - Return partial data with manual input flags
 */

import {
  ExtractionResult,
  ExtractionAttempt,
  ExtractionConfig,
  DEFAULT_CONFIG,
  BillingCycle,
  CurrencyCode,
} from './types';
import { resolveInput, getBestUrlForScraping, getKnownServiceData, ExtendedResolvedInput } from './input-resolver';
import { extractWithAI, isAIAvailable } from './ai-extractor';
import { scrapeUrl, extractFromScrapedContent, getPricingPageUrls } from './scraper';
import { KNOWN_SERVICES } from './known-services';
import { getRequiredManualFields, validateUserInput } from './validators';
import { SubscriptionCategory } from '@/models/subscription';

export { resolveInput, type ExtendedResolvedInput } from './input-resolver';
export { isAIAvailable } from './ai-extractor';
export * from './types';

/**
 * Main extraction function - orchestrates the entire pipeline
 */
export async function extractSubscription(
  userInput: string,
  config: Partial<ExtractionConfig> = {}
): Promise<ExtractionResult> {
  const mergedConfig: ExtractionConfig = { ...DEFAULT_CONFIG, ...config };
  const attempts: ExtractionAttempt[] = [];

  // Validate input
  const validation = validateUserInput(userInput);
  if (!validation.isValid) {
    return createManualFallbackResult(
      userInput,
      null,
      attempts,
      `Invalid input: ${validation.errors.join(', ')}`
    );
  }

  // Step 1: Resolve input
  const resolved = resolveInput(validation.sanitizedValue);
  console.log(`[Pipeline] Input type: ${resolved.inputType}, Custom: ${resolved.isCustomSubscription}, Known: ${resolved.knownServiceKey || 'none'}`);

  // Step 2: Check for custom subscription (direct from input)
  if (resolved.isCustomSubscription) {
    console.log('[Pipeline] Path: Custom subscription - using direct extraction');
    return handleCustomSubscription(resolved, attempts);
  }

  // Step 3: Check known services database
  const knownService = getKnownServiceData(resolved);
  if (knownService) {
    console.log(`[Pipeline] Path: Known service found - ${knownService.name}`);
    const knownResult = createResultFromKnownService(resolved, knownService);

    // If we have complete data from known service, return it
    if (knownResult.requiresManualInput.length === 0) {
      console.log('[Pipeline] Known service has complete data - skipping AI');
      return knownResult;
    }

    // Otherwise, try to enhance with AI
    console.log('[Pipeline] Known service needs enhancement - trying AI');
    if (mergedConfig.aiEnabled && isAIAvailable()) {
      const scrapedContent = resolved.url
        ? await tryScrapeBestUrl(resolved.url, mergedConfig.scraperTimeoutMs, attempts)
        : null;

      const { result: aiResult, attempt: aiAttempt } = await extractWithAI(
        resolved,
        scrapedContent || undefined,
        mergedConfig.aiTimeoutMs
      );

      attempts.push(aiAttempt);

      if (aiResult && aiResult.confidence >= mergedConfig.aiConfidenceThreshold) {
        return mergeWithAIResult(resolved, knownResult, aiResult, attempts);
      }
    }

    // Return known service result (partial or complete)
    return knownResult;
  }

  // Step 4: Try AI extraction (primary method for unknown services)
  if (mergedConfig.aiEnabled && isAIAvailable() && resolved.url) {
    // First scrape the page to provide context to AI
    const scrapedContent = await tryScrapeBestUrl(
      resolved.url,
      mergedConfig.scraperTimeoutMs,
      attempts
    );

    const { result: aiResult, attempt: aiAttempt } = await extractWithAI(
      resolved,
      scrapedContent || undefined,
      mergedConfig.aiTimeoutMs
    );

    attempts.push(aiAttempt);

    if (aiResult && aiResult.confidence >= mergedConfig.aiConfidenceThreshold) {
      return createResultFromAI(resolved, aiResult, attempts, 'ai');
    }

    // If AI returned low confidence result, try scraper as fallback
    if (scrapedContent && mergedConfig.scraperEnabled) {
      const scraperData = extractFromScrapedContent(scrapedContent, resolved.url);
      const scraperResult = createResultFromScraper(resolved, scraperData, attempts);

      // Merge AI result with scraper result for better coverage
      if (aiResult) {
        return mergeResults(scraperResult, aiResult, attempts);
      }

      return scraperResult;
    }

    // Return AI result even with low confidence if it's all we have
    if (aiResult) {
      return createResultFromAI(resolved, aiResult, attempts, 'ai');
    }
  }

  // Step 5: Fallback to scraper only
  if (mergedConfig.scraperEnabled && resolved.url) {
    const scrapedContent = await tryScrapeBestUrl(
      resolved.url,
      mergedConfig.scraperTimeoutMs,
      attempts
    );

    if (scrapedContent) {
      const scraperData = extractFromScrapedContent(scrapedContent, resolved.url);
      return createResultFromScraper(resolved, scraperData, attempts);
    }
  }

  // Step 6: Manual fallback
  return createManualFallbackResult(userInput, resolved, attempts);
}

/**
 * Try to scrape the best URL (pricing page if available)
 */
async function tryScrapeBestUrl(
  baseUrl: string,
  timeoutMs: number,
  attempts: ExtractionAttempt[]
) {
  const urlsToTry = getPricingPageUrls(baseUrl);

  for (const url of urlsToTry.slice(0, 3)) {
    // Limit attempts
    const { content, attempt } = await scrapeUrl(url, timeoutMs);
    attempts.push(attempt);

    if (content) {
      return content;
    }
  }

  return null;
}

/**
 * Auto-detect category from custom subscription keywords
 */
function detectCustomCategory(input: string): SubscriptionCategory {
  const lowerInput = input.toLowerCase();

  // Health & Fitness
  if (/gym|fitness|training|workout|yoga|pilates|crossfit|sport|health|medical|doctor|therapy|wellness/i.test(lowerInput)) {
    return 'health';
  }

  // Education
  if (/lesson|tutor|class|course|school|learn|education|training|coaching|teacher/i.test(lowerInput)) {
    return 'education';
  }

  // Entertainment
  if (/game|gaming|hobby|fun|club|entertainment|music|movie|concert/i.test(lowerInput)) {
    return 'entertainment';
  }

  // Finance
  if (/insurance|bank|invest|saving|loan|mortgage|rent|fee|dues/i.test(lowerInput)) {
    return 'finance';
  }

  // Productivity
  if (/work|office|business|professional|tool|service/i.test(lowerInput)) {
    return 'productivity';
  }

  // News & Media
  if (/news|magazine|newspaper|journal|media/i.test(lowerInput)) {
    return 'news';
  }

  // Default
  return 'other';
}

/**
 * Handle custom subscription input (personal/non-commercial subscriptions)
 */
function handleCustomSubscription(
  resolved: ExtendedResolvedInput,
  attempts: ExtractionAttempt[]
): ExtractionResult {
  // Auto-detect category from the original input
  const category = detectCustomCategory(resolved.originalInput);

  const result: ExtractionResult = {
    success: true,
    source: 'manual',
    confidence: resolved.extractedPrice !== null ? 0.9 : 0.3,
    attempts,
    name: resolved.serviceName,
    description: resolved.customDescription, // Store original query as description
    cost: resolved.extractedPrice,
    currency: resolved.extractedCurrency || 'USD',
    billingCycle: resolved.billingHint || 'monthly',
    category,
    logoUrl: null,
    manageUrl: null,
    cancelUrl: null,
    requiresManualInput: [],
    resolvedInput: resolved,
  };

  // For custom subscriptions, only require manual input for truly missing critical fields
  // Name and cost are the minimum required
  if (!result.name || result.name.length < 2) {
    result.requiresManualInput.push('name');
  }
  if (result.cost === null || result.cost <= 0) {
    result.requiresManualInput.push('cost');
  }

  // Custom subscriptions are considered successful if we have name and price
  result.success = result.requiresManualInput.length === 0;

  console.log(`[Pipeline] Custom subscription: name="${result.name}", cost=${result.cost}, category=${category}, success=${result.success}`);

  return result;
}

/**
 * Create result from known service database
 */
function createResultFromKnownService(
  resolved: ExtendedResolvedInput,
  knownService: typeof KNOWN_SERVICES[string]
): ExtractionResult {
  // Find cheapest price
  let cheapestPrice = knownService.typicalPrices?.[0];
  if (knownService.typicalPrices && knownService.typicalPrices.length > 0) {
    // Normalize prices to monthly for comparison
    const normalized = knownService.typicalPrices.map((p) => ({
      ...p,
      monthlyEquivalent: normalizeToMonthly(p.cost, p.billingCycle),
    }));
    normalized.sort((a, b) => a.monthlyEquivalent - b.monthlyEquivalent);
    cheapestPrice = normalized[0];
  }

  // If user specified a billing hint, try to find matching price
  if (resolved.billingHint && knownService.typicalPrices) {
    const matchingPrice = knownService.typicalPrices.find(
      (p) => p.billingCycle === resolved.billingHint
    );
    if (matchingPrice) {
      cheapestPrice = matchingPrice;
    }
  }

  const result: ExtractionResult = {
    success: true,
    source: 'known_service',
    confidence: 0.95,
    attempts: [],
    name: knownService.name,
    description: `${knownService.name} subscription`,
    cost: cheapestPrice?.cost || null,
    currency: knownService.defaultCurrency,
    billingCycle: cheapestPrice?.billingCycle || knownService.defaultBillingCycle,
    category: knownService.category,
    logoUrl: knownService.logoUrl || null,
    manageUrl: knownService.manageUrl || null,
    cancelUrl: knownService.cancelUrl || null,
    requiresManualInput: [],
    resolvedInput: resolved,
  };

  result.requiresManualInput = getRequiredManualFields(result);
  result.success = result.requiresManualInput.length === 0;

  return result;
}

/**
 * Create result from AI extraction
 */
function createResultFromAI(
  resolved: ExtendedResolvedInput,
  aiResult: NonNullable<Awaited<ReturnType<typeof extractWithAI>>['result']>,
  attempts: ExtractionAttempt[],
  source: 'ai' | 'scraper' = 'ai'
): ExtractionResult {
  const result: ExtractionResult = {
    success: true,
    source,
    confidence: aiResult.confidence,
    attempts,
    name: aiResult.name || resolved.serviceName,
    description: aiResult.description,
    cost: aiResult.recommendedPlan?.cost || null,
    currency: aiResult.recommendedPlan?.currency || null,
    billingCycle: aiResult.recommendedPlan?.billingCycle || null,
    category: aiResult.category,
    logoUrl: aiResult.logoUrl,
    manageUrl: aiResult.manageUrl,
    cancelUrl: aiResult.cancelUrl,
    requiresManualInput: [],
    resolvedInput: resolved,
  };

  result.requiresManualInput = getRequiredManualFields(result);
  result.success = result.requiresManualInput.length <= 1; // Allow one missing field

  return result;
}

/**
 * Create result from scraper extraction
 */
function createResultFromScraper(
  resolved: ExtendedResolvedInput,
  scraperData: ReturnType<typeof extractFromScrapedContent>,
  attempts: ExtractionAttempt[]
): ExtractionResult {
  const result: ExtractionResult = {
    success: false,
    source: 'scraper',
    confidence: 0.5,
    attempts,
    name: scraperData.name || resolved.serviceName,
    description: null,
    cost: scraperData.cost,
    currency: scraperData.currency,
    billingCycle: scraperData.billingCycle,
    category: null,
    logoUrl: scraperData.logoUrl,
    manageUrl: scraperData.manageUrl,
    cancelUrl: scraperData.cancelUrl,
    requiresManualInput: [],
    resolvedInput: resolved,
  };

  result.requiresManualInput = getRequiredManualFields(result);
  result.success = result.requiresManualInput.length <= 2;

  return result;
}

/**
 * Merge AI result with known service data
 */
function mergeWithAIResult(
  resolved: ExtendedResolvedInput,
  knownResult: ExtractionResult,
  aiResult: NonNullable<Awaited<ReturnType<typeof extractWithAI>>['result']>,
  attempts: ExtractionAttempt[]
): ExtractionResult {
  return {
    ...knownResult,
    attempts,
    // Prefer AI data for dynamic fields, known service for static
    cost: aiResult.recommendedPlan?.cost || knownResult.cost,
    currency: aiResult.recommendedPlan?.currency || knownResult.currency,
    billingCycle: aiResult.recommendedPlan?.billingCycle || knownResult.billingCycle,
    description: aiResult.description || knownResult.description,
    // Keep known service data for stable fields
    name: knownResult.name,
    category: knownResult.category,
    logoUrl: knownResult.logoUrl || aiResult.logoUrl,
    manageUrl: knownResult.manageUrl || aiResult.manageUrl,
    cancelUrl: knownResult.cancelUrl || aiResult.cancelUrl,
    confidence: Math.max(knownResult.confidence, aiResult.confidence),
    source: 'ai',
    requiresManualInput: getRequiredManualFields({
      ...knownResult,
      cost: aiResult.recommendedPlan?.cost || knownResult.cost,
    }),
  };
}

/**
 * Merge scraper result with AI result
 */
function mergeResults(
  scraperResult: ExtractionResult,
  aiResult: NonNullable<Awaited<ReturnType<typeof extractWithAI>>['result']>,
  attempts: ExtractionAttempt[]
): ExtractionResult {
  const merged: ExtractionResult = {
    ...scraperResult,
    attempts,
    source: 'ai',
    confidence: Math.max(scraperResult.confidence, aiResult.confidence * 0.8),
    name: aiResult.name || scraperResult.name,
    description: aiResult.description || scraperResult.description,
    cost: aiResult.recommendedPlan?.cost || scraperResult.cost,
    currency: aiResult.recommendedPlan?.currency || scraperResult.currency,
    billingCycle: aiResult.recommendedPlan?.billingCycle || scraperResult.billingCycle,
    category: aiResult.category || scraperResult.category,
    logoUrl: scraperResult.logoUrl || aiResult.logoUrl,
    manageUrl: scraperResult.manageUrl || aiResult.manageUrl,
    cancelUrl: scraperResult.cancelUrl || aiResult.cancelUrl,
  };

  merged.requiresManualInput = getRequiredManualFields(merged);
  merged.success = merged.requiresManualInput.length <= 1;

  return merged;
}

/**
 * Create manual fallback result when all extraction methods fail
 */
function createManualFallbackResult(
  originalInput: string,
  resolved: ExtendedResolvedInput | null,
  attempts: ExtractionAttempt[],
  error?: string
): ExtractionResult {
  const resolvedInput = resolved || {
    originalInput,
    inputType: 'service_name' as const,
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

  return {
    success: false,
    source: 'manual',
    confidence: 0,
    attempts,
    name: resolved?.serviceName || null,
    description: error || null,
    cost: null,
    currency: null,
    billingCycle: null,
    category: null,
    logoUrl: null,
    manageUrl: null,
    cancelUrl: null,
    requiresManualInput: ['name', 'cost', 'currency', 'billingCycle'],
    resolvedInput,
  };
}

/**
 * Normalize price to monthly equivalent for comparison
 */
function normalizeToMonthly(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return cost * 4.33;
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'yearly':
      return cost / 12;
    default:
      return cost;
  }
}

/**
 * Convert extraction result to ParsedSubscriptionData format
 * (for backward compatibility with existing API)
 */
export function toParserSubscriptionData(result: ExtractionResult) {
  // For custom subscriptions, use description as notes
  // Cast to ExtendedResolvedInput to access custom subscription properties
  const resolvedInput = result.resolvedInput as ExtendedResolvedInput | undefined;
  const isCustom = resolvedInput?.isCustomSubscription;

  return {
    name: result.name || undefined,
    cost: result.cost || undefined,
    currency: result.currency || undefined,
    billingCycle: result.billingCycle || undefined,
    logoUrl: result.logoUrl || undefined,
    cancelUrl: result.cancelUrl || undefined,
    manageUrl: result.manageUrl || undefined,
    category: result.category || undefined,
    // For custom subscriptions, put the original query in notes
    notes: isCustom && result.description ? result.description : undefined,
    requiresManualInput: result.requiresManualInput,
    // Additional fields for enhanced feedback
    source: result.source,
    confidence: result.confidence,
    description: result.description || undefined,
    isCustomSubscription: isCustom,
  };
}

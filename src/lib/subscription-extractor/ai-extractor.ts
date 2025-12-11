import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  GeminiExtractionResponse,
  ExtractionAttempt,
  DEFAULT_CONFIG,
  BillingCycle,
  CurrencyCode,
} from './types';
import { ExtendedResolvedInput } from './input-resolver';
import { validateGeminiResponse, validatePrice, validateCurrency, validateBillingCycle } from './validators';
import { ScrapedContent } from './types';

/**
 * Singleton for Gemini AI client
 */
let geminiClient: GoogleGenerativeAI | null = null;
let geminiModel: GenerativeModel | null = null;

/**
 * Initialize the Gemini AI client
 */
function getGeminiModel(): GenerativeModel | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI Extractor] GEMINI_API_KEY not configured - AI extraction disabled');
    return null;
  }

  if (!geminiClient) {
    console.log('[AI Extractor] Initializing Gemini client...');
    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  if (!geminiModel) {
    // Try models in order of preference - some may have better free-tier availability
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    console.log(`[AI Extractor] Using model: ${modelName}`);
    geminiModel = geminiClient.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.1, // Low temperature for more consistent JSON output
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });
  }

  return geminiModel;
}

/**
 * Build the extraction prompt for Gemini
 */
function buildExtractionPrompt(
  resolvedInput: ExtendedResolvedInput,
  scrapedContent?: ScrapedContent
): string {
  const contextParts: string[] = [];

  // Add user input context
  contextParts.push(`User Input: "${resolvedInput.originalInput}"`);

  if (resolvedInput.serviceName) {
    contextParts.push(`Service Name (detected): ${resolvedInput.serviceName}`);
  }

  if (resolvedInput.url) {
    contextParts.push(`URL: ${resolvedInput.url}`);
  }

  if (resolvedInput.planHint) {
    contextParts.push(`Plan Hint: ${resolvedInput.planHint}`);
  }

  if (resolvedInput.billingHint) {
    contextParts.push(`Billing Cycle Hint: ${resolvedInput.billingHint}`);
  }

  if (resolvedInput.isCustomSubscription) {
    contextParts.push(`This appears to be a CUSTOM/PERSONAL subscription (not a commercial service).`);
    if (resolvedInput.extractedPrice !== null) {
      contextParts.push(`Pre-extracted Price: ${resolvedInput.extractedPrice}`);
    }
    if (resolvedInput.extractedCurrency) {
      contextParts.push(`Pre-extracted Currency: ${resolvedInput.extractedCurrency}`);
    }
  }

  // Add scraped content if available
  if (scrapedContent) {
    if (scrapedContent.title) {
      contextParts.push(`Page Title: ${scrapedContent.title}`);
    }
    if (scrapedContent.description) {
      contextParts.push(`Page Description: ${scrapedContent.description}`);
    }
    if (scrapedContent.bodyText) {
      // Limit body text to prevent token overflow
      const truncatedBody = scrapedContent.bodyText.slice(0, 5000);
      contextParts.push(`Page Content (truncated): ${truncatedBody}`);
    }
    if (scrapedContent.jsonLd && scrapedContent.jsonLd.length > 0) {
      contextParts.push(`Structured Data (JSON-LD): ${JSON.stringify(scrapedContent.jsonLd).slice(0, 2000)}`);
    }
  }

  const context = contextParts.join('\n');

  // Build the full prompt
  return `You are a subscription data extraction assistant. Your task is to extract subscription/service information from the provided context and return ONLY a valid JSON object.

${context}

Based on the above information, extract subscription details and return ONLY this exact JSON structure (no markdown, no explanations, just the JSON):

{
  "name": "Service Name or Custom Subscription Name",
  "description": "Brief description of the service/subscription (1-2 sentences)",
  "pricing": [
    {"plan": "plan name", "cost": 0.00, "currency": "USD", "billingCycle": "monthly"}
  ],
  "recommendedPlan": {
    "cost": 0.00,
    "currency": "USD",
    "billingCycle": "monthly",
    "reason": "Why this plan is recommended"
  },
  "category": "streaming|software|cloud|productivity|entertainment|education|finance|health|news|other",
  "manageUrl": "https://... or null",
  "cancelUrl": "https://... or null",
  "logoUrl": "https://... or null",
  "confidence": 0.0
}

CRITICAL RULES:
1. ALWAYS recommend the CHEAPEST available plan as the default in recommendedPlan
2. Use standard ISO currency codes: USD, EUR, GBP, SEK, NOK, DKK
3. Valid billing cycles: weekly, monthly, quarterly, yearly
4. Set confidence between 0.0 and 1.0 based on how certain you are
5. If a field cannot be determined, set it to null
6. For custom/personal subscriptions, use the pre-extracted price and currency if provided
7. For custom subscriptions, set manageUrl and cancelUrl to null
8. Category must be one of: streaming, software, cloud, productivity, entertainment, education, finance, health, news, other
9. Return ONLY the JSON object - no markdown code blocks, no explanations

IMPORTANT: Output must be parseable JSON. Do not include any text before or after the JSON object.`;
}

/**
 * Parse the AI response to extract JSON
 */
function parseAIResponse(response: string): GeminiExtractionResponse | null {
  if (!response) {
    return null;
  }

  // Clean the response - remove markdown code blocks if present
  let cleaned = response.trim();

  // Remove markdown JSON blocks
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');

  // Try to find JSON object in the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleaned);
    return validateGeminiResponse(parsed);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', error);
    console.error('Response was:', cleaned.slice(0, 500));
    return null;
  }
}

/**
 * Check if an error is a rate limit error (shouldn't retry immediately)
 */
function isRateLimitError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return message.includes('429') ||
         message.includes('rate limit') ||
         message.includes('resource exhausted') ||
         message.includes('quota');
}

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = DEFAULT_CONFIG.maxRetries,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on rate limit errors - they won't help
      if (isRateLimitError(lastError)) {
        console.warn('[AI Extractor] Rate limit hit - skipping retries');
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`AI extraction attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Extract subscription info using Gemini AI
 */
export async function extractWithAI(
  resolvedInput: ExtendedResolvedInput,
  scrapedContent?: ScrapedContent,
  timeoutMs: number = DEFAULT_CONFIG.aiTimeoutMs
): Promise<{
  result: GeminiExtractionResponse | null;
  attempt: ExtractionAttempt;
}> {
  const startTime = Date.now();

  const attempt: ExtractionAttempt = {
    method: 'ai',
    success: false,
    durationMs: 0,
  };

  const model = getGeminiModel();

  if (!model) {
    attempt.error = 'Gemini AI not configured';
    attempt.durationMs = Date.now() - startTime;
    return { result: null, attempt };
  }

  console.log(`[AI Extractor] Starting extraction for: ${resolvedInput.serviceName || resolvedInput.url || 'unknown'}`);

  try {
    const prompt = buildExtractionPrompt(resolvedInput, scrapedContent);
    console.log('[AI Extractor] Calling Gemini API...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });

    clearTimeout(timeoutId);
    console.log(`[AI Extractor] Received response (${response.length} chars)`);

    // Parse the response
    const parsed = parseAIResponse(response);

    if (parsed) {
      console.log(`[AI Extractor] Successfully parsed response. Confidence: ${parsed.confidence}`);
      // Apply any pre-extracted data for custom subscriptions
      if (resolvedInput.isCustomSubscription) {
        if (resolvedInput.extractedPrice !== null && (!parsed.recommendedPlan || !parsed.recommendedPlan.cost)) {
          parsed.recommendedPlan = {
            cost: resolvedInput.extractedPrice,
            currency: resolvedInput.extractedCurrency || 'USD',
            billingCycle: resolvedInput.billingHint || 'monthly',
            reason: 'Extracted from user input',
          };
        }
        if (!parsed.pricing || parsed.pricing.length === 0) {
          if (resolvedInput.extractedPrice !== null) {
            parsed.pricing = [{
              plan: 'Standard',
              cost: resolvedInput.extractedPrice,
              currency: resolvedInput.extractedCurrency || 'USD',
              billingCycle: resolvedInput.billingHint || 'monthly',
            }];
          }
        }
      }

      attempt.success = true;
      attempt.durationMs = Date.now() - startTime;
      return { result: parsed, attempt };
    }

    attempt.error = 'Failed to parse AI response';
    attempt.durationMs = Date.now() - startTime;
    return { result: null, attempt };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    attempt.error = errorMessage;
    attempt.durationMs = Date.now() - startTime;
    console.error('AI extraction failed:', errorMessage);
    return { result: null, attempt };
  }
}

/**
 * Quick extraction using known service data + AI enhancement
 * Used when we have a known service but want AI to fill in gaps
 */
export async function enhanceWithAI(
  resolvedInput: ExtendedResolvedInput,
  partialData: Partial<GeminiExtractionResponse>
): Promise<GeminiExtractionResponse | null> {
  const model = getGeminiModel();

  if (!model) {
    return null;
  }

  const prompt = `Given this subscription service information, fill in any missing details:

Service: ${resolvedInput.serviceName || 'Unknown'}
URL: ${resolvedInput.url || 'N/A'}
Current Data: ${JSON.stringify(partialData)}

Return ONLY a valid JSON object with the complete subscription data in this format:
{
  "name": "string",
  "description": "string",
  "pricing": [{"plan": "string", "cost": number, "currency": "string", "billingCycle": "string"}],
  "recommendedPlan": {"cost": number, "currency": "string", "billingCycle": "string", "reason": "string"},
  "category": "string",
  "manageUrl": "string or null",
  "cancelUrl": "string or null",
  "logoUrl": "string or null",
  "confidence": number
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseAIResponse(response);
  } catch (error) {
    console.error('AI enhancement failed:', error);
    return null;
  }
}

/**
 * Check if AI extraction is available
 */
export function isAIAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

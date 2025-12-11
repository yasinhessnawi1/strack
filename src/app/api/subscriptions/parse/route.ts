import { NextRequest, NextResponse } from 'next/server';
import { extractSubscription, toParserSubscriptionData, isAIAvailable } from '@/lib/subscription-extractor';

/**
 * POST /api/subscriptions/parse
 *
 * Extracts subscription information from a URL or service name.
 * Uses a multi-stage pipeline:
 * 1. AI extraction (Gemini) - Primary method
 * 2. Web scraping - Fallback
 * 3. Manual entry - Final fallback
 *
 * Accepts:
 * - Full URLs: https://netflix.com
 * - Partial URLs: spotify.com
 * - Service names: "spotify", "netflix monthly"
 * - Custom subscriptions: "private training $10 a month"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, input } = body;

    // Accept either 'url' or 'input' parameter for flexibility
    const userInput = input || url;

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'Input is required (URL or service name)' },
        { status: 400 }
      );
    }

    // Trim and validate input length
    const trimmedInput = userInput.trim();
    if (trimmedInput.length === 0) {
      return NextResponse.json(
        { error: 'Input cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedInput.length > 2000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    // Run the extraction pipeline
    const result = await extractSubscription(trimmedInput);

    // Convert to backward-compatible format
    const parsedData = toParserSubscriptionData(result);

    // Build response message based on extraction result
    let message: string;
    if (result.success && result.requiresManualInput.length === 0) {
      message = `Successfully extracted subscription info (via ${result.source})`;
    } else if (result.requiresManualInput.length > 0) {
      message = `Please provide: ${result.requiresManualInput.join(', ')}`;
    } else {
      message = 'Partial data extracted - please review and complete';
    }

    return NextResponse.json({
      data: parsedData,
      message,
      meta: {
        source: result.source,
        confidence: result.confidence,
        aiAvailable: isAIAvailable(),
        attemptsCount: result.attempts.length,
      },
    });
  } catch (error) {
    console.error('Error in subscription extraction:', error);

    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: 'Failed to extract subscription information',
        data: {
          requiresManualInput: ['name', 'cost', 'currency', 'billingCycle'],
        },
      },
      { status: 500 }
    );
  }
}

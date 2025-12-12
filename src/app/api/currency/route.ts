import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getExchangeRates } from '@/lib/currency';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const baseCurrency = searchParams.get('base') || 'USD';

    const rates = await getExchangeRates(baseCurrency.toUpperCase());

    return NextResponse.json({
      base: baseCurrency.toUpperCase(),
      rates,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

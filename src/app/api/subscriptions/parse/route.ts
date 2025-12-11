import { NextRequest, NextResponse } from 'next/server';
import { parseSubscriptionUrl } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const parsedData = await parseSubscriptionUrl(url);
    
    return NextResponse.json({ 
      data: parsedData,
      message: parsedData.requiresManualInput.length > 0 
        ? `Please provide: ${parsedData.requiresManualInput.join(', ')}`
        : 'Successfully parsed subscription info'
    });
  } catch (error) {
    console.error('Error parsing subscription URL:', error);
    return NextResponse.json(
      { error: 'Failed to parse subscription URL' },
      { status: 500 }
    );
  }
}

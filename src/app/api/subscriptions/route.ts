import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getUserSubscriptions,
  createSubscription,
  getSubscriptionStats,
} from '@/services/subscription.service';
import { SubscriptionFormData } from '@/models/subscription';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const displayCurrency = searchParams.get('displayCurrency') || 'USD';

    if (includeStats) {
      const stats = await getSubscriptionStats(userId, displayCurrency.toUpperCase());
      const subscriptions = await getUserSubscriptions(userId);

      // Check Plan Status
      const { has } = await auth();
      const isPro = has({ plan: 'unlimited' }) || has({ plan: 'pro' });

      return NextResponse.json({
        subscriptions,
        stats,
        exchangeRates: stats.exchangeRates,
        displayCurrency: stats.displayCurrency,
        isPro
      });
    }

    const subscriptions = await getUserSubscriptions(userId);
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as Partial<SubscriptionFormData>;

    // LIMIT CHECK: Enforce 5 subscriptions for Free Plan
    // We check if the user has the 'unlimited' plan
    // Note: User must create a Plan in Clerk Dashboard with slug 'unlimited' (or similar)
    const { has } = await auth();
    const isPro = has({ plan: 'unlimited' }) || has({ plan: 'pro' }); // Support common names
    
    if (!isPro) {
      const currentSubs = await getUserSubscriptions(userId);
      if (currentSubs.length >= 5) {
         return NextResponse.json(
           { error: 'Free plan limit reached (5 subscriptions). Upgrade for unlimited access.' },
           { status: 403 }
         );
      }
    }
    
    // Validate request strictly for Name
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Apply defaults and validation for other fields
    const formData: SubscriptionFormData = {
      name: body.name,
      url: body.url || '',
      cost: typeof body.cost === 'number' ? Math.max(0, body.cost) : 0,
      currency: body.currency || 'USD',
      billingCycle: ['weekly', 'monthly', 'quarterly', 'yearly'].includes(body.billingCycle as string) 
        ? body.billingCycle as SubscriptionFormData['billingCycle']
        : 'monthly',
      startDate: body.startDate || new Date().toISOString(),
      category: body.category,
      notes: body.notes,
      cancelUrl: body.cancelUrl,
      manageUrl: body.manageUrl,
    };

    const subscription = await createSubscription(userId, formData);
    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

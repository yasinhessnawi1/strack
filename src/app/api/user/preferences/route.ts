import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAdminDb } from '@/lib/firebase';

const PREFERENCES_COLLECTION = 'userPreferences';

interface UserPreferences {
  userId: string;
  displayCurrency: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doc = await getAdminDb()
      .collection(PREFERENCES_COLLECTION)
      .doc(userId)
      .get();

    if (!doc.exists) {
      // Return default preferences for new users
      return NextResponse.json({
        preferences: {
          displayCurrency: 'USD',
        },
      });
    }

    const data = doc.data() as UserPreferences;

    return NextResponse.json({
      preferences: {
        displayCurrency: data.displayCurrency || 'USD',
      },
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { displayCurrency } = body;

    if (!displayCurrency || typeof displayCurrency !== 'string') {
      return NextResponse.json(
        { error: 'displayCurrency is required and must be a string' },
        { status: 400 }
      );
    }

    const preferences: UserPreferences = {
      userId,
      displayCurrency: displayCurrency.toUpperCase(),
      updatedAt: new Date().toISOString(),
    };

    await getAdminDb()
      .collection(PREFERENCES_COLLECTION)
      .doc(userId)
      .set(preferences, { merge: true });

    return NextResponse.json({
      preferences: {
        displayCurrency: preferences.displayCurrency,
      },
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

import { getAdminDb } from '@/lib/firebase';
import { Subscription, SubscriptionFormData } from '@/models/subscription';
import { addMonths, addWeeks, addYears, addQuarters } from 'date-fns';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

/**
 * Calculate the next payment date based on billing cycle and start date
 */
export function calculateNextPaymentDate(startDate: string, billingCycle: Subscription['billingCycle']): string {
  const start = new Date(startDate);
  const now = new Date();
  let nextDate = new Date(start);

  // Find the next payment date that's in the future
  while (nextDate <= now) {
    switch (billingCycle) {
      case 'weekly':
        nextDate = addWeeks(nextDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'quarterly':
        nextDate = addQuarters(nextDate, 1);
        break;
      case 'yearly':
        nextDate = addYears(nextDate, 1);
        break;
    }
  }

  return nextDate.toISOString();
}

/**
 * Get all subscriptions for a user
 */
export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  const snapshot = await getAdminDb()
    .collection(SUBSCRIPTIONS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  })) as Subscription[];
}

/**
 * Get a single subscription by ID
 */
export async function getSubscription(id: string, userId: string): Promise<Subscription | null> {
  const doc = await getAdminDb().collection(SUBSCRIPTIONS_COLLECTION).doc(id).get();
  
  if (!doc.exists) return null;
  
  const data = doc.data() as Subscription;
  
  // Verify the subscription belongs to the user
  if (data.userId !== userId) return null;
  
  return {
    ...data,
    id: doc.id,
  };
}

/**
 * Create a new subscription
 */
export async function createSubscription(userId: string, formData: SubscriptionFormData): Promise<Subscription> {
  const now = new Date().toISOString();
  const nextPaymentDate = calculateNextPaymentDate(formData.startDate, formData.billingCycle);

  const subscriptionData: Omit<Subscription, 'id'> = {
    userId,
    name: formData.name,
    url: formData.url,
    cost: formData.cost,
    currency: formData.currency,
    billingCycle: formData.billingCycle,
    startDate: formData.startDate,
    nextPaymentDate,
    cancelUrl: formData.cancelUrl,
    manageUrl: formData.manageUrl,
    category: formData.category,
    notes: formData.notes,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await getAdminDb().collection(SUBSCRIPTIONS_COLLECTION).add(subscriptionData);

  return {
    id: docRef.id,
    ...subscriptionData,
  };
}

/**
 * Update an existing subscription
 */
export async function updateSubscription(
  id: string,
  userId: string,
  formData: Partial<SubscriptionFormData>
): Promise<Subscription | null> {
  const docRef = getAdminDb().collection(SUBSCRIPTIONS_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  const existingData = doc.data() as Subscription;

  // Verify ownership
  if (existingData.userId !== userId) return null;

  const updateData: Partial<Subscription> = {
    ...formData,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate next payment date if billing cycle or start date changed
  if (formData.startDate || formData.billingCycle) {
    updateData.nextPaymentDate = calculateNextPaymentDate(
      formData.startDate || existingData.startDate,
      formData.billingCycle || existingData.billingCycle
    );
  }

  await docRef.update(updateData);

  return {
    ...existingData,
    ...updateData,
    id,
  };
}

/**
 * Delete a subscription
 */
export async function deleteSubscription(id: string, userId: string): Promise<boolean> {
  const docRef = getAdminDb().collection(SUBSCRIPTIONS_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return false;

  const data = doc.data() as Subscription;

  // Verify ownership
  if (data.userId !== userId) return false;

  await docRef.delete();
  return true;
}

/**
 * Get subscription statistics for a user
 */
export async function getSubscriptionStats(userId: string): Promise<{
  totalMonthly: number;
  totalYearly: number;
  count: number;
  upcomingPayments: Subscription[];
}> {
  const subscriptions = await getUserSubscriptions(userId);

  let totalMonthly = 0;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (const sub of subscriptions) {
    // Normalize all costs to monthly
    switch (sub.billingCycle) {
      case 'weekly':
        totalMonthly += sub.cost * 4.33;
        break;
      case 'monthly':
        totalMonthly += sub.cost;
        break;
      case 'quarterly':
        totalMonthly += sub.cost / 3;
        break;
      case 'yearly':
        totalMonthly += sub.cost / 12;
        break;
    }
  }

  const upcomingPayments = subscriptions
    .filter(sub => new Date(sub.nextPaymentDate) <= thirtyDaysFromNow)
    .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalYearly: Math.round(totalMonthly * 12 * 100) / 100,
    count: subscriptions.length,
    upcomingPayments,
  };
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  url: string;
  cost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  startDate: string;
  nextPaymentDate: string;
  cancelUrl?: string;
  manageUrl?: string;
  logoUrl?: string;
  category?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  name: string;
  url: string;
  cost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  startDate: string;
  cancelUrl?: string;
  manageUrl?: string;
  category?: string;
  notes?: string;
}

export interface ParsedSubscriptionData {
  name?: string;
  cost?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  logoUrl?: string;
  cancelUrl?: string;
  manageUrl?: string;
  requiresManualInput: string[];
}

export type SubscriptionCategory = 
  | 'streaming'
  | 'software'
  | 'cloud'
  | 'productivity'
  | 'entertainment'
  | 'education'
  | 'finance'
  | 'health'
  | 'news'
  | 'other';

export const SUBSCRIPTION_CATEGORIES: { value: SubscriptionCategory; label: string }[] = [
  { value: 'streaming', label: 'Streaming' },
  { value: 'software', label: 'Software' },
  { value: 'cloud', label: 'Cloud Services' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'news', label: 'News & Media' },
  { value: 'other', label: 'Other' },
];

export const BILLING_CYCLES: { value: Subscription['billingCycle']; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export const CURRENCIES: { value: string; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  { value: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
  { value: 'DKK', label: 'Danish Krone', symbol: 'kr' },
];

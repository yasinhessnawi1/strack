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
  // Major World Currencies
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$' },

  // European Currencies
  { value: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  { value: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
  { value: 'DKK', label: 'Danish Krone', symbol: 'kr' },
  { value: 'PLN', label: 'Polish Zloty', symbol: 'zł' },
  { value: 'CZK', label: 'Czech Koruna', symbol: 'Kč' },
  { value: 'HUF', label: 'Hungarian Forint', symbol: 'Ft' },
  { value: 'RON', label: 'Romanian Leu', symbol: 'lei' },
  { value: 'BGN', label: 'Bulgarian Lev', symbol: 'лв' },
  { value: 'HRK', label: 'Croatian Kuna', symbol: 'kn' },
  { value: 'ISK', label: 'Icelandic Krona', symbol: 'kr' },

  // Asian Currencies
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'KRW', label: 'South Korean Won', symbol: '₩' },
  { value: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
  { value: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$' },
  { value: 'TWD', label: 'Taiwan Dollar', symbol: 'NT$' },
  { value: 'THB', label: 'Thai Baht', symbol: '฿' },
  { value: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
  { value: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
  { value: 'PHP', label: 'Philippine Peso', symbol: '₱' },
  { value: 'VND', label: 'Vietnamese Dong', symbol: '₫' },
  { value: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
  { value: 'BDT', label: 'Bangladeshi Taka', symbol: '৳' },

  // Middle East & Africa
  { value: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  { value: 'SAR', label: 'Saudi Riyal', symbol: '﷼' },
  { value: 'QAR', label: 'Qatari Riyal', symbol: '﷼' },
  { value: 'KWD', label: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { value: 'BHD', label: 'Bahraini Dinar', symbol: '.د.ب' },
  { value: 'OMR', label: 'Omani Rial', symbol: '﷼' },
  { value: 'ILS', label: 'Israeli Shekel', symbol: '₪' },
  { value: 'TRY', label: 'Turkish Lira', symbol: '₺' },
  { value: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { value: 'EGP', label: 'Egyptian Pound', symbol: 'E£' },
  { value: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { value: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  { value: 'MAD', label: 'Moroccan Dirham', symbol: 'د.م.' },

  // Latin America
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { value: 'MXN', label: 'Mexican Peso', symbol: 'Mex$' },
  { value: 'ARS', label: 'Argentine Peso', symbol: 'AR$' },
  { value: 'CLP', label: 'Chilean Peso', symbol: 'CL$' },
  { value: 'COP', label: 'Colombian Peso', symbol: 'CO$' },
  { value: 'PEN', label: 'Peruvian Sol', symbol: 'S/' },
  { value: 'UYU', label: 'Uruguayan Peso', symbol: '$U' },

  // Other
  { value: 'RUB', label: 'Russian Ruble', symbol: '₽' },
  { value: 'UAH', label: 'Ukrainian Hryvnia', symbol: '₴' },
];

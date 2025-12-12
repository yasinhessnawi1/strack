import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Service Name is required').trim(),
  url: z.string().trim().url('Must be a valid URL (https://...)').optional().or(z.literal('')),
  cost: z.number({ error: "Cost must be a number" }).min(0, 'Cost must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  billingCycle: z.enum(['monthly', 'yearly', 'weekly', 'quarterly'], {
    error: "Billing cycle is required",
  }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  cancelUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  manageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

'use client';

import { useState, useEffect } from 'react';
import { Subscription, BILLING_CYCLES, CURRENCIES } from '@/models/subscription';
import { SUBSCRIPTION_CATEGORIES } from '@/models/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MonthlyHeatmapCalendar from '@/components/ui/monthly-heatmap-calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { subscriptionSchema, type SubscriptionFormValues } from '@/lib/validations';
import { ZodError } from 'zod';

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription | null;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  initialUrl?: string;
  parsedData?: ParsedSubscriptionData;
  defaultCurrency?: string;
}

interface SubscriptionFormData {
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

interface ParsedSubscriptionData {
  name?: string;
  cost?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  logoUrl?: string;
  cancelUrl?: string;
  manageUrl?: string;
  category?: string;
  notes?: string;
  requiresManualInput: string[];
  isCustomSubscription?: boolean;
}

export function SubscriptionForm({
  open,
  onOpenChange,
  subscription,
  onSubmit,
  initialUrl = '',
  parsedData,
  defaultCurrency = 'USD',
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Helper to check if a string is likely a URL
  const isUrl = (str: string) => {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const getInitialName = () => {
    if (subscription?.name) return subscription.name;
    if (parsedData?.name) return parsedData.name;
    // If initialUrl is NOT a URL, treat it as a potential name
    if (initialUrl && !isUrl(initialUrl)) return initialUrl;
    return '';
  };

  const getInitialUrl = () => {
    if (subscription?.url) return subscription.url;
    // Only use initialUrl as URL if it actually looks like one
    if (initialUrl && isUrl(initialUrl)) return initialUrl;
    return '';
  };

  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: getInitialName(),
    url: getInitialUrl(),
    cost: subscription?.cost || parsedData?.cost || 0,
    currency: subscription?.currency || parsedData?.currency || defaultCurrency,
    billingCycle: subscription?.billingCycle || parsedData?.billingCycle || 'monthly',
    startDate: subscription?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    cancelUrl: subscription?.cancelUrl || parsedData?.cancelUrl || '',
    manageUrl: subscription?.manageUrl || parsedData?.manageUrl || '',
    category: subscription?.category || parsedData?.category || '',
    notes: subscription?.notes || parsedData?.notes || '',
  });

  // Update form data when props change
  useEffect(() => {
    if (open) {
      setFormData({
        name: getInitialName(),
        url: getInitialUrl(),
        cost: subscription?.cost || parsedData?.cost || 0,
        currency: subscription?.currency || parsedData?.currency || defaultCurrency,
        billingCycle: subscription?.billingCycle || parsedData?.billingCycle || 'monthly',
        startDate: subscription?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        cancelUrl: subscription?.cancelUrl || parsedData?.cancelUrl || '',
        manageUrl: subscription?.manageUrl || parsedData?.manageUrl || '',
        category: subscription?.category || parsedData?.category || '',
        notes: subscription?.notes || parsedData?.notes || '',
      });
      setErrors({});
    }
  }, [subscription, parsedData, initialUrl, open, defaultCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = subscriptionSchema.parse(formData);
      
      // Cast back to SubscriptionFormData to match the onSubmit interface
      // (or update onSubmit generic type in future)
      await onSubmit(validatedData as unknown as SubscriptionFormData);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        const zodError = error as ZodError;
        zodError.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error submitting form:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const highlightField = (field: string) => {
    return parsedData?.requiresManualInput?.includes(field) 
      ? 'ring-2 ring-yellow-500/50' 
      : '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </DialogTitle>
          <DialogDescription>
            {parsedData?.requiresManualInput?.length ? (
              <span className="text-yellow-500">
                Please fill in the highlighted fields
              </span>
            ) : (
              'Enter the details of your subscription'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Netflix, Spotify, etc."
              // Remove HTML5 validation to rely on Zod and show custom errors
              // required 
              className={cn(highlightField('name'), errors.name && "border-red-500")}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subscription URL</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              type="url"
              className={cn(errors.url && "border-red-500")}
            />
            {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cost *</label>
              <Input
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                type="number"
                step="0.01"
                min="0"
                // required
                className={cn(highlightField('cost'), errors.cost && "border-red-500")}
              />
              {errors.cost && <p className="text-xs text-red-500">{errors.cost}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={cn(
                  "w-full h-10 rounded-md border bg-background px-3",
                  highlightField('currency'),
                  errors.currency && "border-red-500"
                )}
                // required
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.symbol} {c.label}
                  </option>
                ))}
              </select>
              {errors.currency && <p className="text-xs text-red-500">{errors.currency}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Cycle *</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                className={cn(
                  "w-full h-10 rounded-md border bg-background px-3",
                  highlightField('billingCycle'),
                  errors.billingCycle && "border-red-500"
                )}
                // required
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.billingCycle && <p className="text-xs text-red-500">{errors.billingCycle}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date *</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(new Date(formData.startDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthlyHeatmapCalendar
                    selectedDate={formData.startDate}
                    onDateSelect={(date) => {
                      setFormData({ ...formData, startDate: format(date, 'yyyy-MM-dd') });
                      setIsCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 rounded-md border bg-background px-3"
            >
              <option value="">Select category...</option>
              {SUBSCRIPTION_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cancel URL</label>
              <Input
                value={formData.cancelUrl}
                onChange={(e) => setFormData({ ...formData, cancelUrl: e.target.value })}
                placeholder="https://..."
                type="url"
                className={cn(errors.cancelUrl && "border-red-500")}
              />
              {errors.cancelUrl && <p className="text-xs text-red-500">{errors.cancelUrl}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manage URL</label>
              <Input
                value={formData.manageUrl}
                onChange={(e) => setFormData({ ...formData, manageUrl: e.target.value })}
                placeholder="https://..."
                type="url"
                className={cn(errors.manageUrl && "border-red-500")}
              />
              {errors.manageUrl && <p className="text-xs text-red-500">{errors.manageUrl}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              className={cn(
                "w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm",
                errors.notes && "border-red-500"
              )}
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
            >
              {loading ? 'Saving...' : subscription ? 'Update' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

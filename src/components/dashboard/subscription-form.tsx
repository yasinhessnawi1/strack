'use client';

import { useState, useEffect } from 'react';
import { Subscription, BILLING_CYCLES, CURRENCIES, SUBSCRIPTION_CATEGORIES } from '@/models/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription | null;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  initialUrl?: string;
  parsedData?: ParsedSubscriptionData;
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
  requiresManualInput: string[];
}

export function SubscriptionForm({
  open,
  onOpenChange,
  subscription,
  onSubmit,
  initialUrl = '',
  parsedData,
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: subscription?.name || parsedData?.name || '',
    url: subscription?.url || initialUrl,
    cost: subscription?.cost || parsedData?.cost || 0,
    currency: subscription?.currency || parsedData?.currency || 'USD',
    billingCycle: subscription?.billingCycle || parsedData?.billingCycle || 'monthly',
    startDate: subscription?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    cancelUrl: subscription?.cancelUrl || parsedData?.cancelUrl || '',
    manageUrl: subscription?.manageUrl || parsedData?.manageUrl || '',
    category: subscription?.category || '',
    notes: subscription?.notes || '',
  });

  // Update form data when props change
  useEffect(() => {
    if (open) {
      setFormData({
        name: subscription?.name || parsedData?.name || '',
        url: subscription?.url || initialUrl,
        cost: subscription?.cost || parsedData?.cost || 0,
        currency: subscription?.currency || parsedData?.currency || 'USD',
        billingCycle: subscription?.billingCycle || parsedData?.billingCycle || 'monthly',
        startDate: subscription?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        cancelUrl: subscription?.cancelUrl || parsedData?.cancelUrl || '',
        manageUrl: subscription?.manageUrl || parsedData?.manageUrl || '',
        category: subscription?.category || '',
        notes: subscription?.notes || '',
      });
    }
  }, [subscription, parsedData, initialUrl, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
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
              required
              className={highlightField('name')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subscription URL</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              type="url"
            />
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
                required
                className={highlightField('cost')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={`w-full h-10 rounded-md border bg-background px-3 ${highlightField('currency')}`}
                required
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.symbol} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Cycle *</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                className={`w-full h-10 rounded-md border bg-background px-3 ${highlightField('billingCycle')}`}
                required
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                type="date"
                required
              />
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
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manage URL</label>
              <Input
                value={formData.manageUrl}
                onChange={(e) => setFormData({ ...formData, manageUrl: e.target.value })}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm"
            />
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

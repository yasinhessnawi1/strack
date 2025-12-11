'use client';

import { Subscription, CURRENCIES } from '@/models/subscription';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const currency = CURRENCIES.find(c => c.value === subscription.currency);
  const currencySymbol = currency?.symbol || '$';
  
  const nextPaymentDate = new Date(subscription.nextPaymentDate);
  const isUpcoming = nextPaymentDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const getCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'weekly': return '/week';
      case 'monthly': return '/mo';
      case 'quarterly': return '/quarter';
      case 'yearly': return '/year';
      default: return '';
    }
  };

  return (
    <Card className="group hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {subscription.logoUrl ? (
              <img 
                src={subscription.logoUrl} 
                alt={subscription.name}
                className="size-12 rounded-lg object-cover"
              />
            ) : (
              <div className="size-12 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {subscription.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{subscription.name}</h3>
              {subscription.category && (
                <span className="text-xs text-muted-foreground capitalize">
                  {subscription.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              {currencySymbol}{subscription.cost.toFixed(2)}
            </div>
            <span className="text-xs text-muted-foreground">
              {getCycleLabel(subscription.billingCycle)}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Next payment: {' '}
              <span className={isUpcoming ? 'text-yellow-500 font-medium' : ''}>
                {format(nextPaymentDate, 'MMM d, yyyy')}
              </span>
              {isUpcoming && (
                <span className="ml-1 text-yellow-500">
                  ({formatDistanceToNow(nextPaymentDate, { addSuffix: true })})
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="size-4" />
            <span>Started: {format(new Date(subscription.startDate), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {subscription.notes && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {subscription.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {subscription.manageUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <a href={subscription.manageUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4 mr-1" />
              Manage
            </a>
          </Button>
        )}
        {subscription.cancelUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 text-red-500 hover:text-red-600 hover:border-red-500"
          >
            <a href={subscription.cancelUrl} target="_blank" rel="noopener noreferrer">
              Cancel
            </a>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(subscription)}
        >
          <Edit2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(subscription.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

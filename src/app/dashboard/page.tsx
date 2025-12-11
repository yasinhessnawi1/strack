'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Subscription } from '@/models/subscription';
import { AnimatedSubscriptionList } from '@/components/ui/animated-subscription-list';
import { SubscriptionForm } from '@/components/dashboard/subscription-form';
import { DeleteConfirmationDialog } from '@/components/dashboard/delete-confirmation-dialog';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Link2, CreditCard, Loader2, Bell } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { DashboardBackground } from '@/components/ui/dashboard-background';
import { cn } from '@/lib/utils';

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

interface ParsedData {
  name?: string;
  cost?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  logoUrl?: string;
  cancelUrl?: string;
  manageUrl?: string;
  requiresManualInput: string[];
}

interface Stats {
  totalMonthly: number;
  totalYearly: number;
  count: number;
  upcomingPayments: Subscription[];
}

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [quickPasteUrl, setQuickPasteUrl] = useState('');
  const [parsingUrl, setParsingUrl] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isPro, setIsPro] = useState(false);
  const FREE_LIMIT = 5;

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch('/api/subscriptions?includeStats=true');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
        setStats(data.stats);
        setIsPro(!!data.isPro);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscriptions();
    }
  }, [isLoaded, user, fetchSubscriptions]);

  // Check for URL parameter from landing page
  useEffect(() => {
    const url = searchParams.get('url');
    if (url) {
      setQuickPasteUrl(url);
      handleQuickPaste(url);
    }
  }, [searchParams]);

  const handleQuickPaste = async (url?: string) => {
    const targetUrl = url || quickPasteUrl;
    if (!targetUrl) return;

    setParsingUrl(true);
    try {
      const response = await fetch('/api/subscriptions/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setParsedData(data);
        setFormOpen(true);
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      // Open form anyway for manual entry
      setParsedData({ requiresManualInput: ['name', 'cost', 'currency', 'billingCycle'] });
      setFormOpen(true);
    } finally {
      setParsingUrl(false);
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    const url = editingSubscription
      ? `/api/subscriptions/${editingSubscription.id}`
      : '/api/subscriptions';
    const method = editingSubscription ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      fetchSubscriptions();
      setEditingSubscription(null);
      setParsedData(null);
      setQuickPasteUrl('');
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubscriptions();
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormOpen(true);
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isLimitReached = !isPro && subscriptions.length >= FREE_LIMIT;

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Background */}
      <DashboardBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="size-5" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user?.firstName || 'User'}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Quick Paste Section */}
        <div className="mb-8 p-6 rounded-2xl border bg-gradient-to-r from-violet-500/5 to-blue-500/5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Link2 className="size-5" />
            Quick Add Subscription
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                value={quickPasteUrl}
                onChange={(e) => setQuickPasteUrl(e.target.value)}
                placeholder={isLimitReached ? "Limit reached (5/5). Upgrade to add more." : "Paste any subscription link here..."}
                className="pr-12"
                disabled={isLimitReached}
                onKeyDown={(e) => e.key === 'Enter' && !isLimitReached && handleQuickPaste()}
              />
            </div>
            <Button
              onClick={() => handleQuickPaste()}
              disabled={parsingUrl || !quickPasteUrl || isLimitReached}
              className="rounded-[0.5rem] bg-indigo-500/80 hover:bg-indigo-500/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.2)]"
            >
              {parsingUrl ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Parse & Add'
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="mb-12">
            <StatsOverview
              totalMonthly={stats.totalMonthly}
              totalYearly={stats.totalYearly}
              count={stats.count}
              upcomingCount={stats.upcomingPayments.length}
              subscriptions={subscriptions}
            />
          </div>
        )}

        {/* Subscriptions Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-2xl font-bold">Your Subscriptions</h2>
            <div className="flex gap-3 w-full sm:w-auto items-center">
               {!isPro && (
                  <span className="text-xs text-muted-foreground mr-2 font-medium">
                    {subscriptions.length} / {FREE_LIMIT} Free
                  </span>
               )}
               <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subscriptions..."
                  className="pl-10"
                />
               </div>
              <Button
                onClick={() => {
                  if (isLimitReached) {
                     window.location.href = '/pricing';
                     return;
                  }
                  setEditingSubscription(null);
                  setParsedData(null);
                  setFormOpen(true);
                }}
                disabled={isLimitReached && !isPro} 
                className={cn(
                  "rounded-[0.5rem] bg-indigo-500/80 hover:bg-indigo-500/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.2)]",
                  isLimitReached && "opacity-80 hover:bg-indigo-500/80"
                )}
              >
                {isLimitReached ? (
                   <span className="flex items-center"><Link2 className="size-4 mr-2"/> Upgrade</span>
                ) : (
                   <span className="flex items-center"><Plus className="size-4 mr-2"/> Add</span>
                )}
              </Button>
            </div>
          </div>

          {paginatedSubscriptions.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <CreditCard className="size-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by pasting a subscription link above or add one manually
              </p>
              <Button
                onClick={() => setFormOpen(true)}
                className="rounded-[0.5rem] bg-indigo-500/80 hover:bg-indigo-500/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.2)]"
              >
                <Plus className="size-4 mr-2" />
                Add Your First Subscription
              </Button>
            </div>
          ) : (
            <>
              <div className="max-w-4xl mx-auto">
                <AnimatedSubscriptionList
                    subscriptions={paginatedSubscriptions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'bg-violet-600' : ''}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Subscription Form Modal */}
      <SubscriptionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingSubscription(null);
            setParsedData(null);
          }
        }}
        subscription={editingSubscription}
        onSubmit={handleSubmit}
        initialUrl={quickPasteUrl}
        parsedData={parsedData || undefined}
      />
      
      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

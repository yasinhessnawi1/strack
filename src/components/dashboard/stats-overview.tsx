import { TrendingUp, CreditCard, Calendar, DollarSign, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';
import { MagicBento, ParticleCard } from '@/components/ui/magic-bento';
import { cn } from '@/lib/utils';
import { Subscription } from '@/models/subscription';
import { addMonths, format } from 'date-fns';

interface StatsOverviewProps {
  totalMonthly: number;
  totalYearly: number;
  count: number;
  upcomingCount: number;
  currency?: string;
  subscriptions: Subscription[];
}

export function StatsOverview({ 
  totalMonthly, 
  totalYearly, 
  count, 
  upcomingCount,
  currency = 'USD',
  subscriptions
}: StatsOverviewProps) {
  
  // 1. Calculate Category Spend (Real Data)
  const categorySpend = subscriptions.reduce((acc, sub) => {
    const cat = sub.category || 'Other';
    // Normalize to monthly cost for fair comparison
    const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    acc[cat] = (acc[cat] || 0) + monthlyCost;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(categorySpend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  // 2. Calculate Spending Trend (Projected Future Payments for next 6 months)
  const next6Months = Array.from({ length: 6 }, (_, i) => addMonths(new Date(), i));
  
  const areaChartData = next6Months.map(date => {
    const monthName = format(date, 'MMM');
    const monthTotal = subscriptions.reduce((sum, sub) => {
      // Simple projection: 
      // Monthly subs count every month. 
      // Yearly subs count only if their nextPaymentDate falls in this month (simplified logic)
      
      // For accurate projection, we'd check if specific due dates fall in this month.
      // Since we don't have full recurrence rules, we'll use a simplified model:
      // - Monthly: Add cost
      // - Yearly: Add cost ONLY if it's the current month (mock logic for demo) 
      //   OR spread it out? Real cashflow implies "When does the money leave?"
      //   Let's assume "Cash Flow" view:
      
      let hitsThisMonth = false;
      if (sub.billingCycle === 'monthly') hitsThisMonth = true;
      else if (sub.billingCycle === 'yearly') {
        const nextPay = new Date(sub.nextPaymentDate);
        if (nextPay.getMonth() === date.getMonth()) hitsThisMonth = true;
      }
      
      return sum + (hitsThisMonth ? sub.cost : 0);
    }, 0);

    return { name: monthName, total: monthTotal };
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val);

  const stats = [
    {
      title: 'Monthly Spend',
      value: totalMonthly,
      subtitle: 'Recurring monthly',
      icon: TrendingUp,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      title: 'Yearly Projected',
      value: totalYearly,
      subtitle: 'Annual cost',
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Subs',
      value: count,
      subtitle: 'Currently tracking',
      icon: CreditCard,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      isCount: true,
    },
    {
      title: 'Upcoming',
      value: upcomingCount,
      subtitle: 'Next 30 days',
      icon: Calendar,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      isCount: true,
    },
  ];

  return (
    <MagicBento 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full"
      enableTilt={false}       // Disable tilt as requested
      enableMagnetism={false} // Disable magnetism as requested
    >
      {/* 
        LAYOUT STRATEGY:
        Left Column (Cols 1-2):
        - Row 1: Monthly + Yearly (Small)
        - Row 2: Spending Chart (Big)
        
        Right Column (Cols 3-4):
        - Row 1: Category Chart (Big)
        - Row 2: Active + Upcoming (Small)
      */}

      {/* --- LEFT COLUMN GROUP (Virtual) --- */}
      
      {/* 1. Monthly Spend (Small) */}
      <ParticleCard className="col-span-1 md:col-span-1 magic-bento-card bg-white/5 border-white/10 flex flex-col justify-between h-[160px]">
         <div className="z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("size-8 rounded-lg flex items-center justify-center", stats[0].bg, stats[0].color)}>
                <stats[0].icon className="size-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{stats[0].title}</p>
              <p className="text-lg font-bold text-foreground truncate" title={formatCurrency(stats[0].value)}>
                {formatCurrency(stats[0].value)}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{stats[0].subtitle}</p>
            </div>
         </div>
      </ParticleCard>

      {/* 2. Yearly Spend (Small) */}
      <ParticleCard className="col-span-1 md:col-span-1 magic-bento-card bg-white/5 border-white/10 flex flex-col justify-between h-[160px]">
         <div className="z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("size-8 rounded-lg flex items-center justify-center", stats[1].bg, stats[1].color)}>
                <stats[1].icon className="size-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{stats[1].title}</p>
              <p className="text-lg font-bold text-foreground truncate" title={formatCurrency(stats[1].value)}>
                {formatCurrency(stats[1].value)}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{stats[1].subtitle}</p>
            </div>
         </div>
      </ParticleCard>

      {/* 3. Category Spend (Big - Starts Right Col) */}
      {/* Note: In a dense grid, we need to order carefully. 
          If we want specific placement, standard generic order might fail on mobile.
          But for MD grid:
          We want: 
          [Small] [Small] | [   BIG CHART   ]
          [   BIG CHART   ] | [Small] [Small]
          
          Wait, the user requested:
          "spending stacks on top of the spending chart" -> Left Side
          "counts stast can stay under the category spend" -> Right Side
          
          Grid Config:
          1   2   3   4
          S   S   BBBBB
          BBBBB   S   S
          
          So:
          1. Small (Monthly)
          2. Small (Yearly)
          3. Big (Category) - Col Span 2, Row Span 1?
          4. Big (Spending) - Col Span 2
          5. Small (Active)
          6. Small (Upcoming)
      */}
      
      <ParticleCard className="col-span-1 md:col-span-2 magic-bento-card min-h-[320px] bg-white/5 border-white/10 order-3 md:order-3 md:row-span-2 md:h-auto">
         {/* Using row-span to match height of 2 stacked small cards? No, user wants Big Blocks.
             Let's stick to the 2x4 concept.
             If Chart is Big (e.g. height 320), then 2 Small cards need to equal 320?
             160 + 160 = 320. Yes.
          */}
         <div className="flex flex-col h-full z-10 relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="size-5 text-blue-400" /> Category Spend
                </h3>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          stroke="#a3a3a3" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          width={60}
                        />
                        <Tooltip 
                             cursor={{fill: 'white/5'}}
                             contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                             itemStyle={{ color: '#fff' }}
                             formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#818cf8', '#60a5fa', '#34d399', '#f472b6', '#fbbf24'][index % 5]} />
                            ))}
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
            </div>
         </div>
      </ParticleCard>

      {/* 4. Spending Trend (Big - Left Side Bottom) */}
      <ParticleCard className="col-span-1 md:col-span-2 magic-bento-card min-h-[320px] bg-white/5 border-white/10 order-4 md:order-4">
        <div className="flex flex-col h-full z-10 relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="size-5 text-violet-400" /> Cash Flow Projection
                </h3>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData}>
                    <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="name" 
                        stroke="#525252" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#525252" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`} 
                        width={60}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorTotal)" 
                    />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </ParticleCard>

      {/* 5. Active Subs (Small - Right Side Bottom) */}
      <ParticleCard className="col-span-1 md:col-span-1 magic-bento-card bg-white/5 border-white/10 flex flex-col justify-between h-[160px] order-5 md:order-5">
         <div className="z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("size-8 rounded-lg flex items-center justify-center", stats[2].bg, stats[2].color)}>
                <stats[2].icon className="size-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{stats[2].title}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats[2].value}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{stats[2].subtitle}</p>
            </div>
         </div>
      </ParticleCard>

      {/* 6. Upcoming (Small - Right Side Bottom) */}
      <ParticleCard className="col-span-1 md:col-span-1 magic-bento-card bg-white/5 border-white/10 flex flex-col justify-between h-[160px] order-6 md:order-6">
         <div className="z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("size-8 rounded-lg flex items-center justify-center", stats[3].bg, stats[3].color)}>
                <stats[3].icon className="size-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{stats[3].title}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats[3].value}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{stats[3].subtitle}</p>
            </div>
         </div>
      </ParticleCard>

    </MagicBento>
  );
}

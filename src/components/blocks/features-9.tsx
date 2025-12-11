'use client'
import { Activity, Map as MapIcon, MessageCircle } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function Features() {
    return (
        <section className="px-4 py-16 md:py-32" id="features">
            <div className="mx-auto grid max-w-5xl border border-border/50 md:grid-cols-2 rounded-3xl overflow-hidden bg-background/50 backdrop-blur-sm shadow-xl">
                <div>
                    <div className="p-6 sm:p-12 border-b md:border-b-0 md:border-r border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                            <MapIcon className="size-4" />
                            Global Coverage
                        </span>

                        <p className="mt-8 text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Track subscriptions from anywhere. Prices in any currency, converted instantly.
                        </p>
                    </div>

                    <div aria-hidden className="relative min-h-[300px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20">
                        <div className="absolute inset-0 z-10 m-auto size-fit">
                            <div className="rounded-full bg-background z-[1] dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-4 py-2 text-xs font-medium shadow-lg shadow-black/5 animate-bounce-slow">
                                <span className="text-lg">🇺🇸</span> Used in US
                            </div>
                        </div>
                        
                         <div className="absolute top-10 left-10 z-10 m-auto size-fit">
                            <div className="rounded-full bg-background z-[1] dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-4 py-2 text-xs font-medium shadow-lg shadow-black/5 animate-pulse">
                                <span className="text-lg">🇪🇺</span> EUR Supported
                            </div>
                        </div>

                        <div className="absolute inset-0 overflow-hidden opacity-50 contrast-75">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] z-10"></div>
                            <Map />
                        </div>
                    </div>
                </div>
                
                <div className="overflow-hidden md:border-0 bg-zinc-50/50 dark:bg-white/5">
                    <div className="p-6 sm:p-12">
                        <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                            <MessageCircle className="size-4" />
                            Smart Notifications
                        </span>

                        <p className="my-8 text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Get notified before you pay. We'll remind you 3 days before any renewal.
                        </p>
                    </div>
                    <div aria-hidden className="flex flex-col gap-6 px-12 pb-12">
                        <div className="transform translate-x-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <MessageCircle className="size-3 text-blue-500" />
                                </div>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-wide">STrack Bot • 2m ago</span>
                            </div>
                            <div className="rounded-2xl rounded-tl-none bg-background border p-4 text-sm shadow-sm relative">
                                <p>Netflix is renewing on Friday ($15.99). Want to cancel?</p>
                            </div>
                        </div>

                        <div className="transform -translate-x-4">
                             <div className="rounded-2xl rounded-tr-none bg-gradient-to-r from-violet-600 to-blue-600 p-4 text-sm text-white shadow-md ml-auto w-fit max-w-[80%]">
                                <p>Remind me tomorrow, please!</p>
                            </div>
                            <span className="text-muted-foreground block text-right text-[10px] uppercase tracking-wide mt-2 mr-1">Read 1m ago</span>
                        </div>
                    </div>
                </div>
                
                <div className="col-span-full border-y border-border/50 p-12 bg-background/30">
                    <p className="text-center text-4xl font-bold lg:text-7xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                        100% Private
                    </p>
                </div>
                
                <div className="relative col-span-full bg-zinc-50/30 dark:bg-white/5">
                    <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                        <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                            <Activity className="size-4" />
                            Visual Analytics
                        </span>

                        <p className="my-8 text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Visualize your spending over time. <span className="text-muted-foreground">See exactly where your money goes.</span>
                        </p>
                    </div>
                    <div className="pt-24 md:pt-12 px-4 md:px-0">
                        <MonitoringChart />
                    </div>
                </div>
            </div>
        </section>
    )
}

const map = new DottedMap({ height: 55, grid: 'diagonal' })

const points = map.getPoints()

const svgOptions = {
    backgroundColor: 'var(--color-background)',
    color: 'currentColor',
    radius: 0.15,
}

const Map = () => {
    const viewBox = `0 0 120 60`
    return (
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{ background: svgOptions.backgroundColor }} className="w-full h-full text-foreground/20">
            {points.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r={svgOptions.radius} fill={svgOptions.color} />
            ))}
        </svg>
    )
}

const chartConfig = {
    desktop: {
        label: 'Spending',
        color: 'oklch(0.627 0.265 303.9)', // Violet
    },
    mobile: {
        label: 'Savings',
        color: 'oklch(0.556 0 0)', // Green-ish/Muted
    },
} satisfies ChartConfig

const chartData = [
    { month: 'May', desktop: 56, mobile: 10 },
    { month: 'June', desktop: 78, mobile: 25 },
    { month: 'January', desktop: 126, mobile: 40 },
    { month: 'February', desktop: 205, mobile: 80 },
    { month: 'March', desktop: 180, mobile: 120 },
    { month: 'April', desktop: 350, mobile: 150 },
]

const MonitoringChart = () => {
    return (
        <ChartContainer className="h-[400px] w-full" config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                    top: 20,
                    bottom: 0,
                }}>
                <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary-custom)" stopOpacity={0.8} />
                        <stop offset="65%" stopColor="var(--color-primary-custom)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent-custom)" stopOpacity={0.8} />
                        <stop offset="65%" stopColor="var(--color-accent-custom)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <ChartTooltip active cursor={false} content={<ChartTooltipContent className="dark:bg-muted" />} />
                <Area strokeWidth={2} dataKey="mobile" type="monotone" fill="url(#fillMobile)" fillOpacity={0.1} stroke="var(--color-accent-custom)" stackId="a" />
                <Area strokeWidth={2} dataKey="desktop" type="monotone" fill="url(#fillDesktop)" fillOpacity={0.1} stroke="var(--color-primary-custom)" stackId="a" />
            </AreaChart>
        </ChartContainer>
    )
}

'use client'
import { Activity, Map as MapIcon, MessageCircle } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function Features() {
    return (
        <section className="w-full px-2 sm:px-4 py-12 sm:py-16 md:py-32 overflow-hidden" id="features">
            <div className="mx-auto grid w-full max-w-5xl border border-border/50 md:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden bg-background/50 backdrop-blur-sm shadow-xl">
                <div className="w-full overflow-hidden">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
                            <MapIcon className="size-3 sm:size-4 flex-shrink-0" />
                            <span className="break-words">Global Coverage</span>
                        </span>

                        <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-relaxed break-words">
                            Track subscriptions from anywhere. Prices in any currency, converted instantly.
                        </p>
                    </div>

                    <div aria-hidden className="relative min-h-[250px] sm:min-h-[300px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden">
                        <div className="absolute inset-0 z-10 m-auto size-fit max-w-[calc(100%-2rem)]">
                            <div className="rounded-full bg-background z-[1] dark:bg-muted relative flex size-fit w-fit items-center gap-1 sm:gap-2 border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium shadow-lg shadow-black/5 animate-bounce-slow whitespace-nowrap">
                                <span className="text-sm sm:text-lg">🇺🇸</span> US
                            </div>
                        </div>
                        
                         <div className="absolute top-4 sm:top-6 md:top-10 left-4 sm:left-6 md:left-10 z-10 m-auto size-fit">
                            <div className="rounded-full bg-background z-[1] dark:bg-muted relative flex size-fit w-fit items-center gap-1 sm:gap-2 border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium shadow-lg shadow-black/5 animate-pulse whitespace-nowrap">
                                <span className="text-sm sm:text-lg">🇪🇺</span> EUR
                            </div>
                        </div>

                        <div className="absolute inset-0 overflow-hidden opacity-50 contrast-75">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] z-10"></div>
                            <Map />
                        </div>
                    </div>
                </div>
                
                <div className="w-full overflow-hidden md:border-0 bg-zinc-50/50 dark:bg-white/5">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                        <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
                            <MessageCircle className="size-3 sm:size-4 flex-shrink-0" />
                            <span className="break-words">Smart Notifications</span>
                        </span>

                        <p className="my-4 sm:my-6 md:my-8 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-relaxed break-words">
                            Get notified before you pay. We'll remind you 3 days before any renewal.
                        </p>
                    </div>
                    <div aria-hidden className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8 md:pb-12">
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-5 sm:size-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="size-2.5 sm:size-3 text-blue-500" />
                                </div>
                                <span className="text-muted-foreground text-[9px] sm:text-[10px] uppercase tracking-wide whitespace-nowrap">STrack Bot • 2m ago</span>
                            </div>
                            <div className="rounded-2xl rounded-tl-none bg-background border p-3 sm:p-4 text-xs sm:text-sm shadow-sm relative max-w-[90%] sm:max-w-[85%]">
                                <p className="break-words">Netflix is renewing on Friday ($15.99). Want to cancel?</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col items-end">
                             <div className="rounded-2xl rounded-tr-none bg-gradient-to-r from-violet-600 to-blue-600 p-3 sm:p-4 text-xs sm:text-sm text-white shadow-md w-fit max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
                                <p className="break-words">Remind me tomorrow, please!</p>
                            </div>
                            <span className="text-muted-foreground text-[9px] sm:text-[10px] uppercase tracking-wide mt-2 mr-1 whitespace-nowrap">Read 1m ago</span>
                        </div>
                    </div>
                </div>
                
                <div className="col-span-full border-y border-border/50 p-6 sm:p-8 md:p-12 bg-background/30">
                    <p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight break-words">
                        100% Private
                    </p>
                </div>
                
                <div className="relative col-span-full bg-zinc-50/30 dark:bg-white/5 w-full overflow-hidden">
                    <div className="relative z-10 max-w-lg px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 md:pt-12 pb-2 sm:pb-4">
                        <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
                            <Activity className="size-3 sm:size-4 flex-shrink-0" />
                            <span className="break-words">Visual Analytics</span>
                        </span>

                        <p className="my-4 sm:my-6 md:my-8 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-relaxed break-words">
                            Visualize your spending over time. <span className="text-muted-foreground block sm:inline mt-1 sm:mt-0">See exactly where your money goes.</span>
                        </p>
                    </div>
                    <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-12 px-2 sm:px-4 md:px-0 pb-4 sm:pb-6 md:pb-8">
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

'use client'
import React from 'react'
import { Link2, SendHorizonal, Menu, X, CreditCard, Calendar, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { useUser } from '@clerk/nextjs'
import { PricingSlider } from '@/components/ui/pricing-slider'
import { Features } from '@/components/blocks/features-9'
import CyberneticGridShader from '@/components/ui/cybernetic-grid-shader'
import { Logo } from '@/components/ui/logo'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden">
                <CyberneticGridShader />
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                            >
                                <h1
                                    className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    Track Every Subscription, Save Every Dollar
                                </h1>

                                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                                    Never miss another renewal. STrack automatically parses subscription links, tracks costs, and reminds you before payments hit. Take control of your recurring expenses.
                                </p>

                                <form
                                    action="/dashboard"
                                    className="mt-12 mx-auto max-w-md">
                                    <div className="bg-background has-[input:focus]:ring-primary/50 relative grid grid-cols-[1fr_auto] pr-1.5 items-center rounded-[1rem] border shadow-lg shadow-zinc-950/5 has-[input:focus]:ring-2">
                                        <Link2 className="pointer-events-none absolute inset-y-0 left-4 my-auto size-5 text-muted-foreground" />

                                        <input
                                            placeholder="Paste a link or enter a service name..."
                                            className="h-14 w-full bg-transparent pl-12 focus:outline-none text-base"
                                            type="text"
                                            name="url"
                                        />

                                        <div>
                                            <Button
                                                aria-label="submit"
                                                size="lg"
                                                className="rounded-[0.5rem] bg-indigo-500/80 hover:bg-indigo-500/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.2)]">
                                                <span className="hidden md:block font-semibold">Track It</span>
                                                <SendHorizonal
                                                    className="relative mx-auto size-5 md:hidden"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        Try it now — paste a Netflix, Spotify, or any subscription link
                                    </p>
                                </form>

                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                                >
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                                        <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                            <AppComponent />

                                            <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const AppComponent = () => {
    return (
        <div className="relative space-y-3 rounded-[1rem] bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-4">
            <div className="flex items-center gap-1.5 text-violet-500">
                <CreditCard className="size-5" />
                <div className="text-sm font-medium">Monthly Spending</div>
            </div>
            <div className="space-y-3">
                <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">Your subscriptions are now under control. You&apos;ve saved $47 this month!</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">$124.99</span>
                            <span className="text-muted-foreground text-xs">/month</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-r from-violet-500 to-blue-500 px-2 text-xs text-white">Active</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">$172.99</span>
                            <span className="text-muted-foreground text-xs">/month</span>
                        </div>
                        <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">Last Month</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { isSignedIn } = useUser()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed group z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {isSignedIn ? (
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn('bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm', isScrolled && 'lg:hidden')}>
                                        <Link href="/dashboard">
                                            <span>Dashboard</span>
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/sign-in">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn('bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm', isScrolled && 'lg:hidden')}>
                                            <Link href="/sign-up">
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn('bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm', isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                                        <span>{isSignedIn ? "Dashboard" : "Get Started"}</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const LogoCloud = () => {
    return (
        <section className="bg-background pb-16 md:pb-32">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm text-muted-foreground">Track subscriptions from</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Netflix</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Spotify</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Disney+</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Adobe</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>AWS</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>GitHub</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Notion</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                <span>Slack</span>
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}



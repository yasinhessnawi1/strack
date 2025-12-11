import { cn } from '@/lib/utils'
import { MorphingText } from '@/components/ui/morphing-text'
import Image from 'next/image'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative size-8 rounded-lg flex items-center justify-center">
                <Image src="/icon.png" alt="STrack Logo" width={32} height={32} className="size-8" />
            </div>
            <div className="w-64 h-6 relative">
                <MorphingText texts={["STrack", "Subscription Track"]} className="font-bold text-xl text-foreground !w-full !h-full" />
            </div>
        </div>
    )
}

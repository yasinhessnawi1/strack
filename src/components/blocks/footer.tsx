import Image from 'next/image';
import Link from 'next/link';
import { MorphingText } from '@/components/ui/morphing-text';

export function Footer() {
  return (
    <footer className="py-12 border-t bg-background relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg flex items-center justify-center">
                <Image src="/icon.png" alt="STrack Logo" width={32} height={32} className="size-8" />
              </div>
              <div className="w-64 h-6 relative">
                 <MorphingText texts={["STrack", "Subscription Track"]} className="font-bold text-xl text-foreground !w-full !h-full" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                <nav className="flex gap-4">
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy Policy
                    </Link>
                </nav>
                <p>
                  © {new Date().getFullYear()} STrack. All rights reserved.
                </p>
            </div>
          </div>
        </div>
      </footer>
  );
}

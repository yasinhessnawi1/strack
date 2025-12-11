"use client";

import { FlickeringGrid } from "@/components/ui/flickering-grid";

// SVG for "STrack" text mask
const LOGO_SVG = `
<svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="120" fill="black">STrack</text>
</svg>
`;

const LOGO_BASE64 = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`;

const maskStyle = {
  WebkitMaskImage: `url('${LOGO_BASE64}')`,
  WebkitMaskSize: 'contain',
  WebkitMaskPosition: 'center',
  WebkitMaskRepeat: 'no-repeat',
  maskImage: `url('${LOGO_BASE64}')`,
  maskSize: 'contain',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
} as const;

// Configuration for the background and logo grids
const GRID_CONFIG = {
  background: {
    color: "#6D28D9", // Violet-600
    maxOpacity: 0.15,
    flickerChance: 0.12,
    squareSize: 4,
    gridGap: 4,
  },
  logo: {
    color: "#7C3AED", // Violet-500
    maxOpacity: 0.65,
    flickerChance: 0.18,
    squareSize: 3,
    gridGap: 6,
  },
} as const;

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-background">
      {/* Base flickering grid background */}
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
        {...GRID_CONFIG.background}
      />
      
      {/* "STrack" masked flickering grid overlay */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center opacity-30" 
        style={maskStyle}
      >
        <FlickeringGrid {...GRID_CONFIG.logo} className="w-full h-full" />
      </div>
    </div>
  );
}

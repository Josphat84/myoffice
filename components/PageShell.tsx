// components/PageShell.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// 5 curated Unsplash nature wallpapers — rotate every 90 seconds
const WALLPAPERS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2560&q=90&auto=format&fit=crop', // Swiss Alps
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&q=90&auto=format&fit=crop', // Sunlit forest
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2560&q=90&auto=format&fit=crop', // Tropical ocean
  'https://images.unsplash.com/photo-1439853949212-36089919ea25?w=2560&q=90&auto=format&fit=crop', // Mountain lake
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=2560&q=90&auto=format&fit=crop', // Misty meadow
];

interface PageShellProps {
  children: React.ReactNode;
  variant?: 'module' | 'home';
  noFooter?: boolean;
}

export function PageShell({ children, noFooter = false }: PageShellProps) {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (current + 1) % WALLPAPERS.length;
      setIncoming(next);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFadeIn(true));
      });
      const swap = setTimeout(() => {
        setCurrent(next);
        setIncoming(null);
        setFadeIn(false);
      }, 3200);
      return () => clearTimeout(swap);
    }, 90000);
    return () => clearInterval(t);
  }, [current]);

  return (
    <div className="relative min-h-screen flex flex-col">

      {/* Base wallpaper — Next.js Image: optimised, lazy, no inline styles */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={WALLPAPERS[current]}
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Incoming wallpaper — fades in via opacity-only CSS transition */}
      {incoming !== null && (
        <div className={`absolute inset-0 -z-20 overflow-hidden oz-bg-entering${fadeIn ? ' oz-bg-visible' : ''}`}>
          <Image
            src={WALLPAPERS[incoming]}
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Frosted white wash — light tint so nature photos stay visible */}
      <div className="absolute inset-0 -z-10 bg-white/15" />

      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

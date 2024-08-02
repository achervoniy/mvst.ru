'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { BREAKPOINTS } from '@/ui/breakpoints';

const ViewportCtx = createContext<{
  isViewportInitialized: boolean;
  isMobile: boolean;
  isTabletAndBelow: boolean;
  isDesktop: boolean;
  width: number;
} | null>(null);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState<number>(() => global?.innerWidth ?? 0);

  useEffect(() => {
    const setter = () => setWidth(window?.innerWidth ?? 0);

    window.addEventListener('resize', setter);

    setWidth(window?.innerWidth ?? 0);

    return () => {
      window.removeEventListener('resize', setter);
    };
  }, []);

  const isMobile = width < BREAKPOINTS.sm;
  const isTabletAndBelow = width < BREAKPOINTS.md;
  const isDesktop = width >= BREAKPOINTS.md;
  const isViewportInitialized = width !== 0;

  const state = useMemo(
    () => ({
      isViewportInitialized,
      isMobile: isViewportInitialized && isMobile,
      isTabletAndBelow: isViewportInitialized && isTabletAndBelow,
      isDesktop: isViewportInitialized && isDesktop,
      width,
    }),
    [isDesktop, isMobile, isTabletAndBelow, isViewportInitialized, width],
  );

  return <ViewportCtx.Provider value={state}>{children}</ViewportCtx.Provider>;
}

export const useViewport = () => {
  const ctx = useContext(ViewportCtx);

  if (!ctx) {
    throw new Error('[useViewport]: must be used inside ViewportProvider');
  }

  return ctx;
};

'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// The 5 vibrant colors from the logo/hero page
export const BRAND_COLORS = ['#00c6ff', '#ff8a00', '#00d2b4', '#0072ff', '#ff2a85'];

export function useBrandColorCycle(intervalMs = 4000) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % BRAND_COLORS.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return { activeColor: BRAND_COLORS[activeIndex], activeIndex };
}

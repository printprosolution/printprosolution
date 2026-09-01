"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string; // e.g. "+", "%"
  durationMs?: number;
}

/**
 * Shows 0 until the element scrolls into view, then counts up to `target`
 * over `durationMs`. Runs once per page load (won't re-trigger on re-scroll).
 */
export function AnimatedCounter({ target, suffix = "", durationMs = 1500 }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - startTime) / durationMs, 1);
            // ease-out for a natural "settling" feel
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs, hasAnimated]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

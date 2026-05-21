"use client";

import { useEffect, useRef, useState } from "react";

interface KPICardProps {
  label: string;
  value: number;
  delta?: string;
  subtext?: string;
  goldTopBorder?: boolean;
}

function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return current;
}

export function KPICard({ label, value, delta, subtext, goldTopBorder }: KPICardProps) {
  const displayed = useCountUp(value);

  return (
    <div
      className="flex flex-col"
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderRadius: 8,
        borderTop: goldTopBorder ? "2px solid #C4973F" : "0.5px solid #1E1C18",
        padding: 14,
      }}
    >
      <p
        className="uppercase tracking-[0.1em] mb-3"
        style={{
          fontSize: 10,
          color: "#444",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className="leading-none"
          style={{
            fontSize: 26,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          }}
        >
          {displayed}
        </span>
        {delta && (
          <span
            style={{
              fontSize: 12,
              color: "#C4973F",
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            }}
          >
            {delta}
          </span>
        )}
      </div>
      {subtext && (
        <p
          style={{
            fontSize: 10,
            color: "#333230",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            marginTop: 2,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}

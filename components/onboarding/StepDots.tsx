"use client";

interface StepDotsProps {
  total: number;
  current: number; // 0-indexed
}

export function StepDots({ total, current }: StepDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={i}
            style={{
              width: done || active ? 8 : 6,
              height: done || active ? 8 : 6,
              borderRadius: "50%",
              background: done ? "#C4973F" : "transparent",
              border: active ? "1.5px solid #C4973F" : done ? "none" : "1px solid #333230",
              transition: "all 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}

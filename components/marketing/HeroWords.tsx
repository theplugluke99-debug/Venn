"use client";

import { useEffect, useState } from "react";

export function HeroWords() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay so page paint happens first
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const lines = [
    "Find the right clients.",
    "Say the right thing.",
    "Win more business.",
  ];

  const words = lines.flatMap((line, li) => [
    ...line.split(" ").map((word, wi) => ({ word, li, wi, lineBreakAfter: false })),
    { word: "", li, wi: -1, lineBreakAfter: true },
  ]);

  // Flatten to get total word index for delay
  let wordIdx = 0;

  return (
    <h1
      style={{
        fontSize: "clamp(38px, 6vw, 64px)",
        color: "#FFFDF8",
        fontFamily: "var(--font-instrument-serif), Georgia, serif",
        fontWeight: 400,
        lineHeight: 1.08,
        marginBottom: 28,
        letterSpacing: "-0.01em",
      }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split(" ").map((word, wi) => {
            const delay = wordIdx++ * 80;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: wi < line.split(" ").length - 1 ? "0.28em" : 0,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

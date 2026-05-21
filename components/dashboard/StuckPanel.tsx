"use client";

import { useState, useEffect } from "react";

interface StuckPanelProps {
  isStuck: boolean;
}

export function StuckPanel({ isStuck }: StuckPanelProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!isStuck) return;
    const key = "venn_stuck_dismissed";
    const last = localStorage.getItem(key);
    // Show again after 7 days
    const shouldShow = !last || Date.now() - parseInt(last) > 7 * 24 * 60 * 60 * 1000;
    setDismissed(!shouldShow);
  }, [isStuck]);

  if (!isStuck || dismissed) return null;

  function dismiss() {
    localStorage.setItem("venn_stuck_dismissed", String(Date.now()));
    setDismissed(true);
  }

  return (
    <div
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #2A2826",
        borderRadius: 10,
        padding: "24px 28px",
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          fontSize: 18,
          color: "#FFFDF8",
          fontFamily: "var(--font-instrument-serif), Georgia, serif",
          fontWeight: 400,
          marginBottom: 8,
        }}
      >
        Let&apos;s look at what&apos;s happening.
      </h3>
      <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.7, marginBottom: 20 }}>
        You&apos;ve sent cards and nothing has come back yet. That&apos;s normal — but let&apos;s make sure everything is working as well as it can.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          {
            title: "Try a different channel",
            body: "If you've been using email, try Instagram DM for the same leads. Local business owners check Instagram more.",
            href: "/outreach",
          },
          {
            title: "Refresh your opening angle",
            body: "Switch from pain-led to opportunity-led for your next batch. Sometimes the angle is everything.",
            href: "/settings",
          },
          {
            title: "Target higher intent leads",
            body: "Filter your leads to High intent only and focus there first. Those are your best shots.",
            href: "/leads",
          },
        ].map((card) => (
          <a
            key={card.title}
            href={card.href}
            style={{
              display: "block",
              background: "#0D0C09",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: "14px 16px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2A2826")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1C18")}
          >
            <p style={{ fontSize: 13, color: "#FFFDF8", fontWeight: 500, marginBottom: 6 }}>
              {card.title}
            </p>
            <p style={{ fontSize: 12, color: "#666462", lineHeight: 1.5 }}>
              {card.body}
            </p>
          </a>
        ))}
      </div>

      <button
        onClick={dismiss}
        style={{
          fontSize: 12,
          color: "#666",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--font-inter)",
        }}
      >
        Got it — I&apos;ll try these
      </button>
    </div>
  );
}

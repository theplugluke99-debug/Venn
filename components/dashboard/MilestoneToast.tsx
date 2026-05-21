"use client";

import { useEffect, useState } from "react";

interface MilestoneData {
  type: string;
  title: string;
  description: string;
}

const TOAST_MESSAGES: Record<string, { title: string; body: string; border?: string }> = {
  first_search: {
    title: "Your first intelligence run is complete.",
    body: "This is what Venn does.",
  },
  first_lead_complete: {
    title: "Your first lead is ready.",
    body: "Open it. See what Venn found.",
  },
  first_card_generated: {
    title: "Your first prospect card is live.",
    body: "Send it with twelve words.",
  },
  first_card_viewed: {
    title: "Someone is reading your card right now.",
    body: "This is a warm lead.",
    border: "#4ADE80",
  },
  first_card_opened_twice: {
    title: "They came back to your card.",
    body: "That's intent. Follow up today.",
    border: "#4ADE80",
  },
  first_reply_logged: {
    title: "Someone replied.",
    body: "The hardest part is done.",
    border: "#4ADE80",
  },
  search_milestone_10: {
    title: "10 searches.",
    body: "Your pipeline is building.",
  },
  search_milestone_25: {
    title: "25 searches.",
    body: "This is a real pipeline now.",
  },
  cards_milestone_10: {
    title: "10 cards in the wild.",
    body: "That's real outreach.",
  },
  cards_milestone_50: {
    title: "50 cards sent.",
    body: "You've put serious work in.",
  },
};

// Poll /api/journey for new milestones every 30 seconds (only on dashboard)
export function MilestoneToast() {
  const [toast, setToast] = useState<MilestoneData | null>(null);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const raw = localStorage.getItem("venn_seen_milestones");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  });

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/journey");
        if (!res.ok) return;
        const data = await res.json();
        const events: MilestoneData[] = data.events ?? [];
        const newEvent = events.find((e) => TOAST_MESSAGES[e.type] && !seen.has(e.type));
        if (newEvent) {
          setToast(newEvent);
          setVisible(true);
          setSeen((prev) => {
            const next = new Set(prev);
            next.add(newEvent.type);
            localStorage.setItem("venn_seen_milestones", JSON.stringify([...next]));
            return next;
          });
        }
      } catch {
        // non-critical
      }
    }
    check();
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(() => setToast(null), 400);
  }

  if (!toast) return null;

  const msg = TOAST_MESSAGES[toast.type];
  if (!msg) return null;

  const borderColor = msg.border ?? "#C4973F";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        transform: visible ? "translateY(0)" : "translateY(100px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s ease, opacity 0.4s ease",
        maxWidth: 320,
      }}
    >
      <div
        style={{
          background: "#0F0E0B",
          border: `0.5px solid ${borderColor}50`,
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: 8,
          padding: "16px 18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            marginBottom: 4,
          }}
        >
          {msg.title}
        </p>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 10 }}>
          {msg.body}
        </p>
        <button
          onClick={dismiss}
          style={{
            fontSize: 11,
            color: "#444",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "var(--font-inter)",
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PANELS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
    ),
    title: "Finds businesses that need you",
    body: "Tell Venn a niche and location. It searches in real time, finds live businesses, and pulls their Google Reviews, website data and social signals. No database. No stale contacts. Every result exists right now.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01" />
      </svg>
    ),
    title: "Scores their intent automatically",
    body: "Venn analyses every signal and scores each business High, Medium or Low intent. High intent means something is broken and they need help. You know exactly who to contact first before you've read a single review.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14L21 3M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3Z" />
      </svg>
    ),
    title: "Generates your opening and sends a card",
    body: "For every lead Venn writes a personalised opening line based on real signals from their business. Then generates a Digital Prospect Card — a unique URL that shows their own data back at them. Twelve words. Their URL. That's your outreach.",
  },
] as const;

const DEMO_WORDS = ["Hey", "Sarah,", "noticed", "Glow", "Aesthetics", "has", "47", "reviews", "mentioning", "long", "wait", "times", "—", "want", "to", "show", "you", "what", "we'd", "do."];
const DEMO_URL = "venn.agency/card/glow-aesthetics-mx7k";

function DemoPreview() {
  const [wordIndex, setWordIndex] = useState(0);
  const [showUrl, setShowUrl] = useState(false);
  const [urlChars, setUrlChars] = useState(0);

  useEffect(() => {
    if (wordIndex < DEMO_WORDS.length) {
      const t = setTimeout(() => setWordIndex((i) => i + 1), 80);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowUrl(true), 400);
      return () => clearTimeout(t);
    }
  }, [wordIndex]);

  useEffect(() => {
    if (showUrl && urlChars < DEMO_URL.length) {
      const t = setTimeout(() => setUrlChars((c) => c + 1), 40);
      return () => clearTimeout(t);
    }
  }, [showUrl, urlChars]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.4 }}
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: "2px solid #4CAF50",
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          style={{
            fontSize: 10,
            background: "#0d2b0d",
            color: "#4CAF50",
            border: "0.5px solid #4CAF5030",
            padding: "2px 8px",
            borderRadius: 20,
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
          }}
        >
          High intent
        </span>
        <span style={{ fontSize: 12, color: "#FFFDF8", fontFamily: "var(--font-inter)", fontWeight: 500 }}>
          Glow Aesthetics, Manchester
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#888",
          fontStyle: "italic",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          lineHeight: 1.5,
          minHeight: 40,
        }}
      >
        &ldquo;{DEMO_WORDS.slice(0, wordIndex).join(" ")}{wordIndex < DEMO_WORDS.length ? <span style={{ opacity: 0.5 }}>|</span> : ""}&rdquo;
      </p>

      {showUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2"
        >
          <span style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)" }}>Card URL:</span>
          <span style={{ fontSize: 11, color: "#C4973F", fontFamily: "monospace" }}>
            {DEMO_URL.slice(0, urlChars)}
            {urlChars < DEMO_URL.length && <span style={{ opacity: 0.4 }}>|</span>}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3HowItWorks({ onNext, onBack }: Step3Props) {
  return (
    <div>
      <h2
        style={{
          fontSize: 28,
          color: "#FFFDF8",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          lineHeight: 1.2,
          marginBottom: 6,
        }}
      >
        Here&apos;s what Venn does for you
      </h2>
      <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 24 }}>
        Three steps. Under 60 seconds. Every time.
      </p>

      <div className="space-y-3">
        {PANELS.map(({ icon, title, body }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.4, ease: "easeOut" }}
            style={{
              background: "#0A0907",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#C4973F10",
                border: "0.5px solid #C4973F30",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 5 }}>
                {title}
              </p>
              <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
                {body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <DemoPreview />

      <button
        onClick={onNext}
        className="w-full py-3 mt-6 rounded transition-opacity hover:opacity-90"
        style={{
          background: "#C4973F",
          color: "#0A0907",
          fontSize: 15,
          fontWeight: 500,
          fontFamily: "var(--font-inter)",
          borderRadius: 8,
          cursor: "pointer",
          border: "none",
        }}
      >
        Got it — show me the dashboard →
      </button>
    </div>
  );
}

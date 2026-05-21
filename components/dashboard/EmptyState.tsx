"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const OPENING_WORDS = [
  "Hey", "Sarah,", "noticed", "Glow", "Aesthetics", "has", "47",
  "reviews", "mentioning", "long", "wait", "times", "—", "want",
  "to", "show", "you", "what", "we'd", "do.",
];

function ShimmerCard({ resolved, resolveProgress }: { resolved: boolean; resolveProgress: number }) {
  const [wordCount, setWordCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!resolved) {
      setWordCount(0);
      return;
    }
    let i = 0;
    function next() {
      i += 1;
      setWordCount(i);
      if (i < OPENING_WORDS.length) {
        timerRef.current = setTimeout(next, 90);
      }
    }
    timerRef.current = setTimeout(next, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [resolved]);

  return (
    <div
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: resolved ? "2px solid #4CAF50" : "2px solid #1E1C18",
        borderRadius: 8,
        padding: 16,
        transition: "border-left-color 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* shimmer overlay */}
      {!resolved && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, #1A181420 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Initials */}
        {resolved ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "#C4973F15", border: "0.5px solid #C4973F40",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 13, fontWeight: 600,
              color: "#C4973F", fontFamily: "var(--font-inter)",
            }}
          >
            GA
          </motion.div>
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1A1814", flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Business name row */}
          <div className="flex items-center justify-between mb-2">
            {resolved ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                  Glow Aesthetics
                </span>
                <span
                  style={{
                    fontSize: 10, fontWeight: 500,
                    background: "#0d2b0d", color: "#4CAF50",
                    border: "0.5px solid #4CAF5030",
                    padding: "2px 8px", borderRadius: 20,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  High intent
                </span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <div style={{ width: 120, height: 13, borderRadius: 4, background: "#1A1814" }} />
                <div style={{ width: 60, height: 13, borderRadius: 10, background: "#1A1814" }} />
              </div>
            )}
            {!resolved && <div style={{ width: 40, height: 11, borderRadius: 4, background: "#1A1814" }} />}
          </div>

          {/* Niche + location */}
          {resolved ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
              Aesthetic clinic · Manchester
            </motion.p>
          ) : (
            <div style={{ width: 160, height: 11, borderRadius: 4, background: "#1A1814", marginBottom: 8 }} />
          )}

          {/* Opening line */}
          {resolved ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 13, color: "#888", fontStyle: "italic",
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                lineHeight: 1.5,
              }}
            >
              &ldquo;{OPENING_WORDS.slice(0, wordCount).join(" ")}{wordCount < OPENING_WORDS.length && <span style={{ opacity: 0.4 }}>|</span>}&rdquo;
            </motion.p>
          ) : (
            <div className="space-y-1.5">
              <div style={{ width: "100%", height: 11, borderRadius: 4, background: "#1A1814" }} />
              <div style={{ width: "75%", height: 11, borderRadius: 4, background: "#1A1814" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GhostCard() {
  return (
    <div
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: "2px solid #1E1C18",
        borderRadius: 8,
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent 0%, #1A181420 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div className="flex items-start gap-3">
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1A1814", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 110, height: 13, borderRadius: 4, background: "#1A1814" }} />
            <div style={{ width: 55, height: 13, borderRadius: 10, background: "#1A1814" }} />
          </div>
          <div style={{ width: 140, height: 11, borderRadius: 4, background: "#1A1814", marginBottom: 8 }} />
          <div className="space-y-1.5">
            <div style={{ width: "100%", height: 11, borderRadius: 4, background: "#1A1814" }} />
            <div style={{ width: "65%", height: 11, borderRadius: 4, background: "#1A1814" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState() {
  const [resolved, setResolved] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function startCycle() {
      // After 2s show resolved card
      cycleRef.current = setTimeout(() => {
        setResolved(true);
        // After the opening line finishes (≈20 words × 90ms + 600ms buffer) shimmer back out
        const lineDuration = OPENING_WORDS.length * 90 + 800;
        cycleRef.current = setTimeout(() => {
          setResolved(false);
          // Wait before next cycle (total cycle ≈ 6s)
          cycleRef.current = setTimeout(startCycle, 1500);
        }, lineDuration);
      }, 2000);
    }
    startCycle();
    return () => { if (cycleRef.current) clearTimeout(cycleRef.current); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 640 }}
      >
        <div className="mb-8">
          <h2
            style={{
              fontSize: 24,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            Your intelligence pipeline starts here.
          </h2>
          <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
            Venn is ready. Tell it who you&apos;re looking for.
          </p>
        </div>

        {/* Ghost cards */}
        <div className="space-y-2 mb-8">
          <ShimmerCard resolved={resolved} resolveProgress={0} />
          <GhostCard />
          <GhostCard />
        </div>

        {/* CTA */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 15,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            borderRadius: 8,
          }}
        >
          Find your first leads →
        </Link>
      </motion.div>
    </>
  );
}

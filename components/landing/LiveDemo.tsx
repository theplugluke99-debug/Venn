"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Line = { text: string; color: string };

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#C4973F", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

export function LiveDemo() {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState<{ text: string; color: string } | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [cardStep, setCardStep] = useState(0);
  const [openingLine, setOpeningLine] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const sleep = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(new Error("aborted"));
      const t = setTimeout(resolve, ms);
      signal.addEventListener("abort", () => { clearTimeout(t); reject(new Error("aborted")); });
    });

  const typeText = async (text: string, color: string, speed: number, signal: AbortSignal) => {
    for (let i = 1; i <= text.length; i++) {
      if (signal.aborted) throw new Error("aborted");
      setTyping({ text: text.slice(0, i), color });
      await sleep(speed, signal);
    }
    setLines((prev) => [...prev, { text, color }]);
    setTyping(null);
  };

  const runSequence = useCallback(async () => {
    const ac = new AbortController();
    abortRef.current = ac;
    const { signal } = ac;

    try {
      setLines([]);
      setTyping(null);
      setShowProgress(false);
      setProgress(0);
      setShowCard(false);
      setCardStep(0);
      setOpeningLine("");
      setCardUrl("");

      await sleep(400, signal);

      await typeText("> Searching aesthetic clinic in Manchester...", "#C4973F", 32, signal);
      await sleep(400, signal);

      await typeText("Found 23 businesses. Pulling data.", "#888580", 32, signal);
      await sleep(300, signal);

      await typeText("Reading 847 Google Reviews...", "#888580", 32, signal);

      setShowProgress(true);
      setProgress(0);
      await sleep(60, signal);
      setProgress(100);
      await sleep(1600, signal);
      setShowProgress(false);

      await typeText("Analysing sentiment. Finding pain signals.", "#888580", 30, signal);
      await sleep(500, signal);

      await typeText("Scoring intent with Claude AI...", "#888580", 30, signal);
      await sleep(500, signal);

      // Morph to card
      setShowCard(true);
      await sleep(600, signal);

      // Card steps: badge, observations, opening line, url
      setCardStep(1);
      await sleep(400, signal);
      setCardStep(2);
      await sleep(300, signal);
      setCardStep(3);

      // Type opening line
      const ol = "Your reviews mention wait times 6 times this month. Your two nearest competitors don't have a single complaint.";
      for (let i = 1; i <= ol.length; i++) {
        if (signal.aborted) throw new Error("aborted");
        setOpeningLine(ol.slice(0, i));
        await sleep(22, signal);
      }

      await sleep(400, signal);

      // Type URL
      const url = "venn.agency/card/glow-aesthetics-mx7k";
      for (let i = 1; i <= url.length; i++) {
        if (signal.aborted) throw new Error("aborted");
        setCardUrl(url.slice(0, i));
        await sleep(14, signal);
      }

      await sleep(3000, signal);

      runSequence();
    } catch {
      // aborted — do nothing
    }
  }, []);

  useEffect(() => {
    runSequence();
    return () => abortRef.current?.abort();
  }, [runSequence]);

  const OBSERVATIONS = ["wait times (6×)", "no mobile booking", "23-day Instagram gap"];

  return (
    <section
      id="the-card"
      style={{
        background: "#0A0907",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Watch it think
        </p>
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 52,
            lineHeight: 1.1,
          }}
        >
          Intelligence first.
          <br />
          Everything else follows.
        </h2>

        {/* Terminal container */}
        <div
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #C4973F",
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "0.5px solid #1E1C18",
              gap: 6,
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
            <span
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 11,
                color: "#444440",
                fontFamily: "monospace",
              }}
            >
              venn — intelligence engine
            </span>
          </div>

          {/* Terminal body / Card (shared container, cross-fade) */}
          <div style={{ position: "relative", minHeight: 280 }}>
            {/* Terminal view */}
            <AnimatePresence>
              {!showCard && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ padding: "20px 24px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7 }}
                >
                  {lines.map((l, i) => (
                    <p key={i} style={{ color: l.color, margin: 0 }}>
                      {l.text}
                    </p>
                  ))}
                  {typing && (
                    <p style={{ color: typing.color, margin: 0 }}>
                      {typing.text}
                      <span
                        style={{
                          display: "inline-block",
                          width: 7,
                          height: 13,
                          background: "#C4973F",
                          marginLeft: 1,
                          verticalAlign: "text-bottom",
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    </p>
                  )}
                  {showProgress && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ background: "#1E1C18", borderRadius: 2, height: 3, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            background: "#C4973F",
                            width: `${progress}%`,
                            transition: "width 1.5s linear",
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card view */}
            <AnimatePresence>
              {showCard && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ padding: "24px 28px" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-instrument-serif), Georgia, serif",
                          fontSize: 22,
                          color: "#FFFDF8",
                          marginBottom: 2,
                        }}
                      >
                        Glow Aesthetics
                      </p>
                      <p style={{ fontSize: 12, color: "#888580" }}>Manchester · Aesthetic Clinic</p>
                    </div>
                    <AnimatePresence>
                      {cardStep >= 1 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            padding: "4px 10px",
                            borderRadius: 4,
                            background: "#0d2b0d",
                            color: "#4CAF50",
                          }}
                        >
                          HIGH INTENT
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Stars rating={4.1} />
                    <span style={{ fontSize: 12, color: "#888580" }}>4.1 (87 reviews)</span>
                  </div>

                  {cardStep >= 2 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {OBSERVATIONS.map((obs, i) => (
                        <motion.span
                          key={obs}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 4,
                            border: "0.5px solid #2A2826",
                            color: "#888580",
                          }}
                        >
                          {obs}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {cardStep >= 3 && openingLine && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 13, color: "#FFFDF8", fontStyle: "italic", lineHeight: 1.6 }}>
                        &ldquo;{openingLine}
                        {openingLine.length < 107 && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 12,
                              background: "#C4973F",
                              marginLeft: 1,
                              verticalAlign: "text-bottom",
                              animation: "blink 1s step-end infinite",
                            }}
                          />
                        )}
                        {openingLine.length >= 107 && '"'}
                      </p>
                    </div>
                  )}

                  {cardUrl && (
                    <p style={{ fontSize: 12, color: "#C4973F", fontFamily: "monospace" }}>
                      {cardUrl}
                      {cardUrl.length < 38 && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 11,
                            background: "#C4973F",
                            marginLeft: 1,
                            verticalAlign: "text-bottom",
                            animation: "blink 1s step-end infinite",
                          }}
                        />
                      )}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "#888580",
            textAlign: "center",
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          This is what happens when you search. Every time. In 60 seconds.
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, SectionHeader, colours, motionPresets } from "./system";

const STEPS = [
  { label: "Search", detail: "Aesthetic clinics · Manchester" },
  { label: "Review analysis", detail: "847 reviews read for repeated friction" },
  { label: "Intent scoring", detail: "Wait time and booking issues detected" },
  { label: "Opening line", detail: "Personalised from real evidence" },
  { label: "Card generation", detail: "Private prospect card created" },
];

const LOGS = [
  "search: aesthetic clinic in Manchester",
  "23 businesses found · normalising profiles",
  "reviews: 847 loaded from Google",
  "signal: wait times mentioned 6 times this month",
  "signal: mobile booking friction found",
  "intent score: HIGH",
  "opening line generated",
  "card: venn.agency/card/glow-aesthetics-mx7k",
];

export function LiveDemo() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % STEPS.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <Section id="the-card" tone="primary">
      <div className="venn-container">
        <SectionHeader
          eyebrow="Live intelligence"
          title={
            <>
              It thinks before
              <br />
              it writes.
            </>
          }
          subline="Search, review analysis, intent scoring, opening line generation and card creation happen as one calm workflow."
        />

        <Reveal>
          <div className="live-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "0.92fr 1.08fr", alignItems: "stretch" }}>
            <div className="venn-card" style={{ padding: 24 }}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
                <span className="venn-eyebrow">Engine</span>
                <span
                  style={{
                    border: `0.5px solid ${colours.goldBorder}`,
                    borderRadius: 999,
                    color: colours.gold,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    padding: "6px 10px",
                  }}
                >
                  HIGH INTENT
                </span>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                {STEPS.map((step, index) => {
                  const isActive = index === active;
                  const isPast = reduceMotion || index < active;
                  return (
                    <button
                      key={step.label}
                      type="button"
                      onClick={() => setActive(index)}
                      style={{
                        background: isActive ? "rgba(196,151,63,0.07)" : "transparent",
                        border: `0.5px solid ${isActive ? colours.goldBorder : colours.border}`,
                        borderRadius: 8,
                        cursor: "pointer",
                        padding: "15px 16px",
                        textAlign: "left",
                        transition: "background 320ms var(--venn-ease), border-color 320ms var(--venn-ease)",
                      }}
                    >
                      <span style={{ alignItems: "center", display: "flex", gap: 12 }}>
                        <span
                          style={{
                            background: isActive || isPast ? colours.gold : "#24211c",
                            borderRadius: "50%",
                            boxShadow: isActive ? "0 0 20px rgba(196,151,63,0.26)" : "none",
                            height: 7,
                            width: 7,
                          }}
                        />
                        <span>
                          <span style={{ color: isActive ? colours.ivory : colours.secondary, display: "block", fontSize: 14, marginBottom: 4 }}>
                            {step.label}
                          </span>
                          <span style={{ color: colours.muted, display: "block", fontSize: 12, lineHeight: 1.45 }}>{step.detail}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="venn-card terminal-card" style={{ overflow: "hidden" }}>
              <div style={{ alignItems: "center", borderBottom: `0.5px solid ${colours.border}`, display: "flex", gap: 8, padding: "13px 18px" }}>
                <span style={{ background: "#3a3224", borderRadius: "50%", height: 7, width: 7 }} />
                <span style={{ background: "#604b22", borderRadius: "50%", height: 7, width: 7 }} />
                <span style={{ background: colours.gold, borderRadius: "50%", height: 7, width: 7 }} />
                <span style={{ color: colours.muted, flex: 1, fontFamily: "monospace", fontSize: 11, textAlign: "center" }}>venn intelligence layer</span>
              </div>

              <div style={{ display: "grid", gap: 18, padding: 24 }}>
                <div style={{ background: "#0A0907", border: `0.5px solid ${colours.border}`, borderRadius: 8, minHeight: 206, padding: 18 }}>
                  {LOGS.slice(0, active + 4).map((line, index) => (
                    <motion.p
                      key={`${line}-${index}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={reduceMotion ? undefined : { opacity: index === active + 3 ? 1 : 0.54, y: 0 }}
                      transition={motionPresets.soft}
                      style={{
                        color: index === active + 3 ? colours.ivory : colours.secondary,
                        fontFamily: "monospace",
                        fontSize: 12,
                        lineHeight: 1.8,
                      }}
                    >
                      <span style={{ color: colours.gold }}>›</span> {line}
                    </motion.p>
                  ))}
                </div>

                <div className="mini-card" style={{ border: `0.5px solid ${colours.goldBorder}`, borderRadius: 8, padding: 18 }}>
                  <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                    <div>
                      <p style={{ color: colours.ivory, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 24 }}>Glow Aesthetics</p>
                      <p style={{ color: colours.muted, fontSize: 12 }}>Manchester · Aesthetic Clinic</p>
                    </div>
                    <span style={{ color: colours.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>READY</span>
                  </div>
                  <p style={{ color: colours.secondary, fontSize: 13, lineHeight: 1.7 }}>
                    “Your reviews mention wait times 6 times this month. Your two nearest competitors don&apos;t have a single complaint.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .live-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .terminal-card { margin-left: -2px; margin-right: -2px; }
        }
      `}</style>
    </Section>
  );
}

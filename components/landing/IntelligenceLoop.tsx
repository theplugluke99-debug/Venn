"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, SectionHeader, colours, motionPresets } from "./system";

const SIGNALS = [
  "Card opened",
  "Revenue section viewed",
  "Reply button hovered",
  "Returned after 11 minutes",
];

export function IntelligenceLoop() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % SIGNALS.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <Section id="intelligence" tone="primary">
      <div className="venn-container">
        <SectionHeader
          eyebrow="The intelligence loop"
          title={
            <>
              You know when
              <br />
              they&apos;re reading it.
            </>
          }
          subline="Before they&apos;ve said a word."
        />

        <Reveal>
          <div className="loop-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>
            <div className="venn-card" style={{ padding: 26 }}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                <span className="venn-eyebrow">Prospect activity</span>
                <span style={{ color: colours.gold, fontFamily: "monospace", fontSize: 12 }}>live</span>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                {SIGNALS.map((signal, index) => {
                  const isActive = index === active;
                  return (
                    <motion.div
                      key={signal}
                      animate={{ opacity: isActive ? 1 : 0.44 }}
                      transition={motionPresets.soft}
                      style={{
                        alignItems: "center",
                        border: `0.5px solid ${isActive ? colours.goldBorder : colours.border}`,
                        borderRadius: 8,
                        display: "grid",
                        gap: 14,
                        gridTemplateColumns: "72px 1fr auto",
                        padding: "15px 16px",
                      }}
                    >
                      <span style={{ color: colours.muted, fontFamily: "monospace", fontSize: 12 }}>
                        0:{String(18 + index * 9).padStart(2, "0")}
                      </span>
                      <span style={{ color: colours.ivory, fontSize: 14 }}>{signal}</span>
                      <span style={{ background: isActive ? colours.gold : "#25211a", borderRadius: "50%", boxShadow: isActive ? "0 0 18px rgba(196,151,63,0.24)" : "none", height: 7, width: 7 }} />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="venn-card" style={{ display: "grid", padding: 26 }}>
              <div style={{ alignSelf: "start" }}>
                <p className="venn-eyebrow" style={{ marginBottom: 24 }}>Hot lead state</p>
                <div style={{ background: "#0A0907", border: `0.5px solid ${colours.border}`, borderRadius: 8, padding: 22 }}>
                  <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
                    <div>
                      <p style={{ color: colours.ivory, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 30 }}>Glow Aesthetics</p>
                      <p style={{ color: colours.muted, fontSize: 12 }}>Sarah M. · opened twice</p>
                    </div>
                    <span style={{ border: `0.5px solid ${colours.goldBorder}`, borderRadius: 999, color: colours.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", padding: "6px 9px" }}>
                      WARM
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    {["Read the evidence", "Paused on opportunity", "Returned to reply"].map((item, index) => (
                      <div key={item} style={{ alignItems: "center", display: "grid", gap: 12, gridTemplateColumns: "1fr 90px" }}>
                        <span style={{ color: colours.secondary, fontSize: 13 }}>{item}</span>
                        <span style={{ background: "#17140f", borderRadius: 999, display: "block", height: 5, overflow: "hidden" }}>
                          <motion.span
                            animate={{ width: `${[92, 76, 58][index]}%` }}
                            transition={{ ...motionPresets.slow, delay: index * 0.12 }}
                            style={{ background: colours.gold, display: "block", height: "100%" }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ alignSelf: "end", color: colours.muted, fontSize: 12, lineHeight: 1.7, marginTop: 22 }}>
                Calm signal, not vanity analytics. Enough to know when a conversation is becoming real.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .loop-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .loop-grid [style*="grid-template-columns: 72px"] {
            grid-template-columns: 52px 1fr auto !important;
          }
        }
      `}</style>
    </Section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TRUTHS = [
  {
    num: "01",
    line1: "Apollo gives you a database.",
    line2: "You do the thinking.",
  },
  {
    num: "02",
    line1: "Clay enriches your data.",
    line2: "You still write every word.",
  },
  {
    num: "03",
    line1: "Templates get ignored.",
    line2: "Prospects always know.",
  },
];

function StickyTruths() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const op0 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.55], [1, 1, 0.15, 0.15]);
  const op1 = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.72], [0.15, 1, 1, 0.15]);
  const op2 = useTransform(scrollYProgress, [0.55, 0.72, 1, 1], [0.15, 1, 1, 1]);

  const opacities = [op0, op1, op2];

  return (
    <div ref={ref} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {TRUTHS.map((t, i) => (
          <motion.div
            key={i}
            style={{ opacity: opacities[i] }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                paddingBottom: i < 2 ? 56 : 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                  fontSize: 13,
                  color: "#444440",
                  minWidth: 28,
                  paddingTop: 8,
                }}
              >
                {t.num}
              </span>
              <div
                style={{
                  width: 32,
                  height: 1,
                  backgroundColor: "#C4973F",
                  flexShrink: 0,
                  marginTop: 20,
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    fontSize: "clamp(28px, 3.2vw, 40px)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: "#FFFDF8",
                    margin: 0,
                  }}
                >
                  {t.line1}
                  <br />
                  {t.line2}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            position: "absolute",
            bottom: 48,
            left: "50%",
            translateX: "-50%",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              fontSize: 10,
              color: "#444440",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Scroll to continue
          </p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="#444440" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export function NamedPain() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#0F0E0B",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      {/* Section header */}
      <div style={{ padding: "120px 40px 80px", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          02 / The Named Pain
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            fontWeight: 400,
            color: "#FFFDF8",
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Outreach is broken.
          <br />
          <em>You already know.</em>
        </motion.h2>
      </div>

      {/* Sticky truths — desktop */}
      <div className="named-pain-sticky">
        <StickyTruths />
      </div>

      {/* Stacked truths — mobile fallback */}
      <div className="named-pain-mobile" style={{ padding: "0 24px 80px" }}>
        {TRUTHS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 48 }}
          >
            <span style={{ fontSize: 12, color: "#444440", minWidth: 24, paddingTop: 6 }}>{t.num}</span>
            <div style={{ width: 24, height: 1, backgroundColor: "#C4973F", marginTop: 18, flexShrink: 0 }} />
            <p
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.15,
                color: "#FFFDF8",
                margin: 0,
              }}
            >
              {t.line1}
              <br />
              {t.line2}
            </p>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (min-width: 769px) { .named-pain-mobile { display: none !important; } }
        @media (max-width: 768px) { .named-pain-sticky { display: none !important; } }
      `}</style>
    </section>
  );
}

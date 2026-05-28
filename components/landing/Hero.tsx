"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CTA, VennLogo, colours, motionPresets } from "./system";

const HEADLINE_LINES = [
  "The clients you need",
  "are already out there.",
  "Venn knows exactly",
  "who they are.",
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="hero-section"
      style={{
        alignItems: "center",
        background: colours.bg,
        display: "flex",
        minHeight: "min(900px, 100svh)",
        overflow: "hidden",
        padding: "96px 24px 56px",
        position: "relative",
      }}
    >
      <motion.div
        className="hero-bg-mark"
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ ...motionPresets.slow, delay: 0.15 }}
        style={{
          filter: "drop-shadow(0 0 42px rgba(196,151,63,0.10))",
          left: "64%",
          opacity: 0.82,
          position: "absolute",
          top: "57%",
          transform: "translate(-50%, -50%)",
          width: "min(760px, 74vw)",
          zIndex: 0,
        }}
      >
        <VennLogo variant="mark" size={520} decorative style={{ opacity: 0.58 }} />
      </motion.div>

      <div className="venn-container-narrow" style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        <motion.div
          className="hero-logo"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ ...motionPresets.soft, delay: 0.05 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(74px, 13vh, 122px)" }}
        >
          <VennLogo size={30} variant="horizontal" />
        </motion.div>

        <h1 className="venn-heading" style={{ margin: "0 auto 28px", maxWidth: 760 }}>
          {HEADLINE_LINES.map((line, lineIndex) => (
            <span key={line} style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ ...motionPresets.slow, delay: 0.38 + lineIndex * 0.12 }}
                style={{ display: "block" }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="venn-copy"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          style={{ margin: "0 auto 38px", maxWidth: 510 }}
        >
          Find them. Know what&apos;s broken in their business.
          <br />
          Say exactly the right thing. Win.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "18px 28px", justifyContent: "center" }}
        >
          <CTA href="/sign-up">Start finding clients</CTA>
          <CTA href="#how-it-works" variant="secondary">See how it works →</CTA>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .hero-section {
            min-height: 820px !important;
            padding-top: 76px !important;
          }
          .hero-bg-mark {
            left: 92% !important;
            opacity: 0.44 !important;
            top: 62% !important;
            width: 520px !important;
          }
          .venn-container-narrow > div:first-child {
            margin-bottom: 76px !important;
          }
          .hero-actions {
            align-items: center !important;
            flex-direction: column !important;
            gap: 18px !important;
          }
          .hero-actions .venn-cta-primary {
            width: min(100%, 220px);
          }
          .hero-actions .venn-cta-secondary {
            white-space: normal;
          }
          .hero-section .venn-copy {
            max-width: 300px !important;
          }
        }
        @media (max-width: 430px) {
          .hero-bg-mark {
            opacity: 0.26 !important;
            transform: translate(-50%, -50%) scale(0.82) !important;
          }
        }
      `}</style>
    </section>
  );
}

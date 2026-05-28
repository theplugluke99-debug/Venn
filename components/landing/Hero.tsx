"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CTA, VennLogo, colours, motionPresets } from "./system";

const HEADLINE_LINES = [
  "The clients you need",
  "are already out there.",
  "Venn knows exactly",
  "who they are.",
];

const LENS_PATH = "M65.4 18A30 30 0 0 1 65.4 62A24 24 0 0 0 65.4 18Z";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-cinematic">
      <motion.svg
        aria-hidden
        className="hero-venn-field"
        viewBox="0 0 120 80"
        preserveAspectRatio="xMidYMid meet"
        initial={reduceMotion ? false : "start"}
        animate={reduceMotion ? "settled" : "settled"}
      >
        <defs>
          <radialGradient id="hero-lens-gold" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#FFF5CD" />
            <stop offset="35%" stopColor="#E0AD48" />
            <stop offset="100%" stopColor="#C4973F" />
          </radialGradient>
          <radialGradient id="hero-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4973F" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C4973F" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-lens-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.8" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.77 0 1 0 0 0.59 0 0 1 0 0.25 0 0 0 0.8 0" />
            <feBlend in="SourceGraphic" />
          </filter>
        </defs>

        <motion.circle
          cx="45"
          cy="40"
          r="30"
          fill="none"
          stroke={colours.gold}
          strokeWidth="0.42"
          variants={{ start: { x: -56, opacity: 0.38 }, settled: { x: 0, opacity: 0.92 } }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        <motion.circle
          cx="75"
          cy="40"
          r="24"
          fill="none"
          stroke={colours.gold}
          strokeWidth="0.42"
          variants={{ start: { x: 55, opacity: 0.38 }, settled: { x: 0, opacity: 0.92 } }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        <motion.circle
          cx="65.4"
          cy="40"
          r="20"
          fill="url(#hero-ambient)"
          variants={{ start: { opacity: 0, scale: 0.55 }, settled: { opacity: 1, scale: 1 } }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 2.55 }}
        />
        <motion.path
          d={LENS_PATH}
          fill="url(#hero-lens-gold)"
          filter="url(#hero-lens-glow)"
          variants={{ start: { opacity: 0, scale: 0.9 }, settled: { opacity: 1, scale: 1 } }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 2.42 }}
          style={{ transformOrigin: "65.4px 40px" }}
        />
        <motion.rect
          x="26"
          y="39.82"
          width="80"
          height="0.36"
          fill="url(#hero-ambient)"
          variants={{ start: { opacity: 0, scaleX: 0 }, settled: { opacity: 0.82, scaleX: 1 } }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 2.7 }}
          style={{ transformOrigin: "65.4px 40px" }}
        />
      </motion.svg>

      <div className="hero-noise" aria-hidden />

      <div className="hero-inner">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ ...motionPresets.soft, delay: 0.5 }}
          className="hero-brand"
        >
          <VennLogo size={33} variant="horizontal" />
        </motion.div>

        <div className="hero-copy">
          <h1 className="venn-heading hero-title">
            {HEADLINE_LINES.map((line, index) => (
              <span key={line} style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...motionPresets.slow, delay: reduceMotion ? 0 : 1.15 + index * 0.08 }}
                  style={{ display: "block" }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="venn-copy hero-subcopy"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionPresets.soft, delay: reduceMotion ? 0 : 1.55 }}
          >
            Find them. Know what&apos;s broken in their business.
            <br />
            Say exactly the right thing. Win.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionPresets.soft, delay: reduceMotion ? 0 : 1.8 }}
          >
            <CTA href="/sign-up">Start finding clients</CTA>
            <CTA href="#how-it-works" variant="secondary">See how it works →</CTA>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-cinematic {
          align-items: center;
          background: radial-gradient(circle at 50% 45%, rgba(196,151,63,0.08), transparent 34%), ${colours.bg};
          display: flex;
          min-height: 100svh;
          overflow: hidden;
          padding: 88px 24px 58px;
          position: relative;
          text-align: center;
        }
        .hero-venn-field {
          height: 100%;
          inset: 0;
          position: absolute;
          transform: translateY(-38%) scale(0.92);
          width: 100%;
          z-index: 0;
        }
        .hero-noise {
          background-image: radial-gradient(rgba(255,253,248,0.06) 0.5px, transparent 0.5px);
          background-size: 3px 3px;
          inset: 0;
          opacity: 0.09;
          position: absolute;
          z-index: 0;
        }
        .hero-inner {
          margin: 0 auto;
          max-width: 940px;
          position: relative;
          width: min(100%, 940px);
          z-index: 1;
        }
        .hero-brand {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(128px, 19vh, 182px);
        }
        .hero-copy {
          margin: 0 auto;
          max-width: 760px;
        }
        .hero-title {
          font-size: clamp(46px, 6vw, 78px);
          margin-bottom: 30px;
        }
        .hero-subcopy {
          margin: 0 auto 36px;
          max-width: 530px;
        }
        .hero-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 18px 30px;
          justify-content: center;
        }
        @media (max-width: 760px) {
          .hero-cinematic {
            min-height: 860px;
            padding-top: 74px;
          }
          .hero-brand {
            margin-bottom: 120px;
          }
          .hero-venn-field {
            transform: translateY(-34%) scale(1.06);
          }
          .hero-title {
            font-size: clamp(42px, 12vw, 58px);
          }
          .hero-subcopy {
            max-width: 320px;
          }
          .hero-actions {
            flex-direction: column;
            gap: 18px;
          }
          .hero-actions .venn-cta-primary {
            width: min(100%, 230px);
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CTA, colours, motionPresets } from "./system";

const HEADLINE_LINES = [
  "The clients you need",
  "are already out there.",
  "Venn knows exactly",
  "who they are.",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const leftScrollX = useTransform(scrollYProgress, [0, 0.84], [0, -58]);
  const rightScrollX = useTransform(scrollYProgress, [0, 0.84], [0, 58]);
  const lensScrollOpacity = useTransform(scrollYProgress, [0, 0.38, 0.72], [1, 0.62, 0]);
  const flareScrollScale = useTransform(scrollYProgress, [0, 0.84], [1, 0.12]);
  const fieldScrollOpacity = useTransform(scrollYProgress, [0, 0.86], [1, 0.24]);

  return (
    <section ref={ref} className="hero-cinematic">
      <motion.svg
        aria-hidden
        className="hero-venn-field"
        viewBox="0 0 180 92"
        preserveAspectRatio="xMidYMid meet"
        initial={reduceMotion ? false : "start"}
        animate={reduceMotion ? "settled" : "settled"}
        style={{ opacity: reduceMotion ? 1 : fieldScrollOpacity }}
      >
        <defs>
          <clipPath id="hero-left-circle-clip">
            <circle cx="58" cy="46" r="43" />
          </clipPath>
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

        <motion.g style={{ x: reduceMotion ? 0 : leftScrollX }}>
          <motion.circle
            cx="58"
            cy="46"
            r="43"
            fill="none"
            stroke={colours.gold}
            strokeWidth="0.34"
            variants={{ start: { x: -88, opacity: 0.34 }, settled: { x: 0, opacity: 0.92 } }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          />
        </motion.g>
        <motion.g style={{ x: reduceMotion ? 0 : rightScrollX }}>
          <motion.circle
            cx="118"
            cy="46"
            r="35"
            fill="none"
            stroke={colours.gold}
            strokeWidth="0.34"
            variants={{ start: { x: 88, opacity: 0.34 }, settled: { x: 0, opacity: 0.92 } }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          />
        </motion.g>
        <motion.g
          variants={{ start: { opacity: 0, scale: 0.55 }, settled: { opacity: 1, scale: 1 } }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 2.12 }}
          style={{ opacity: reduceMotion ? 1 : lensScrollOpacity, transformOrigin: "89px 46px" }}
        >
          <circle cx="89" cy="46" r="11" fill="url(#hero-ambient)" />
          <circle
            cx="118"
            cy="46"
            r="35"
            fill="url(#hero-lens-gold)"
            clipPath="url(#hero-left-circle-clip)"
            filter="url(#hero-lens-glow)"
          />
        </motion.g>
        <motion.g
          variants={{ start: { opacity: 0 }, settled: { opacity: 0.82 } }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 2.7 }}
          style={{ opacity: reduceMotion ? 0.82 : lensScrollOpacity }}
        >
          <motion.rect
            x="64"
            y="45.82"
            width="50"
            height="0.34"
            fill="url(#hero-ambient)"
            style={{ scaleX: reduceMotion ? 1 : flareScrollScale, transformOrigin: "89px 46px" }}
          />
        </motion.g>
      </motion.svg>

      <div className="hero-noise" aria-hidden />

      <div className="hero-inner">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ ...motionPresets.soft, delay: 0.5 }}
          className="hero-brand"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/venn-logo.svg" alt="Venn" style={{ height: 33, width: "auto", display: "block" }} />
        </motion.div>

        <div className="hero-copy">
          <h1 className="venn-heading hero-title">
            {HEADLINE_LINES.map((line, index) => (
              <span key={line} style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
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
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionPresets.soft, delay: reduceMotion ? 0 : 1.55 }}
          >
            Find them. Know what&apos;s broken in their business.
            <br />
            Say exactly the right thing. Win.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
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
          align-items: stretch;
          background: radial-gradient(circle at 50% 45%, rgba(196,151,63,0.08), transparent 34%), ${colours.bg};
          display: flex;
          min-height: 108svh;
          overflow: hidden;
          padding: 118px 24px 70px;
          position: relative;
          text-align: center;
        }
        .hero-venn-field {
          height: min(42svh, 390px);
          left: 50%;
          position: absolute;
          top: clamp(126px, 15vh, 160px);
          transform: translateX(-50%);
          width: min(1360px, 116vw);
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
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin: 0 auto;
          max-width: 940px;
          position: relative;
          width: min(100%, 940px);
          z-index: 1;
        }
        .hero-brand {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(280px, 34vh, 350px);
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
            min-height: 900px;
            padding-top: 92px;
          }
          .hero-brand {
            margin-bottom: 288px;
          }
          .hero-venn-field {
            height: 260px;
            top: 128px;
            transform: translateX(-50%);
            width: 640px;
          }
          .hero-title {
            font-size: clamp(34px, 10vw, 44px);
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

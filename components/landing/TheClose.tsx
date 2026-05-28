"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CTA, colours, motionPresets } from "./system";

const LENS_PATH = "M65.4 18A30 30 0 0 1 65.4 62A24 24 0 0 0 65.4 18Z";

export function TheClose() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const leftX = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const lensOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.55, 0]);
  const flareScale = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section id="close" ref={ref} className="closing-cinematic">
      <motion.svg className="closing-field" aria-hidden viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="close-gold" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#FFF5CD" />
            <stop offset="45%" stopColor="#E0AD48" />
            <stop offset="100%" stopColor="#C4973F" />
          </radialGradient>
          <radialGradient id="close-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4973F" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C4973F" stopOpacity="0" />
          </radialGradient>
          <filter id="close-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.8" />
          </filter>
        </defs>
        <motion.circle cx="45" cy="40" r="30" fill="none" stroke={colours.gold} strokeWidth="0.44" style={{ x: reduceMotion ? 0 : leftX }} />
        <motion.circle cx="75" cy="40" r="24" fill="none" stroke={colours.gold} strokeWidth="0.44" style={{ x: reduceMotion ? 0 : rightX }} />
        <motion.circle cx="65.4" cy="40" r="20" fill="url(#close-ambient)" style={{ opacity: reduceMotion ? 0.6 : lensOpacity }} />
        <motion.path d={LENS_PATH} fill="url(#close-gold)" filter="url(#close-glow)" style={{ opacity: reduceMotion ? 0.9 : lensOpacity, transformOrigin: "65.4px 40px" }} />
        <motion.rect x="28" y="39.85" width="76" height="0.3" fill="url(#close-ambient)" style={{ opacity: reduceMotion ? 0.65 : lensOpacity, scaleX: reduceMotion ? 1 : flareScale, transformOrigin: "65.4px 40px" }} />
      </motion.svg>

      <div className="venn-container-narrow closing-content">
        <motion.h2
          className="venn-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={motionPresets.slow}
        >
          Your next client
          <br />
          is already out there.
        </motion.h2>
        <motion.p
          className="venn-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ ...motionPresets.soft, delay: 0.12 }}
        >
          Venn knows who they are. What&apos;s broken in their business.
          And exactly what you should say.
        </motion.p>
        <motion.div
          className="closing-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ ...motionPresets.soft, delay: 0.22 }}
        >
          <CTA href="/sign-up">Start finding clients today</CTA>
          <CTA href="/solopreneur" variant="secondary">Apply for solopreneur access →</CTA>
        </motion.div>
      </div>

      <style>{`
        .closing-cinematic {
          align-items: center;
          background: ${colours.bg};
          border-top: 0.5px solid ${colours.border};
          display: flex;
          min-height: 92svh;
          overflow: hidden;
          padding: var(--venn-section-y) 24px;
          position: relative;
          text-align: center;
        }
        .closing-field {
          height: min(82%, 680px);
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(1380px, 112vw);
          z-index: 0;
        }
        .closing-content {
          position: relative;
          z-index: 1;
        }
        .closing-content h2 {
          margin-bottom: 24px;
        }
        .closing-content p {
          margin: 0 auto 42px;
          max-width: 530px;
        }
        .closing-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 18px 28px;
          justify-content: center;
        }
        @media (max-width: 720px) {
          .closing-cinematic {
            min-height: 760px;
          }
          .closing-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

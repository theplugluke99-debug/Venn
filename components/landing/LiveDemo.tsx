"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CTA, Reveal, Section, VennLogo, colours, motionPresets } from "./system";

const LOGS = [
  "Searching aesthetic clinic Manchester...",
  "Scanning reviews, ratings, and sentiment...",
  "Analysing booking experience...",
  "Checking competitor landscape...",
  "Mapping revenue indicators...",
  "Building intent profile...",
  "Generating opening line...",
  "Compiling personalised card...",
];

const SIGNALS = [
  ["Wait times", "mentioned 6x", "↑ 5x vs. avg clinic"],
  ["Booking friction", "on mobile", "23% drop-off"],
  ["Strong reviews", "overall", "4.6★ average"],
];

export function LiveDemo() {
  const [active, setActive] = useState(0);
  const [complete, setComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setComplete(true);
      return;
    }
    setActive(0);
    setComplete(false);
    const timer = window.setInterval(() => {
      setActive((value) => {
        if (value >= LOGS.length - 1) {
          window.clearInterval(timer);
          window.setTimeout(() => setComplete(true), 420);
          return value;
        }
        return value + 1;
      });
    }, 620);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const progress = reduceMotion ? 100 : Math.min(100, Math.round(((active + 1) / LOGS.length) * 100));

  return (
    <Section id="the-card" tone="primary" className="live-demo-cinema">
      <div className="venn-container">
        <Reveal>
          <div className="section-title">
            <p className="venn-eyebrow">03 / The live intelligence demo</p>
            <h2 className="venn-heading-md">Watch Venn think in real time.</h2>
            <p className="venn-copy">From raw signals to a personalised opening line in seconds.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="intelligence-stage">
            <div className="terminal-panel">
              <div className="terminal-top">
                <span />
                <span />
                <span />
                <p>venn@system</p>
              </div>
              <div className="terminal-body">
                {LOGS.map((line, index) => {
                  const visible = reduceMotion || index <= active;
                  const current = index === active;
                  return (
                    <motion.p
                      key={line}
                      animate={{ opacity: visible ? (current ? 1 : 0.72) : 0.12 }}
                      transition={motionPresets.soft}
                    >
                      <span>›</span> {line}
                    </motion.p>
                  );
                })}
                <p className="cursor-line"><span>›</span> <i /></p>
              </div>
              <div className="terminal-progress">
                <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.55, ease: "linear" }} />
                <strong>{progress}%</strong>
              </div>
            </div>

            <motion.div
              className="signal-arrow"
              aria-hidden
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={complete ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.4 }}
              transition={{ ...motionPresets.soft, duration: 0.7 }}
            >
              →
            </motion.div>

            <motion.div
              className="crystal-panel"
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={
                complete
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 24, filter: "blur(10px)" }
              }
              transition={{ ...motionPresets.slow, delay: 0.1 }}
            >
              <div className="crystal-head">
                <VennLogo size={34} variant="horizontal" />
                <span><i /> HIGH INTENT</span>
              </div>
              <p className="venn-eyebrow">Aesthetic clinic · Manchester</p>
              <h3>
                Your reviews mention wait times
                <em> 6 times </em>
                this month...
              </h3>
              <div className="signal-grid">
                {SIGNALS.map(([title, value, note], index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...motionPresets.soft, delay: 0.18 + index * 0.08 }}
                  >
                    <b>{title}</b>
                    <span>{value}</span>
                    <small>{note}</small>
                  </motion.div>
                ))}
              </div>
              <div className="card-peek">
                <VennLogo size={20} variant="mark" decorative />
                <span>Momentum Agency</span>
                <strong>Glow Aesthetics</strong>
              </div>
              <CTA href="#prospect-card">See what they receive →</CTA>
            </motion.div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .live-demo-cinema {
          background:
            radial-gradient(circle at 50% 58%, rgba(196,151,63,0.12), transparent 36%),
            ${colours.bg} !important;
          overflow: hidden;
        }
        .section-title {
          margin: 0 auto 58px;
          max-width: 800px;
          text-align: center;
        }
        .section-title .venn-eyebrow,
        .section-title h2 {
          margin-bottom: 18px;
        }
        .intelligence-stage {
          align-items: center;
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(0, 0.92fr) 34px minmax(0, 1.08fr);
        }
        .terminal-panel,
        .crystal-panel {
          backdrop-filter: blur(18px);
          background: rgba(15,14,11,0.78);
          border: 0.5px solid rgba(255,253,248,0.16);
          border-radius: 12px;
          box-shadow: 0 30px 110px rgba(0,0,0,0.34);
          min-height: 520px;
          overflow: hidden;
        }
        .terminal-top {
          align-items: center;
          border-bottom: 0.5px solid ${colours.border};
          display: flex;
          gap: 10px;
          padding: 19px 24px;
        }
        .terminal-top span {
          border-radius: 50%;
          height: 11px;
          width: 11px;
        }
        .terminal-top span:nth-child(1) { background: #e95353; }
        .terminal-top span:nth-child(2) { background: #dca84d; }
        .terminal-top span:nth-child(3) { background: #49a765; }
        .terminal-top p {
          color: ${colours.secondary};
          font-family: monospace;
          font-size: 15px;
          margin-left: 24px;
        }
        .terminal-body {
          display: grid;
          gap: 17px;
          padding: 30px 32px 22px;
        }
        .terminal-body p {
          color: ${colours.ivory};
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 15px;
          line-height: 1.35;
        }
        .terminal-body span,
        .terminal-body p:nth-last-child(3) {
          color: ${colours.gold};
        }
        .cursor-line i {
          animation: blink-cursor 900ms steps(2) infinite;
          background: ${colours.gold};
          display: inline-block;
          height: 18px;
          vertical-align: -3px;
          width: 9px;
        }
        .terminal-progress {
          align-items: center;
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr auto;
          padding: 20px 32px 34px;
        }
        .terminal-progress span {
          background: linear-gradient(90deg, #9f762e, #f1c465);
          border-radius: 999px;
          display: block;
          height: 10px;
        }
        .terminal-progress strong {
          color: ${colours.gold};
          font-size: 16px;
          font-weight: 500;
        }
        .signal-arrow {
          color: ${colours.gold};
          filter: drop-shadow(0 0 18px rgba(196,151,63,0.6));
          font-size: 44px;
          text-align: center;
        }
        .crystal-panel {
          border-color: ${colours.goldBorder};
          padding: 34px;
          position: relative;
        }
        .crystal-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 42px;
        }
        .crystal-head > span {
          align-items: center;
          background: rgba(255,253,248,0.06);
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 999px;
          color: ${colours.ivory};
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          gap: 9px;
          letter-spacing: 0.12em;
          padding: 10px 16px;
        }
        .crystal-head i {
          background: #56d15f;
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(86,209,95,0.5);
          height: 10px;
          width: 10px;
        }
        .crystal-panel h3 {
          border-bottom: 0.5px solid ${colours.goldBorder};
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 400;
          line-height: 1.08;
          margin: 22px 0 28px;
          padding-bottom: 26px;
        }
        .crystal-panel h3 em {
          color: ${colours.gold};
          font-style: normal;
        }
        .signal-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, 1fr);
          margin-bottom: 30px;
        }
        .signal-grid div {
          display: grid;
          gap: 7px;
        }
        .signal-grid b,
        .signal-grid span {
          color: ${colours.ivory};
          font-size: 13px;
          font-weight: 500;
        }
        .signal-grid small {
          color: ${colours.secondary};
          font-size: 12px;
        }
        .card-peek {
          background: #f8f0e2;
          border-radius: 10px 10px 0 0;
          color: ${colours.bg};
          margin-top: 10px;
          padding: 22px 28px;
          transform: translateY(24px);
        }
        .card-peek span {
          color: #4c4337;
          font-size: 13px;
          margin-left: 8px;
        }
        .card-peek strong {
          display: block;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 42px;
          font-weight: 400;
          margin-top: 12px;
        }
        .crystal-panel .venn-cta {
          margin-top: 8px;
          position: relative;
          width: 100%;
          z-index: 1;
        }
        @media (max-width: 960px) {
          .intelligence-stage {
            grid-template-columns: 1fr;
          }
          .signal-arrow {
            transform: rotate(90deg);
          }
        }
        @media (max-width: 620px) {
          .terminal-panel,
          .crystal-panel {
            min-height: auto;
          }
          .crystal-panel,
          .terminal-body,
          .terminal-progress {
            padding-left: 20px;
            padding-right: 20px;
          }
          .signal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Section>
  );
}

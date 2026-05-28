"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, colours, motionPresets } from "./system";

const STEPS = [
  {
    num: "01",
    title: "The card",
    body: [
      "They receive something built from",
      "their real business data.",
      "They've never seen anything like it.",
    ],
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden>
        <path d="M8.25 4.25h8.7l3.8 3.8v15.7H8.25z" />
        <path d="M16.75 4.5v4h4" />
        <path d="M11.5 13.25h6.1M11.5 17h6.1" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "The discovery",
    body: ["Three intelligent questions.", "They answer at their own pace.", "No Zoom. No scheduling."],
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden>
        <path d="M6 8.25h16v9.5H12.2L6 22v-13.75z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "The proposal",
    body: ["Generated from their answers.", "They read it, ask questions,", "pay the deposit. In one place."],
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden>
        <path d="M8.25 4.25h8.7l3.8 3.8v15.7H8.25z" />
        <path d="M16.75 4.5v4h4" />
        <path d="M11.5 13h5.2M11.5 16.5h7" />
        <path d="M11.5 20h4.1" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Client won",
    body: ["Agency OS activates automatically.", "Deliverables. Reports. Health scores.", "Everything tracked."],
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden>
        <circle cx="14" cy="14" r="9.5" />
        <path d="m9.8 14.4 2.8 2.8 5.7-6.2" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Retained",
    body: ["Monthly reports generate themselves.", "Renewal alerts fire at 60 days.", "The relationship runs itself."],
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden>
        <path d="M20.8 10.5a8 8 0 1 0 .6 6.1" />
        <path d="M20.8 6.5v4h-4" />
        <path d="M7.2 17.5v4h4" />
      </svg>
    ),
  },
];

export function CompleteJourney() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeIndex = reduceMotion ? 0 : active;

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % STEPS.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <Section id="complete-journey" tone="primary" className="complete-journey">
      <div className="venn-container">
        <Reveal>
          <div className="cj-header">
            <p className="venn-eyebrow">06.5 / FROM CARD TO CLIENT</p>
            <h2>
              One platform.
              <br />
              The complete journey.
            </h2>
            <p>
              From finding them to winning them
              <br />
              to keeping them. Nothing else needed.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="cj-track">
            <div className="cj-line" aria-hidden>
              <motion.span
                className="cj-dot"
                animate={reduceMotion ? false : { left: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="cj-mobile-line" aria-hidden>
              <motion.span
                className="cj-dot"
                animate={reduceMotion ? false : { top: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="cj-grid">
              {STEPS.map((step, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.article
                    key={step.num}
                    className={`cj-card ${isActive ? "active" : ""}`}
                    animate={{
                      borderColor: isActive ? colours.gold : "#1E1C18",
                      boxShadow: isActive
                        ? "0 0 34px rgba(196,151,63,0.13), inset 0 0 44px rgba(196,151,63,0.055)"
                        : "0 0 0 rgba(196,151,63,0)",
                    }}
                    transition={motionPresets.soft}
                  >
                    <div className="cj-number">
                      <span>{step.num}</span>
                    </div>
                    <div className="cj-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>
                      {step.body.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="cj-footer">
            <p>
              Apollo finds contacts. Clay enriches spreadsheets.
              <br />
              Venn runs the entire process.
            </p>
            <span aria-hidden />
            <strong>
              From cold stranger to retained client.
              <br />
              No other tool touches it.
            </strong>
          </div>
        </Reveal>
      </div>

      <style>{`
        .complete-journey {
          background: #0A0907 !important;
          overflow: hidden;
        }
        .cj-header {
          margin: 0 auto 58px;
          max-width: 860px;
          text-align: center;
        }
        .cj-header .venn-eyebrow {
          color: ${colours.gold};
          margin-bottom: 26px;
        }
        .cj-header h2 {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(54px, 6vw, 86px);
          font-weight: 400;
          line-height: 0.98;
          margin-bottom: 28px;
        }
        .cj-header p {
          color: ${colours.secondary};
          font-size: 18px;
          line-height: 1.55;
        }
        .cj-track {
          margin: 0 auto;
          max-width: 1380px;
          position: relative;
        }
        .cj-line {
          background: rgba(196,151,63,0.58);
          height: 1px;
          left: 9.5%;
          position: absolute;
          right: 9.5%;
          top: 62px;
          z-index: 0;
        }
        .cj-dot {
          background: ${colours.ivory};
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(255,253,248,0.75), 0 0 26px rgba(196,151,63,0.55);
          display: block;
          height: 12px;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
        }
        .cj-mobile-line {
          display: none;
        }
        .cj-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          position: relative;
          z-index: 1;
        }
        .cj-card {
          align-items: center;
          background: #0F0E0B;
          border: 0.5px solid #1E1C18;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          min-height: 322px;
          padding: 34px 22px 30px;
          text-align: center;
          transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cj-number {
          align-items: center;
          background: #0F0E0B;
          border: 1px solid ${colours.gold};
          border-radius: 50%;
          display: flex;
          height: 58px;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          width: 58px;
          z-index: 2;
        }
        .cj-number span {
          color: ${colours.gold};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 24px;
          line-height: 1;
          transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cj-icon {
          color: rgba(196,151,63,0.66);
          height: 34px;
          margin-bottom: 20px;
          transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms cubic-bezier(0.22, 1, 0.36, 1);
          width: 34px;
        }
        .cj-icon svg {
          display: block;
          fill: none;
          height: 100%;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.35;
          width: 100%;
        }
        .cj-card h3 {
          color: #DCD8CF;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(25px, 2vw, 31px);
          font-weight: 400;
          line-height: 1.08;
          margin-bottom: 18px;
          transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cj-card p {
          color: ${colours.secondary};
          font-size: 14px;
          line-height: 1.72;
          margin: 0;
          transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cj-card p span {
          display: block;
        }
        .cj-card.active .cj-number {
          background: rgba(196,151,63,0.13);
          box-shadow: 0 0 24px rgba(196,151,63,0.2);
        }
        .cj-card.active .cj-number span,
        .cj-card.active .cj-icon {
          color: #E7B650;
        }
        .cj-card.active .cj-icon {
          filter: drop-shadow(0 0 12px rgba(196,151,63,0.36));
        }
        .cj-card.active h3 {
          color: ${colours.ivory};
        }
        .cj-card.active p {
          color: #B8B2A8;
        }
        .cj-footer {
          margin: 58px auto 0;
          max-width: 720px;
          text-align: center;
        }
        .cj-footer p {
          color: #B8B2A8;
          font-size: 18px;
          line-height: 1.55;
          margin: 0;
        }
        .cj-footer > span {
          background: ${colours.gold};
          display: block;
          height: 1px;
          margin: 28px auto 22px;
          opacity: 0.7;
          width: 40px;
        }
        .cj-footer strong {
          color: ${colours.gold};
          display: block;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(31px, 3vw, 42px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.24;
        }
        @media (max-width: 1160px) {
          .cj-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .cj-line {
            display: none;
          }
        }
        @media (max-width: 760px) {
          .cj-header {
            margin-bottom: 46px;
          }
          .cj-header h2 {
            font-size: clamp(42px, 12vw, 58px);
          }
          .cj-header p,
          .cj-footer p {
            font-size: 15px;
          }
          .cj-track {
            max-width: 520px;
          }
          .cj-grid {
            gap: 18px;
            grid-template-columns: 1fr;
          }
          .cj-mobile-line {
            background: rgba(196,151,63,0.48);
            bottom: 156px;
            display: block;
            left: 36px;
            position: absolute;
            top: 44px;
            width: 1px;
            z-index: 0;
          }
          .cj-mobile-line .cj-dot {
            left: 50%;
            top: 0;
          }
          .cj-card {
            align-items: flex-start;
            display: grid;
            gap: 0 18px;
            grid-template-columns: 54px 1fr;
            min-height: 0;
            padding: 24px 22px 24px 18px;
            text-align: left;
          }
          .cj-number {
            grid-row: span 3;
            height: 38px;
            margin: 0;
            width: 38px;
          }
          .cj-number span {
            font-size: 16px;
          }
          .cj-icon {
            height: 28px;
            margin-bottom: 14px;
            width: 28px;
          }
          .cj-card h3 {
            font-size: 26px;
            margin-bottom: 12px;
          }
          .cj-card p {
            font-size: 13px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cj-dot {
            display: none;
          }
        }
      `}</style>
    </Section>
  );
}

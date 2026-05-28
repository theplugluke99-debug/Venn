"use client";

import { Section, Reveal, colours } from "./system";

const CIRCLE_SIZE = 36;
const CARD_PT = 26; // card padding-top before the circle
const CIRCLE_Y = CARD_PT + CIRCLE_SIZE / 2; // 44px — used to pin the line to circle centres

const STEPS = [
  {
    num: "01",
    title: "The card",
    desc: "They receive something built from their real business data. They've never seen anything like it.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3.5" y="2" width="13" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="6.5" y1="6.5" x2="13.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6.5" y1="9.5" x2="13.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6.5" y1="12.5" x2="10.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "The discovery",
    desc: "Three intelligent questions. They answer at their own pace. No Zoom. No scheduling.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M2.5 4h15a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7l-4.5 3V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "The proposal",
    desc: "Generated from their answers. They read it, ask questions, pay the deposit. In one place.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3.5" y="2" width="13" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6.5 8.5l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="6.5" y1="13" x2="13.5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Client won",
    desc: "Agency OS activates automatically. Deliverables. Reports. Health scores. Everything tracked.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Retained",
    desc: "Monthly reports generate themselves. Renewal alerts fire at 60 days. The relationship runs itself.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M16.5 10A6.5 6.5 0 1 1 14 5.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 4.5v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function CompleteJourney() {
  return (
    <Section id="complete-journey">
      <div className="venn-container">

        {/* ── Section header ── */}
        <Reveal>
          <div className="cj-header">
            <p className="venn-eyebrow cj-eyebrow">06.5 / From card to client</p>
            <h2 className="cj-headline">
              One platform.<br />The complete journey.
            </h2>
            <p className="cj-subline">
              From finding them to winning them<br />
              to keeping them. Nothing else needed.
            </p>
          </div>
        </Reveal>

        {/* ── Journey timeline ── */}
        <Reveal delay={0.1}>
          <div className="cj-wrap">

            {/* Gold connecting line + animated dot (desktop only) */}
            <div className="cj-rail" aria-hidden="true">
              <div className="cj-rail-line" />
              <div className="cj-rail-dot" />
            </div>

            {/* Mobile vertical track (tablet / phone only) */}
            <div className="cj-mobile-rail" aria-hidden="true" />

            <div className="cj-grid">
              {STEPS.map((step) => (
                <div key={step.num} className="cj-card">
                  {/* Number circle */}
                  <div className="cj-circle">
                    <span>{step.num}</span>
                  </div>

                  {/* Body: icon + text */}
                  <div className="cj-body">
                    <div className="cj-icon">{step.icon}</div>
                    <h4 className="cj-title">{step.title}</h4>
                    <p className="cj-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Footer copy ── */}
        <Reveal delay={0.22}>
          <div className="cj-foot">
            <p className="cj-foot-context">
              Apollo finds contacts. Clay enriches spreadsheets.<br />
              Venn runs the entire process.
            </p>
            <div className="cj-foot-rule" />
            <p className="cj-foot-italic">
              From cold stranger to retained client.<br />
              No other tool touches it.
            </p>
          </div>
        </Reveal>

      </div>

      <style>{`
        /* ── Header ── */
        .cj-header {
          margin: 0 auto 68px;
          max-width: 780px;
          text-align: center;
        }
        .cj-eyebrow {
          color: ${colours.gold} !important;
          margin-bottom: 22px;
        }
        .cj-headline {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(36px, 4.8vw, 52px);
          font-weight: 400;
          line-height: 1.08;
          margin-bottom: 18px;
        }
        .cj-subline {
          color: ${colours.secondary};
          font-size: 16px;
          line-height: 1.65;
        }

        /* ── Timeline wrapper ── */
        .cj-wrap {
          margin: 0 auto;
          max-width: 1120px;
          position: relative;
        }

        /* ── Horizontal connecting line (desktop) ── */
        .cj-rail {
          height: 1px;
          left: 10%;
          pointer-events: none;
          position: absolute;
          right: 10%;
          top: ${CIRCLE_Y}px;
          transform: translateY(-50%);
          z-index: 0;
        }
        .cj-rail-line {
          background: ${colours.gold};
          height: 100%;
          opacity: 0.3;
          position: absolute;
          inset: 0;
        }
        .cj-rail-dot {
          animation: cj-run 4s linear infinite;
          background: ${colours.gold};
          border-radius: 50%;
          box-shadow:
            0 0 10px 4px rgba(196,151,63,0.8),
            0 0 24px 10px rgba(196,151,63,0.3);
          height: 10px;
          left: 0%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
        }
        @keyframes cj-run {
          0%   { left: 0%;   opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* ── Mobile vertical rail ── */
        .cj-mobile-rail { display: none; }

        /* ── Cards grid ── */
        .cj-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
          z-index: 1;
        }

        /* ── Single card ── */
        .cj-card {
          align-items: center;
          background: #0F0E0B;
          border: 0.5px solid #1E1C18;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          padding: ${CARD_PT}px 16px 28px;
          text-align: center;
          transition: border-color 280ms ease;
        }
        .cj-card:hover {
          border-color: rgba(196,151,63,0.28);
        }

        /* ── Number circle ── */
        .cj-circle {
          align-items: center;
          background: #0F0E0B;
          border: 1.5px solid ${colours.gold};
          border-radius: 50%;
          display: flex;
          flex-shrink: 0;
          height: ${CIRCLE_SIZE}px;
          justify-content: center;
          margin-bottom: 20px;
          width: ${CIRCLE_SIZE}px;
        }
        .cj-circle span {
          color: ${colours.gold};
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        /* ── Card body ── */
        .cj-body {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cj-icon {
          color: ${colours.secondary};
          display: flex;
          margin-bottom: 14px;
        }
        .cj-title {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 21px;
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .cj-desc {
          color: ${colours.secondary};
          font-size: 13px;
          line-height: 1.68;
        }

        /* ── Footer copy ── */
        .cj-foot {
          margin: 56px auto 0;
          max-width: 540px;
          text-align: center;
        }
        .cj-foot-context {
          color: ${colours.secondary};
          font-size: 15px;
          line-height: 1.7;
        }
        .cj-foot-rule {
          background: ${colours.gold};
          height: 1px;
          margin: 28px auto;
          opacity: 0.38;
          width: 36px;
        }
        .cj-foot-italic {
          color: ${colours.gold};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 20px;
          font-style: italic;
          font-weight: 400;
          line-height: 1.42;
        }

        /* ── Tablet: 3-column, no dot ── */
        @media (max-width: 900px) {
          .cj-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .cj-rail { display: none; }
        }

        /* ── Mobile: 1-column, horizontal card layout, vertical rail ── */
        @media (max-width: 560px) {
          .cj-grid {
            grid-template-columns: 1fr;
            gap: 0;
            padding-left: 36px;
          }

          /* Vertical connecting line */
          .cj-mobile-rail {
            display: block;
            background: rgba(196,151,63,0.3);
            bottom: ${CIRCLE_Y}px;
            left: 18px; /* circle centre x inside .cj-wrap */
            position: absolute;
            top: ${CIRCLE_Y}px;
            width: 1px;
            z-index: 0;
          }

          .cj-card {
            align-items: flex-start;
            border-radius: 0;
            border-bottom: none;
            flex-direction: row;
            gap: 14px;
            padding: 16px 16px 16px 0;
            text-align: left;
          }
          .cj-card:first-child { border-radius: 8px 8px 0 0; }
          .cj-card:last-child  { border-bottom: 0.5px solid #1E1C18; border-radius: 0 0 8px 8px; }

          .cj-circle {
            flex-shrink: 0;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            background: ${colours.bg};
          }
          .cj-body {
            align-items: flex-start;
            padding: 6px 0;
          }
          .cj-icon { display: none; }
          .cj-title { font-size: 18px; margin-bottom: 8px; }
        }
      `}</style>
    </Section>
  );
}

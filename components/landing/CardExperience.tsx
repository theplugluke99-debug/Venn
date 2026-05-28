"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { Reveal, Section, VennLogo, colours } from "./system";

const REVIEWS = [
  "Lovely staff but the wait was longer than expected.",
  "Had to wait 40 minutes past my appointment time.",
  "Treatment was great, but waiting around too long.",
];

type Tab = "editorial" | "letter";

function EditorialCard() {
  return (
    <article className="editorial-card">
      <header className="editorial-hero">
        <Image
          src="/landing/glow-aesthetics-reception.png"
          alt="Luxury Glow Aesthetics reception interior"
          fill
          sizes="(max-width: 900px) 100vw, 980px"
          style={{ objectFit: "cover" }}
          priority={false}
        />
        <div className="image-scrim" />
        <div className="card-brand">
          <VennLogo size={28} variant="mark" decorative />
          <span>Momentum Agency</span>
        </div>
        <span className="intent-badge"><i /> HIGH INTENT</span>
        <div className="hero-copy-card">
          <h3>Glow<br />Aesthetics</h3>
          <p className="venn-eyebrow">Manchester</p>
          <p>We spent 14 minutes here.</p>
          <div className="loss-block">
            <span>Estimated monthly loss</span>
            <strong>£2,400</strong>
            <small>per month in estimated lost revenue</small>
          </div>
        </div>
      </header>

      <div className="live-strip">
        <span><i /> Real-time signal detected: 3 new reviews mention wait times in the last 7 days.</span>
        <small>Just now</small>
      </div>

      <section className="insight-row">
        <div className="row-copy">
          <span>01</span>
          <div>
            <h4>What we noticed</h4>
            <p>Your reviews mention wait times <em>6 times</em> this month.</p>
            <small>The most common words: wait, waiting, delay, appointment, running late, queue.</small>
          </div>
        </div>
        <div className="review-stack">
          {REVIEWS.map((review) => (
            <blockquote key={review}>
              <b>★★★★★</b>
              &ldquo;{review}&rdquo;
            </blockquote>
          ))}
          <small>+3 more mentions</small>
        </div>
      </section>

      <section className="insight-row">
        <div className="row-copy">
          <span>02</span>
          <div>
            <h4>What this is costing</h4>
            <p>Based on your review patterns and local competitor data, this is quietly losing you bookings every week.</p>
          </div>
        </div>
        <aside className="evidence-box">
          <p className="venn-eyebrow">Behind the numbers</p>
          <p>We analysed 47 local clinics. The ones that respond to wait time friction convert more enquiries. The ones that don&apos;t stay busy, but plateau.</p>
        </aside>
      </section>

      <section className="insight-row">
        <div className="row-copy">
          <span>03</span>
          <div>
            <h4>Our recommendation</h4>
            <p>The fix here isn&apos;t complicated. Make the wait feel acknowledged rather than invisible.</p>
          </div>
        </div>
        <aside className="evidence-box">
          <p className="venn-eyebrow">What works</p>
          <p>A simple notification or expectation reset usually removes the frustration that shows up in reviews.</p>
        </aside>
      </section>

      <footer className="card-footer">
        <div>
          <h4>Worth exploring together?</h4>
          <p>I&apos;d love to show you exactly how this could work for Glow Aesthetics.</p>
        </div>
        <a className="venn-cta venn-cta-primary" href="#" onClick={(e) => e.preventDefault()}>
          Reply to this insight →
        </a>
      </footer>
    </article>
  );
}

function LetterCard() {
  return (
    <article className="letter-card">
      <header className="letter-header">
        <div className="letter-from">
          <span className="letter-agency">Momentum Agency</span>
          <span className="letter-for">For Glow Aesthetics · Manchester</span>
        </div>
        <span className="letter-intent-badge">HIGH INTENT</span>
      </header>

      <div className="letter-body">
        <h3 className="letter-business-name">Glow<br />Aesthetics</h3>

        <p className="letter-para">We spent some time looking at your business this week.</p>
        <p className="letter-para">The results speak for themselves — clients love the treatments, the atmosphere, the team. But there&apos;s a pattern running through your reviews that&apos;s quietly costing you bookings every month.</p>

        <div className="letter-finding">
          <p className="letter-finding-label">What we noticed</p>
          <p className="letter-para">Wait times. Your reviews mention it <strong>six times this month alone</strong> — words like &ldquo;wait&rdquo;, &ldquo;delay&rdquo;, &ldquo;running late&rdquo;, &ldquo;queue&rdquo;. The experience is genuinely good, but the wait is leaving a mark.</p>
        </div>

        <div className="letter-finding">
          <p className="letter-finding-label">What it&apos;s costing</p>
          <p className="letter-para">Based on your booking volume and local competitor data, we estimate this friction is costing around <strong>£2,400 per month</strong> in lost or deterred bookings. Not from bad reviews — just from a fixable frustration.</p>
        </div>

        <div className="letter-finding">
          <p className="letter-finding-label">What we&apos;d suggest</p>
          <p className="letter-para">The fix isn&apos;t complicated. A simple expectation reset — letting clients know before they arrive — usually removes the frustration that shows up in reviews. We&apos;ve seen it work for clinics exactly like yours.</p>
        </div>

        <p className="letter-close">Worth a conversation?</p>
        <p className="letter-sig">Luke<br /><span>Momentum Agency</span></p>
      </div>

      <footer className="letter-footer">
        <a
          className="letter-cta"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Reply to this insight →
        </a>
      </footer>
    </article>
  );
}

export function CardExperience() {
  const [activeTab, setActiveTab] = useState<Tab>("editorial");
  const [visible, setVisible] = useState(true);

  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setVisible(true);
    }, 200);
  }, [activeTab]);

  return (
    <Section id="prospect-card" tone="ivory" className="card-experience-section">
      <div className="venn-container">
        <Reveal>
          <div className="card-section-title">
            <p className="venn-eyebrow">04 / The prospect card experience</p>
            <h2>This is what your prospect receives.</h2>
            <p>Built for Glow Aesthetics. Based on their real business.</p>
          </div>
        </Reveal>

        {/* Style selector tabs */}
        <Reveal delay={0.04}>
          <div className="style-tabs-row">
            <div className="style-tabs">
              <button
                className={`style-tab${activeTab === "editorial" ? " style-tab-active" : ""}`}
                onClick={() => switchTab("editorial")}
              >
                Editorial
              </button>
              <button
                className={`style-tab${activeTab === "letter" ? " style-tab-active" : ""}`}
                onClick={() => switchTab("letter")}
              >
                Letter
              </button>
              <div className="style-tab-minimal">
                Minimal
                <span className="minimal-tooltip">Coming soon</span>
              </div>
            </div>
            <p className="style-hint">Every card is uniquely generated. Style selected in your dashboard settings.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="card-fade-wrap"
            style={{
              opacity: visible ? 1 : 0,
              transition: visible ? "opacity 300ms ease" : "opacity 200ms ease",
            }}
          >
            {activeTab === "editorial" ? <EditorialCard /> : <LetterCard />}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="card-proof-row">
            {["Personalised just for them", "Built in 60 seconds", "Always based on real data", "Private & shareable"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="built-line">Built automatically. In 60 seconds.<br /><em>From their real business data.</em></p>
        </Reveal>
      </div>

      <style>{`
        .card-experience-section {
          background:
            radial-gradient(circle at 50% 0%, rgba(196,151,63,0.13), transparent 34%),
            #fffdf8 !important;
          color: ${colours.bg};
        }
        .card-section-title {
          margin: 0 auto 48px;
          max-width: 760px;
          text-align: center;
        }
        .card-section-title .venn-eyebrow { color: #B8872E; margin-bottom: 20px; }
        .card-section-title h2 {
          color: ${colours.bg};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(48px, 7vw, 82px);
          font-weight: 400;
          line-height: 0.95;
          margin-bottom: 18px;
        }
        .card-section-title p:last-child {
          color: #77716a;
          font-size: 16px;
        }

        /* ── Style selector tabs ── */
        .style-tabs-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .style-tabs {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(10,9,7,0.05);
          border: 0.5px solid #E5D9C6;
          border-radius: 999px;
          padding: 4px;
        }
        .style-tab {
          background: transparent;
          border: none;
          border-radius: 999px;
          color: #77716a;
          cursor: pointer;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          position: relative;
          transition: color 180ms ease, background 180ms ease;
        }
        .style-tab:hover {
          color: #2d2923;
        }
        .style-tab-active {
          background: #FFFDF8;
          box-shadow: 0 1px 4px rgba(10,9,7,0.10);
          color: #0A0907 !important;
        }
        .style-tab-active::after {
          background: #B8872E;
          border-radius: 999px;
          bottom: 4px;
          content: '';
          height: 2px;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 24px;
        }
        .style-tab-minimal {
          border-radius: 999px;
          color: #bbb3a8;
          cursor: default;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          position: relative;
        }
        .style-tab-minimal:hover .minimal-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }
        .minimal-tooltip {
          background: #1A1610;
          border-radius: 6px;
          bottom: calc(100% + 8px);
          color: #C4973F;
          font-size: 11px;
          font-weight: 500;
          left: 50%;
          letter-spacing: 0.04em;
          opacity: 0;
          padding: 6px 10px;
          pointer-events: none;
          position: absolute;
          transform: translateX(-50%) translateY(0px);
          transition: opacity 160ms ease, transform 160ms ease;
          white-space: nowrap;
        }
        .minimal-tooltip::after {
          border: 5px solid transparent;
          border-top-color: #1A1610;
          bottom: -10px;
          content: '';
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
        }
        .style-hint {
          color: #a09a91;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
          text-align: center;
        }

        /* ── Card fade wrapper ── */
        .card-fade-wrap {
          will-change: opacity;
        }

        /* ── Editorial card (dark) ── */
        .editorial-card {
          background: #080806;
          border: 0.5px solid rgba(196,151,63,0.22);
          border-radius: 18px;
          box-shadow: 0 34px 90px rgba(10,9,7,0.23);
          color: ${colours.ivory};
          margin: 0 auto;
          max-width: 980px;
          overflow: hidden;
        }
        .editorial-hero {
          min-height: 650px;
          overflow: hidden;
          padding: 52px;
          position: relative;
        }
        .image-scrim {
          background:
            linear-gradient(90deg, rgba(8,8,6,0.96) 0%, rgba(8,8,6,0.78) 36%, rgba(8,8,6,0.1) 72%),
            linear-gradient(0deg, rgba(8,8,6,0.7), transparent 46%);
          inset: 0;
          position: absolute;
        }
        .card-brand,
        .intent-badge,
        .hero-copy-card {
          position: relative;
          z-index: 1;
        }
        .card-brand {
          align-items: center;
          display: flex;
          gap: 9px;
        }
        .card-brand span {
          color: ${colours.gold};
          font-size: 13px;
        }
        .intent-badge {
          align-items: center;
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 999px;
          color: ${colours.ivory};
          display: inline-flex;
          float: right;
          font-size: 11px;
          font-weight: 700;
          gap: 9px;
          letter-spacing: 0.12em;
          padding: 10px 14px;
        }
        .intent-badge i,
        .live-strip i {
          background: #56d15f;
          border-radius: 50%;
          display: inline-block;
          height: 9px;
          width: 9px;
        }
        .hero-copy-card {
          clear: both;
          max-width: 420px;
          padding-top: 70px;
        }
        .hero-copy-card h3 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(58px, 8vw, 88px);
          font-weight: 400;
          line-height: 0.95;
          margin-bottom: 28px;
        }
        .hero-copy-card > p:not(.venn-eyebrow) {
          font-size: 17px;
          margin: 26px 0 48px;
        }
        .loss-block {
          display: grid;
          gap: 8px;
        }
        .loss-block span {
          color: ${colours.secondary};
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .loss-block strong {
          color: ${colours.gold};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 70px;
          font-weight: 400;
          line-height: 0.9;
        }
        .loss-block small {
          color: ${colours.ivory};
          font-size: 13px;
        }
        .live-strip {
          align-items: center;
          border: 0.5px solid rgba(86,209,95,0.28);
          border-radius: 999px;
          color: ${colours.ivory};
          display: flex;
          gap: 12px;
          justify-content: space-between;
          margin: 0 46px 10px;
          padding: 13px 18px;
          transform: translateY(-26px);
        }
        .live-strip span {
          align-items: center;
          display: flex;
          gap: 12px;
          font-size: 13px;
        }
        .live-strip small {
          color: ${colours.secondary};
        }
        .insight-row {
          border-top: 0.5px solid rgba(255,253,248,0.1);
          display: grid;
          gap: 44px;
          grid-template-columns: 1fr 0.92fr;
          margin: 0 46px;
          padding: 48px 0;
        }
        .row-copy {
          display: grid;
          gap: 34px;
          grid-template-columns: 52px 1fr;
        }
        .row-copy > span {
          color: ${colours.gold};
          font-size: 18px;
          font-weight: 700;
        }
        .row-copy h4,
        .card-footer h4 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 34px;
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 24px;
        }
        .row-copy p,
        .card-footer p,
        .evidence-box p:last-child {
          color: rgba(255,253,248,0.82);
          font-size: 15px;
          line-height: 1.65;
        }
        .row-copy em {
          color: ${colours.gold};
          font-style: normal;
        }
        .row-copy small {
          color: ${colours.secondary};
          display: block;
          font-size: 13px;
          line-height: 1.6;
          margin-top: 16px;
        }
        .review-stack {
          display: grid;
          gap: 12px;
        }
        .review-stack blockquote,
        .evidence-box {
          background: rgba(255,253,248,0.035);
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 10px;
          color: rgba(255,253,248,0.86);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          padding: 18px;
        }
        .review-stack b {
          color: ${colours.gold};
          display: block;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .review-stack small {
          color: ${colours.secondary};
          font-size: 12px;
          padding-left: 18px;
        }
        .evidence-box .venn-eyebrow {
          color: #76c878;
          margin-bottom: 14px;
        }
        .card-footer {
          align-items: end;
          border-top: 0.5px solid rgba(255,253,248,0.1);
          display: flex;
          gap: 24px;
          justify-content: space-between;
          margin: 0 46px;
          padding: 42px 0 52px;
        }
        .card-footer .venn-cta {
          flex: 0 0 auto;
        }

        /* ── Letter card (light) ── */
        .letter-card {
          background: #FFFDF8;
          border: 0.5px solid #E5D9C6;
          border-radius: 18px;
          box-shadow: 0 12px 56px rgba(10,9,7,0.10);
          color: #0A0907;
          margin: 0 auto;
          max-width: 980px;
          overflow: hidden;
        }
        .letter-header {
          align-items: center;
          border-bottom: 0.5px solid #E5D9C6;
          display: flex;
          justify-content: space-between;
          padding: 24px 48px;
        }
        .letter-agency {
          color: #B8872E;
          display: block;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .letter-for {
          color: #77716a;
          display: block;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
          margin-top: 3px;
        }
        .letter-intent-badge {
          background: #FFFBF0;
          border: 0.5px solid rgba(184,135,46,0.4);
          border-radius: 999px;
          color: #B8872E;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 8px 14px;
        }
        .letter-body {
          max-width: 680px;
          padding: 52px 48px 40px;
        }
        .letter-business-name {
          color: #0A0907;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 400;
          line-height: 0.95;
          margin-bottom: 36px;
        }
        .letter-para {
          color: #2D2923;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.78;
          margin-bottom: 18px;
        }
        .letter-para strong {
          color: #0A0907;
          font-weight: 600;
        }
        .letter-finding {
          border-left: 2px solid #E5D9C6;
          margin: 30px 0;
          padding-left: 22px;
        }
        .letter-finding-label {
          color: #B8872E;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .letter-finding .letter-para {
          margin-bottom: 0;
        }
        .letter-close {
          color: #0A0907;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 20px;
          margin-top: 40px;
        }
        .letter-sig {
          color: #2D2923;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.6;
        }
        .letter-sig span {
          color: #77716a;
          font-size: 13px;
        }
        .letter-footer {
          border-top: 0.5px solid #E5D9C6;
          padding: 28px 48px;
        }
        .letter-cta {
          background: #0A0907;
          border-radius: 8px;
          color: #FFFDF8 !important;
          display: inline-block;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 13px 24px;
          text-decoration: none;
          transition: opacity 150ms ease;
        }
        .letter-cta:hover { opacity: 0.88; }

        /* ── Below-card proof row ── */
        .card-proof-row {
          color: ${colours.bg};
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(4, 1fr);
          margin: 42px auto 26px;
          max-width: 760px;
          text-align: center;
        }
        .card-proof-row span {
          border-left: 0.5px solid #e5d9c6;
          color: #2d2923;
          font-size: 13px;
          padding: 0 16px;
        }
        .card-proof-row span:first-child {
          border-left: 0;
        }
        .built-line {
          color: ${colours.bg};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(28px, 4vw, 38px);
          line-height: 1.15;
          text-align: center;
        }
        .built-line em {
          color: #B8872E;
          font-style: normal;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .editorial-hero {
            min-height: 560px;
            padding: 30px;
          }
          .insight-row,
          .card-footer {
            grid-template-columns: 1fr;
            margin-left: 24px;
            margin-right: 24px;
          }
          .card-footer {
            align-items: start;
            flex-direction: column;
          }
          .live-strip {
            align-items: flex-start;
            border-radius: 12px;
            flex-direction: column;
            margin-left: 24px;
            margin-right: 24px;
          }
          .card-proof-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .letter-header {
            padding: 20px 24px;
          }
          .letter-body {
            padding: 36px 24px 28px;
          }
          .letter-footer {
            padding: 22px 24px;
          }
        }
        @media (max-width: 560px) {
          .editorial-card {
            border-radius: 12px;
            margin-left: -10px;
            margin-right: -10px;
          }
          .editorial-hero {
            min-height: 520px;
            padding: 24px;
          }
          .image-scrim {
            background: linear-gradient(180deg, rgba(8,8,6,0.74), rgba(8,8,6,0.96));
          }
          .intent-badge {
            float: none;
            margin-top: 20px;
          }
          .hero-copy-card {
            padding-top: 42px;
          }
          .row-copy {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .card-proof-row {
            grid-template-columns: 1fr;
          }
          .card-proof-row span {
            border-left: 0;
          }
          .letter-card {
            border-radius: 12px;
            margin-left: -10px;
            margin-right: -10px;
          }
          .style-tabs {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </Section>
  );
}

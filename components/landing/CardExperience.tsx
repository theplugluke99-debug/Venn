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
    <article className="lc-wrap">
      {/* Header */}
      <div className="lc-header">
        <div className="lc-from">
          <VennLogo size={16} variant="mark" decorative />
          <span className="lc-agency-name">Momentum Agency</span>
        </div>
        <span className="lc-date">May 2025</span>
      </div>

      <div className="lc-rule" />

      {/* Salutation */}
      <p className="lc-salutation">To the team at Glow Aesthetics,</p>

      {/* Body */}
      <div className="lc-body">
        <p>We spent some time with your business this week. Not a cursory glance — fourteen minutes of genuine attention. Your reviews, your website, your booking experience, your position in the Manchester market.</p>
        <p>What we found was encouraging and specific. Your Google rating of 4.1 is stronger than most clinics in your area. The gap isn&apos;t quality — it&apos;s a friction point that keeps showing up. Wait times are mentioned six times in your reviews this month. That&apos;s not a coincidence.</p>
        <p>We think there&apos;s approximately £2,400 per month sitting in that gap. Not a projection — a calculation based on your review patterns and local competitor data.</p>
        <p>If this resonates — we&apos;d love to show you exactly how we&apos;d approach it. No pressure. Just a conversation.</p>
      </div>

      {/* Sign off */}
      <div className="lc-signoff">
        <p className="lc-close-line">With respect,</p>
        <div style={{ height: 8 }} />
        <p className="lc-name">Luke K.</p>
        <p className="lc-org">Momentum Agency</p>
      </div>

      <div className="lc-rule" style={{ marginTop: 32 }} />

      <p className="lc-private">Private and personalised · Prepared specifically for Glow Aesthetics</p>
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
            <div className="style-pill">
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
              <div className="style-tab-minimal" title="Coming soon">
                Minimal
                <span className="soon-badge">Soon</span>
                <span className="minimal-tooltip">Coming soon</span>
              </div>
            </div>
            <p className="style-hint">Style selected in your dashboard settings. Each card uniquely generated.</p>
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
        .card-section-title p:last-child { color: #77716a; font-size: 16px; }

        /* ── Style selector ── */
        .style-tabs-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .style-pill {
          align-items: center;
          background: #1A1814;
          border: 0.5px solid #1E1C18;
          border-radius: 40px;
          display: inline-flex;
          padding: 4px;
        }
        .style-tab {
          background: transparent;
          border: none;
          border-radius: 36px;
          color: #888580;
          cursor: pointer;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          transition: color 180ms ease;
        }
        .style-tab:hover:not(.style-tab-active) { color: ${colours.ivory}; }
        .style-tab-active {
          background: #C4973F;
          color: #0A0907 !important;
        }
        .style-tab-minimal {
          align-items: center;
          border-radius: 36px;
          color: #444440;
          cursor: not-allowed;
          display: inline-flex;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          gap: 5px;
          padding: 8px 20px;
          position: relative;
        }
        .soon-badge {
          border: 0.5px solid rgba(196,151,63,0.45);
          border-radius: 4px;
          color: rgba(196,151,63,0.7);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.07em;
          padding: 2px 5px;
          text-transform: uppercase;
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
          opacity: 0;
          padding: 6px 10px;
          pointer-events: none;
          position: absolute;
          transform: translateX(-50%) translateY(0);
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
          color: #444440;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          text-align: center;
        }
        .card-fade-wrap { will-change: opacity; }

        /* ── Editorial card ── */
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
        .card-brand, .intent-badge, .hero-copy-card { position: relative; z-index: 1; }
        .card-brand { align-items: center; display: flex; gap: 9px; }
        .card-brand span { color: ${colours.gold}; font-size: 13px; }
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
        .intent-badge i, .live-strip i {
          background: #56d15f;
          border-radius: 50%;
          display: inline-block;
          height: 9px;
          width: 9px;
        }
        .hero-copy-card { clear: both; max-width: 420px; padding-top: 70px; }
        .hero-copy-card h3 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(58px, 8vw, 88px);
          font-weight: 400;
          line-height: 0.95;
          margin-bottom: 28px;
        }
        .hero-copy-card > p:not(.venn-eyebrow) { font-size: 17px; margin: 26px 0 48px; }
        .loss-block { display: grid; gap: 8px; }
        .loss-block span { color: ${colours.secondary}; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
        .loss-block strong {
          color: ${colours.gold};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 70px;
          font-weight: 400;
          line-height: 0.9;
        }
        .loss-block small { color: ${colours.ivory}; font-size: 13px; }
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
        .live-strip span { align-items: center; display: flex; gap: 12px; font-size: 13px; }
        .live-strip small { color: ${colours.secondary}; }
        .insight-row {
          border-top: 0.5px solid rgba(255,253,248,0.1);
          display: grid;
          gap: 44px;
          grid-template-columns: 1fr 0.92fr;
          margin: 0 46px;
          padding: 48px 0;
        }
        .row-copy { display: grid; gap: 34px; grid-template-columns: 52px 1fr; }
        .row-copy > span { color: ${colours.gold}; font-size: 18px; font-weight: 700; }
        .row-copy h4, .card-footer h4 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 34px;
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 24px;
        }
        .row-copy p, .card-footer p, .evidence-box p:last-child {
          color: rgba(255,253,248,0.82); font-size: 15px; line-height: 1.65;
        }
        .row-copy em { color: ${colours.gold}; font-style: normal; }
        .row-copy small { color: ${colours.secondary}; display: block; font-size: 13px; line-height: 1.6; margin-top: 16px; }
        .review-stack { display: grid; gap: 12px; }
        .review-stack blockquote, .evidence-box {
          background: rgba(255,253,248,0.035);
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 10px;
          color: rgba(255,253,248,0.86);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          padding: 18px;
        }
        .review-stack b { color: ${colours.gold}; display: block; font-size: 12px; margin-bottom: 8px; }
        .review-stack small { color: ${colours.secondary}; font-size: 12px; padding-left: 18px; }
        .evidence-box .venn-eyebrow { color: #76c878; margin-bottom: 14px; }
        .card-footer {
          align-items: end;
          border-top: 0.5px solid rgba(255,253,248,0.1);
          display: flex;
          gap: 24px;
          justify-content: space-between;
          margin: 0 46px;
          padding: 42px 0 52px;
        }
        .card-footer .venn-cta { flex: 0 0 auto; }

        /* ── Letter card ── */
        .lc-wrap {
          background: #FFFDF8;
          border: 0.5px solid #E8E4DC;
          border-radius: 8px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.15);
          margin: 0 auto;
          max-width: 980px;
          padding: 40px;
        }
        .lc-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .lc-from { align-items: center; display: flex; gap: 8px; }
        .lc-agency-name {
          color: #888580;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
        }
        .lc-date {
          color: #888580;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
        }
        .lc-rule { background: #E8E4DC; height: 0.5px; margin-bottom: 28px; }
        .lc-salutation {
          color: #0A0907;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 20px;
          font-style: italic;
          font-weight: 400;
          margin-bottom: 24px;
        }
        .lc-body p {
          color: #333;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.9;
          margin-bottom: 18px;
        }
        .lc-signoff { margin-top: 8px; }
        .lc-close-line {
          color: #333;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 14px;
        }
        .lc-name {
          color: #0A0907;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
        }
        .lc-org {
          color: #888580;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
        }
        .lc-private {
          color: #888580;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          margin-top: 16px;
          text-align: center;
        }

        /* ── Proof row ── */
        .card-proof-row {
          color: ${colours.bg};
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(4, 1fr);
          margin: 42px auto 26px;
          max-width: 760px;
          text-align: center;
        }
        .card-proof-row span { border-left: 0.5px solid #e5d9c6; color: #2d2923; font-size: 13px; padding: 0 16px; }
        .card-proof-row span:first-child { border-left: 0; }
        .built-line {
          color: ${colours.bg};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(28px, 4vw, 38px);
          line-height: 1.15;
          text-align: center;
        }
        .built-line em { color: #B8872E; font-style: normal; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .editorial-hero { min-height: 560px; padding: 30px; }
          .insight-row, .card-footer { grid-template-columns: 1fr; margin-left: 24px; margin-right: 24px; }
          .card-footer { align-items: start; flex-direction: column; }
          .live-strip { align-items: flex-start; border-radius: 12px; flex-direction: column; margin-left: 24px; margin-right: 24px; }
          .card-proof-row { grid-template-columns: repeat(2, 1fr); }
          .lc-wrap { padding: 28px; }
        }
        @media (max-width: 560px) {
          .editorial-card { border-radius: 12px; margin-left: -10px; margin-right: -10px; }
          .editorial-hero { min-height: 520px; padding: 24px; }
          .image-scrim { background: linear-gradient(180deg, rgba(8,8,6,0.74), rgba(8,8,6,0.96)); }
          .intent-badge { float: none; margin-top: 20px; }
          .hero-copy-card { padding-top: 42px; }
          .row-copy { grid-template-columns: 1fr; gap: 14px; }
          .card-proof-row { grid-template-columns: 1fr; }
          .card-proof-row span { border-left: 0; }
          .lc-wrap { margin-left: -10px; margin-right: -10px; padding: 24px; }
          .lc-body p { font-size: 15px; }
        }
      `}</style>
    </Section>
  );
}

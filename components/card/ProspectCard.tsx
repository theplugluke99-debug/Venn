"use client";

import { useEffect, useRef, useState } from "react";

export interface CardObservationFull {
  title: string;
  detail: string;
  reviewQuote?: string;
  frequency?: string;
  impact?: "high" | "medium" | "low";
}

export interface RevenueBreakdownItem {
  icon: "clock" | "phone" | "star" | "chart";
  description: string;
  amount: number;
}

export interface ApproachMove {
  title: string;
  body: string;
}

export interface ProspectCardProps {
  // Core
  businessName: string;
  headline: string;
  subheadline?: string;
  niche: string;
  location: string;
  googleRating?: number | null;
  reviewCount?: number | null;
  // Sections
  observations: CardObservationFull[];
  revenueLoss: string | null;
  revenueBreakdown?: RevenueBreakdownItem[];
  approachMoves?: ApproachMove[];
  minutesAnalysing?: number | null;
  signalBanner?: string | null;
  // Agency
  brandColour: string;
  logoUrl: string | null;
  agencyName: string | null;
  agencyOwnerName?: string | null;
  agencyOwnerPhoto?: string | null;
  // CTA
  ctaType: string;
  ctaValue: string | null;
  ctaText: string;
  // View tracking
  lastViewed?: Date | null;
}

const SECTION_IDS = ["s01", "s02", "s03", "s04", "s05"] as const;
const NAV_LABELS = [
  { num: "01", label: "Overview" },
  { num: "02", label: "What we found" },
  { num: "03", label: "What this costs" },
  { num: "04", label: "Our recommendation" },
  { num: "05", label: "Next step" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getCtaHref(ctaType: string, ctaValue: string | null) {
  if (!ctaValue) return "#";
  if (ctaType === "reply") return `mailto:${ctaValue}`;
  if (ctaType === "whatsapp") return `https://wa.me/${ctaValue.replace(/\D/g, "")}`;
  return ctaValue;
}

function IconRevenue({ icon }: { icon: string }) {
  if (icon === "clock")
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
  if (icon === "phone")
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" /></svg>;
  if (icon === "chart")
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
  // star
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

function useActiveSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id as typeof SECTION_IDS[number]);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useRevenuCounter(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!trigger || target <= 0) return;
    const start = Date.now();
    const duration = 1800;
    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [trigger, target]);

  return count;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function OpenedBanner({ lastViewed, brandColour }: { lastViewed: Date | null | undefined; brandColour: string }) {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!lastViewed) return;
    const diff = (Date.now() - new Date(lastViewed).getTime()) / 60000;
    if (diff > 30) return;
    setMinutes(Math.max(0, Math.floor(diff)));
    const interval = setInterval(() => {
      const m = Math.floor((Date.now() - new Date(lastViewed).getTime()) / 60000);
      if (m > 30) { clearInterval(interval); setMinutes(null); } else setMinutes(m);
    }, 60000);
    return () => clearInterval(interval);
  }, [lastViewed]);

  if (minutes === null) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 11, color: "#15803d",
      background: "#f0fdf4", padding: "5px 10px", borderRadius: 20,
      border: "0.5px solid #bbf7d0", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0, animation: "venn-pulse 2s ease-in-out infinite" }} />
      Opened {minutes === 0 ? "just now" : `${minutes}m ago`} — We know you&apos;re reading this.
    </div>
  );
}

export function ProspectCard({
  businessName,
  headline,
  subheadline,
  niche,
  location,
  googleRating,
  reviewCount,
  observations,
  revenueLoss,
  revenueBreakdown,
  approachMoves,
  minutesAnalysing,
  signalBanner,
  brandColour,
  logoUrl,
  agencyName,
  agencyOwnerName,
  agencyOwnerPhoto,
  ctaType,
  ctaValue,
  ctaText,
  lastViewed,
}: ProspectCardProps) {
  const active = useActiveSection();
  const revenueRef = useRef<HTMLDivElement>(null);
  const revenueInView = useInView(revenueRef as React.RefObject<HTMLElement>);
  const brand = brandColour || "#C4973F";

  // Parse revenue total from breakdown or string
  const revenueTotal = (() => {
    if (revenueBreakdown && revenueBreakdown.length > 0) {
      return revenueBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
    }
    if (revenueLoss) {
      const num = parseInt(revenueLoss.replace(/[^0-9]/g, ""), 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  })();

  const count = useRevenuCounter(revenueTotal, revenueInView);

  // Rating comparison
  const ratingHigherThan = googleRating
    ? googleRating >= 4.0
      ? Math.round((googleRating - 4.0) * 25 + 50)
      : Math.round((4.0 - googleRating) * 25)
    : null;
  const ratingBetter = googleRating ? googleRating >= 4.0 : false;

  const ctaHref = getCtaHref(ctaType, ctaValue);
  const mins = minutesAnalysing ?? 14;

  return (
    <>
      <style>{`
        :root { --brand: ${brand}; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #FFFDF8; font-family: Inter, system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

        /* Sidebar */
        .vp-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 180px; background: #0A0907; border-right: 0.5px solid #1E1C18;
          display: flex; flex-direction: column; padding: 32px 0; z-index: 100;
          overflow-y: auto;
        }
        .vp-sidebar-brand { padding: 0 20px 28px; border-bottom: 0.5px solid #1E1C18; }
        .vp-sidebar-logo { height: 24px; max-width: 120px; object-fit: contain; margin-bottom: 8px; }
        .vp-sidebar-name { font-size: 13px; font-weight: 600; color: #FFFDF8; line-height: 1.2; }
        .vp-nav { padding: 20px 0; flex: 1; }
        .vp-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 20px;
          cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left;
        }
        .vp-nav-num { font-size: 10px; color: #2A2826; font-family: monospace; transition: color 0.15s; }
        .vp-nav-label { font-size: 12px; color: #444440; transition: color 0.15s; }
        .vp-nav-item.active .vp-nav-num,
        .vp-nav-item.active .vp-nav-label { color: var(--brand); }
        .vp-nav-item:hover .vp-nav-label { color: #FFFDF8; }

        /* Mobile dots */
        .vp-dots {
          display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: #0A0907; border-bottom: 0.5px solid #1E1C18;
          padding: 10px 16px; justify-content: center; gap: 12px; align-items: center;
        }
        .vp-dot {
          width: 7px; height: 7px; border-radius: 50%; border: none; cursor: pointer; padding: 0;
          background: #2A2826; transition: background 0.2s;
        }
        .vp-dot.active { background: var(--brand); }

        /* Main */
        .vp-main { padding-left: 200px; }
        .vp-content { max-width: 860px; }

        /* Top bar */
        .vp-topbar {
          padding: 14px 48px; display: flex; align-items: center;
          justify-content: space-between; border-bottom: 0.5px solid #F0EDE6;
          background: #FFFDF8; position: sticky; top: 0; z-index: 50;
        }
        .vp-topbar-label { font-size: 9px; letter-spacing: 0.15em; color: var(--brand); text-transform: uppercase; }

        /* Sections */
        .vp-section { padding: 72px 48px; }
        .vp-section-dark { background: #0A0907; padding: 72px 48px; }
        .vp-section-warm { background: #F5F1E8; padding: 72px 48px; }
        .vp-section-label { font-size: 10px; letter-spacing: 0.14em; color: var(--brand); text-transform: uppercase; margin-bottom: 32px; display: block; }

        /* Section 01 */
        .vp-s01-eyebrow { font-size: 12px; color: #888580; letter-spacing: 0.06em; margin-bottom: 16px; text-transform: uppercase; }
        .vp-business-name { font-family: "Instrument Serif", Georgia, serif; font-size: 64px; font-weight: 400; color: #0A0907; line-height: 1.0; letter-spacing: -0.02em; margin: 0 0 20px; }
        .vp-gold-rule { width: 24px; height: 2px; background: var(--brand); margin-bottom: 24px; }
        .vp-overview-body { font-size: 16px; line-height: 1.7; color: #555250; max-width: 560px; }
        .vp-signal-banner { display: flex; align-items: center; gap: 8px; background: #f0fdf4; border: 0.5px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-top: 28px; max-width: 600px; }
        .vp-signal-text { font-size: 13px; color: #15803d; line-height: 1.5; }
        .vp-signal-live { font-size: 11px; color: #888580; margin-top: 4px; }

        /* Section 02 */
        .vp-s02-head { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; align-items: end; }
        .vp-s02-title { font-family: "Instrument Serif", Georgia, serif; font-size: 36px; font-weight: 400; color: #0A0907; line-height: 1.15; margin: 0; }
        .vp-s02-sub { font-size: 14px; color: #888580; line-height: 1.65; }
        .vp-signal-cards { display: flex; flex-direction: column; gap: 16px; }
        .vp-signal-card { background: #fff; border: 0.5px solid #E8E4DC; border-radius: 8px; padding: 20px; }
        .vp-signal-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .vp-signal-card-title { font-size: 14px; font-weight: 600; color: #0A0907; }
        .vp-impact-high { background: #fff0f0; color: #c0392b; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; }
        .vp-impact-medium { background: #fef9ec; color: #8a6800; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; }
        .vp-review-quote { font-size: 13px; font-style: italic; color: #555250; line-height: 1.6; border-left: 2px solid #E8E4DC; padding-left: 12px; margin: 0 0 8px; }
        .vp-signal-freq { font-size: 11px; color: #888580; }
        .vp-rating-bar { margin-top: 28px; padding-top: 24px; border-top: 0.5px solid #F0EDE6; }
        .vp-rating-text { font-size: 14px; color: #555250; }
        .vp-rating-text strong { color: #0A0907; }

        /* Section 03 */
        .vp-s03-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .vp-revenue-label-sm { font-size: 10px; letter-spacing: 0.12em; color: var(--brand); text-transform: uppercase; margin-bottom: 16px; display: block; }
        .vp-revenue-big { font-family: "Instrument Serif", Georgia, serif; font-size: 56px; color: var(--brand); line-height: 1; font-weight: 400; }
        .vp-revenue-sub { font-size: 13px; color: #444440; margin-top: 6px; }
        .vp-revenue-desc { font-size: 14px; color: #888580; line-height: 1.6; margin-top: 16px; }
        .vp-breakdown-list { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
        .vp-breakdown-item { display: flex; align-items: center; gap: 12px; }
        .vp-breakdown-icon { color: var(--brand); flex-shrink: 0; }
        .vp-breakdown-desc { font-size: 13px; color: #888580; flex: 1; line-height: 1.4; }
        .vp-breakdown-amount { font-size: 14px; font-weight: 600; color: var(--brand); white-space: nowrap; }

        /* Section 04 */
        .vp-s04-head { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 48px; align-items: end; }
        .vp-s04-title { font-family: "Instrument Serif", Georgia, serif; font-size: 36px; font-weight: 400; color: #0A0907; line-height: 1.15; margin: 0; }
        .vp-s04-sub { font-size: 14px; color: #888580; line-height: 1.65; }
        .vp-approach-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .vp-approach-num { width: 28px; height: 28px; border-radius: 50%; background: var(--brand); color: #0A0907; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .vp-approach-title { font-size: 15px; font-weight: 600; color: #0A0907; margin-bottom: 8px; }
        .vp-approach-body { font-size: 13px; color: #555250; line-height: 1.65; }

        /* Section 05 */
        .vp-s05-split { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .vp-s05-left-title { font-family: "Instrument Serif", Georgia, serif; font-size: 32px; font-weight: 400; color: #0A0907; line-height: 1.2; margin: 0 0 16px; }
        .vp-owner-photo { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 0.5px solid #E8E4DC; margin-bottom: 16px; }
        .vp-owner-initials { width: 64px; height: 64px; border-radius: 50%; background: #1A1814; display: flex; align-items: center; justify-content: center; font-size: 22px; font-family: "Instrument Serif", Georgia, serif; color: var(--brand); margin-bottom: 16px; }
        .vp-cta-body-text { font-size: 14px; color: #555250; line-height: 1.65; margin-bottom: 24px; }
        .vp-cta-btn { display: block; width: 100%; text-align: center; padding: 16px 24px; border-radius: 8px; background: var(--brand); color: #0A0907; font-size: 15px; font-weight: 600; text-decoration: none; min-height: 52px; transition: opacity 0.15s; }
        .vp-cta-btn:hover { opacity: 0.88; }
        .vp-cta-footnote { font-size: 12px; color: #888580; text-align: center; margin-top: 12px; }
        .vp-owner-name { font-size: 14px; font-weight: 600; color: #0A0907; }
        .vp-owner-title { font-size: 12px; color: #888580; }

        /* Footer */
        .vp-footer { padding: 24px 48px; border-top: 0.5px solid #F0EDE6; display: flex; justify-content: space-between; align-items: center; }
        .vp-footer-agency { font-size: 12px; color: #888580; }
        .vp-footer-powered { font-size: 11px; color: #C0B8B0; }

        /* Sticky mobile CTA */
        .vp-sticky-cta { display: none; }

        /* Fade-in animation */
        .vp-fade { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .vp-fade.visible { opacity: 1; transform: translateY(0); }

        /* Pulse */
        @keyframes venn-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }

        /* Mobile */
        @media (max-width: 768px) {
          .vp-sidebar { display: none; }
          .vp-dots { display: flex; }
          .vp-main { padding-left: 0; padding-top: 36px; }
          .vp-topbar { padding: 10px 16px; }
          .vp-section, .vp-section-dark, .vp-section-warm { padding: 48px 16px; }
          .vp-business-name { font-size: 36px; }
          .vp-s02-head, .vp-s03-inner, .vp-s04-head, .vp-s05-split { grid-template-columns: 1fr; gap: 20px; }
          .vp-approach-cols { grid-template-columns: 1fr; gap: 20px; }
          .vp-revenue-big { font-size: 40px; }
          .vp-sticky-cta {
            display: block; position: fixed; bottom: 0; left: 0; right: 0; z-index: 300;
            padding: 12px 16px; background: var(--brand);
            text-align: center; font-size: 15px; font-weight: 600; color: #0A0907;
            text-decoration: none; min-height: 52px; line-height: 28px;
            box-shadow: 0 -2px 20px rgba(0,0,0,0.15);
          }
          body { padding-bottom: 68px; }
        }
        @media (min-width: 769px) {
          .vp-sticky-cta { display: none !important; }
        }
      `}</style>

      {/* Sidebar (desktop) */}
      <nav className="vp-sidebar" aria-label="Card sections">
        <div className="vp-sidebar-brand">
          {logoUrl ? (
            <img src={logoUrl} alt={agencyName ?? "Agency"} className="vp-sidebar-logo" />
          ) : (
            <div style={{ fontSize: 14, fontWeight: 700, color: brand, marginBottom: 6 }}>{agencyName ?? "Agency"}</div>
          )}
          <div className="vp-sidebar-name">{agencyName ?? ""}</div>
        </div>
        <div className="vp-nav">
          {NAV_LABELS.map((item, i) => (
            <button
              key={item.num}
              className={`vp-nav-item${active === i ? " active" : ""}`}
              onClick={() => scrollToSection(SECTION_IDS[i])}
            >
              <span className="vp-nav-num">{item.num}</span>
              <span className="vp-nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile dot nav */}
      <div className="vp-dots" aria-hidden>
        {SECTION_IDS.map((id, i) => (
          <button key={id} className={`vp-dot${active === i ? " active" : ""}`} onClick={() => scrollToSection(id)} aria-label={NAV_LABELS[i].label} />
        ))}
      </div>

      {/* Main */}
      <main className="vp-main">
        <div className="vp-content">

          {/* Top bar */}
          <div className="vp-topbar">
            <span className="vp-topbar-label">Your Prospect Card</span>
            <OpenedBanner lastViewed={lastViewed} brandColour={brand} />
          </div>

          {/* S01 — Overview */}
          <section id="s01" className="vp-section">
            <FadeIn>
              <p className="vp-s01-eyebrow">
                WE SPENT {mins} MINUTES ANALYSING
              </p>
              <h1 className="vp-business-name">{businessName}</h1>
              <div className="vp-gold-rule" />
              <p className="vp-overview-body">
                {subheadline ?? `Here's what we found about your business, the customers you're attracting, and the revenue you might be leaving behind.`}
              </p>

              {signalBanner && (
                <div className="vp-signal-banner">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "venn-pulse 2s ease-in-out infinite" }} />
                  <div>
                    <p className="vp-signal-text">{signalBanner}</p>
                    <p className="vp-signal-live">This card updates as new signals come in. • Live</p>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 12, color: "#C0B8B0", marginTop: 16 }}>
                {niche} · {location}
                {googleRating ? ` · ${googleRating}★ (${reviewCount ?? 0} reviews)` : ""}
              </p>
            </FadeIn>
          </section>

          {/* S02 — What we found */}
          <section id="s02" className="vp-section" style={{ borderTop: "0.5px solid #F0EDE6" }}>
            <FadeIn>
              <span className="vp-section-label">02 &nbsp; WHAT WE FOUND</span>
              <div className="vp-s02-head">
                <h2 className="vp-s02-title">
                  The signals in your reviews<br />tell an important story.
                </h2>
                <p className="vp-s02-sub">
                  We analysed {reviewCount ?? "your"} Google Reviews.
                  Here are the patterns we kept seeing.
                </p>
              </div>
            </FadeIn>

            <div className="vp-signal-cards">
              {observations.map((obs, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="vp-signal-card">
                    <div className="vp-signal-card-head">
                      <span className="vp-signal-card-title">{obs.title}</span>
                      {obs.impact === "high" && <span className="vp-impact-high">High</span>}
                      {obs.impact === "medium" && <span className="vp-impact-medium">Medium</span>}
                    </div>
                    <p style={{ fontSize: 13, color: "#555250", lineHeight: 1.6, marginBottom: obs.reviewQuote ? 12 : 0 }}>
                      {obs.detail}
                    </p>
                    {obs.reviewQuote && (
                      <blockquote className="vp-review-quote">&ldquo;{obs.reviewQuote}&rdquo;</blockquote>
                    )}
                    {obs.frequency && (
                      <p className="vp-signal-freq">— {obs.frequency}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>

            {googleRating && (
              <FadeIn delay={300}>
                <div className="vp-rating-bar">
                  <p className="vp-rating-text">
                    Your average rating is <strong>{googleRating}★</strong>{" "}
                    {ratingHigherThan !== null && (
                      <>— {ratingBetter ? "higher" : "lower"} than {ratingHigherThan}% of {niche} businesses in {location}.</>
                    )}
                  </p>
                </div>
              </FadeIn>
            )}
          </section>

          {/* S03 — Cost section (dark) */}
          <section id="s03" className="vp-section-dark" ref={revenueRef}>
            <FadeIn>
              <span className="vp-section-label">03 &nbsp; WHAT THIS IS COSTING</span>
              <h2 style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 400, color: "#FFFDF8", lineHeight: 1.2, marginBottom: 48 }}>
                Small fixes could unlock<br />significant revenue.
              </h2>
            </FadeIn>
            <div className="vp-s03-inner">
              <FadeIn>
                <span className="vp-revenue-label-sm">ESTIMATED MONTHLY IMPACT</span>
                <div className="vp-revenue-big">
                  £{count.toLocaleString()}
                </div>
                <p className="vp-revenue-sub">per month</p>
                <p className="vp-revenue-desc">in estimated lost revenue from signals we found in your reviews and digital presence.</p>
              </FadeIn>
              {revenueBreakdown && revenueBreakdown.length > 0 && (
                <FadeIn delay={150}>
                  <div className="vp-breakdown-list">
                    {revenueBreakdown.map((item, i) => (
                      <div key={i} className="vp-breakdown-item">
                        <span className="vp-breakdown-icon"><IconRevenue icon={item.icon} /></span>
                        <span className="vp-breakdown-desc">{item.description}</span>
                        <span className="vp-breakdown-amount">£{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}
            </div>
          </section>

          {/* S04 — Recommendation (warm bg) */}
          <section id="s04" className="vp-section-warm">
            <FadeIn>
              <span className="vp-section-label">04 &nbsp; OUR RECOMMENDATION</span>
              <div className="vp-s04-head">
                <h2 className="vp-s04-title">Our approach in three moves.</h2>
                <p className="vp-s04-sub">A focused plan to remove friction and help you grow.</p>
              </div>
            </FadeIn>
            <div className="vp-approach-cols">
              {(approachMoves && approachMoves.length > 0
                ? approachMoves
                : [
                    { title: "Remove friction", body: "Fix the booking experience. Your competitors offer instant online booking — this is fixable in 48 hours." },
                    { title: "Capture more reviews", body: "Your clients love their results. An automated follow-up asking satisfied clients to share their experience costs nothing." },
                    { title: "Reactivate past clients", body: "A meaningful portion of your revenue potential sits in dormant client records. A simple sequence re-engages them without discounting." },
                  ]
              ).slice(0, 3).map((move, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div>
                    <div className="vp-approach-num">{i + 1}</div>
                    <p className="vp-approach-title">{move.title}</p>
                    <p className="vp-approach-body">{move.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* S05 — Next step */}
          <section id="s05" className="vp-section" style={{ borderTop: "0.5px solid #F0EDE6" }}>
            <FadeIn>
              <span className="vp-section-label">05 &nbsp; NEXT STEP</span>
            </FadeIn>
            <div className="vp-s05-split">
              <FadeIn>
                <h2 className="vp-s05-left-title">
                  If this resonates,<br />let&apos;s talk.
                </h2>
                <p style={{ fontSize: 14, color: "#888580", lineHeight: 1.65, maxWidth: 320 }}>
                  This analysis was built specifically for {businessName}. No template. No guess work.
                </p>
              </FadeIn>
              <FadeIn delay={100}>
                {agencyOwnerPhoto ? (
                  <img src={agencyOwnerPhoto} alt={agencyOwnerName ?? "Agency owner"} className="vp-owner-photo" />
                ) : (
                  <div className="vp-owner-initials">
                    {(agencyOwnerName ?? agencyName ?? "A")[0]}
                  </div>
                )}
                <div className="vp-owner-name">{agencyOwnerName ?? agencyName ?? ""}</div>
                <div className="vp-owner-title" style={{ marginBottom: 20 }}>{agencyName ? `Founder, ${agencyName}` : ""}</div>
                <p className="vp-cta-body-text">
                  I&apos;d love to show you exactly how we&apos;d implement these changes for {businessName}.
                </p>
                <a href={ctaHref} target={ctaType !== "reply" ? "_blank" : undefined} rel="noopener noreferrer" className="vp-cta-btn">
                  {ctaText}
                </a>
                <p className="vp-cta-footnote">No call. No pressure. Just a conversation.</p>
              </FadeIn>
            </div>
          </section>

          {/* Footer */}
          <footer className="vp-footer">
            <span className="vp-footer-agency">{agencyName ?? "Venn"}</span>
            <span className="vp-footer-powered">Powered by ⊙ venn</span>
          </footer>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <a href={ctaHref} target={ctaType !== "reply" ? "_blank" : undefined} rel="noopener noreferrer" className="vp-sticky-cta">
        {ctaText}
      </a>
    </>
  );
}

// FadeIn helper — pure CSS via IntersectionObserver
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return <div ref={ref} className="vp-fade">{children}</div>;
}

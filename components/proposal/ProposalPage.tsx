"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ProposalPhase {
  phase: string;
  title: string;
  duration: string;
  bullets: string[];
}

interface ProposalBeforeAfter {
  before: string;
  after: string;
}

interface ProposalQuestion {
  id: string;
  visitorName: string;
  question: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  isPublic?: boolean;
}

interface ProposalPageProps {
  slug: string;
  title: string;
  businessName: string;
  niche: string;
  location: string;
  threadSection: string | null;
  currentState: string | null;
  visionSection: string | null;
  planSection: ProposalPhase[] | null;
  beforeAfter: ProposalBeforeAfter[] | null;
  investmentContext: string | null;
  closingSection: string | null;
  depositAmount: number | null;
  status: string;
  questions: ProposalQuestion[];
  agencyName: string | null;
  agencyOwnerName: string | null;
  agencyOwnerPhoto: string | null;
  logoUrl: string | null;
  brandColour: string;
  isPaid: boolean;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

function FadeIn({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const SECTIONS = [
  { id: "s-thread", label: "Overview" },
  { id: "s-state", label: "Where You Are" },
  { id: "s-vision", label: "The Vision" },
  { id: "s-before-after", label: "The Shift" },
  { id: "s-plan", label: "The Plan" },
  { id: "s-investment", label: "Investment" },
  { id: "s-qa", label: "Questions" },
];

export function ProposalPage({
  slug,
  title,
  businessName,
  threadSection,
  currentState,
  visionSection,
  planSection,
  beforeAfter,
  investmentContext,
  closingSection,
  depositAmount,
  status,
  questions: initialQuestions,
  agencyName,
  agencyOwnerName,
  agencyOwnerPhoto,
  logoUrl,
  brandColour,
  isPaid,
}: ProposalPageProps) {
  const sectionIds = SECTIONS.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);

  const [accepted, setAccepted] = useState(status === "accepted" || status === "paid");
  const [paid, setPaid] = useState(status === "paid" || isPaid);
  const [accepting, setAccepting] = useState(false);

  const [questions, setQuestions] = useState<ProposalQuestion[]>(initialQuestions);
  const [qName, setQName] = useState("");
  const [qText, setQText] = useState("");
  const [qSubmitting, setQSubmitting] = useState(false);
  const [qSubmitted, setQSubmitted] = useState(false);

  const handleAccept = useCallback(async () => {
    setAccepting(true);
    try {
      await fetch(`/api/proposals/${slug}/accept`, { method: "POST" });
      setAccepted(true);
    } finally {
      setAccepting(false);
    }
  }, [slug]);

  const handlePay = useCallback(async () => {
    const res = await fetch(`/api/proposals/${slug}/pay`, { method: "POST" });
    const data = await res.json() as { url?: string };
    if (data.url) window.location.href = data.url;
  }, [slug]);

  const handleQuestion = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qName.trim() || !qText.trim()) return;
    setQSubmitting(true);
    try {
      const res = await fetch(`/api/proposals/${slug}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorName: qName.trim(), question: qText.trim() }),
      });
      if (res.ok) {
        const data = await res.json() as { question: ProposalQuestion };
        setQuestions((prev) => [...prev, data.question]);
        setQSubmitted(true);
        setQName("");
        setQText("");
      }
    } finally {
      setQSubmitting(false);
    }
  }, [slug, qName, qText]);

  const gold = brandColour;
  const ownerInitials = (agencyOwnerName ?? agencyName ?? "V")
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <>
      <style>{`
        :root { --gold: ${gold}; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0907; color: #FFFDF8; }
        .pp-wrap { display: flex; min-height: 100vh; }
        .pp-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0; width: 200px;
          background: #0A0907; border-right: 0.5px solid #1E1C18;
          padding: 32px 20px; display: flex; flex-direction: column; z-index: 50;
        }
        .pp-sidebar-logo { margin-bottom: 24px; }
        .pp-sidebar-logo img { height: 28px; width: auto; object-fit: contain; }
        .pp-sidebar-agency {
          font-family: var(--font-inter); font-size: 11px; color: #555250;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 28px;
        }
        .pp-sidebar-title {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 14px; color: #FFFDF8; line-height: 1.4; margin-bottom: 28px;
        }
        .pp-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .pp-nav-item {
          font-family: var(--font-inter); font-size: 11px; color: #444440;
          padding: 5px 8px; border-radius: 4px; cursor: pointer; transition: color 0.2s;
          background: none; border: none; text-align: left;
        }
        .pp-nav-item:hover { color: #888580; }
        .pp-nav-item.active { color: var(--gold); }
        .pp-sidebar-cta { margin-top: 24px; }
        .pp-sidebar-status {
          font-family: var(--font-inter); font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 4px 8px; border-radius: 4px;
          margin-bottom: 10px; display: inline-block;
        }
        .pp-status-draft { background: #1E1C18; color: #555250; }
        .pp-status-viewed { background: #1a1808; color: #C4973F; }
        .pp-status-accepted { background: #0d1a0d; color: #4CAF50; }
        .pp-status-paid { background: #0d1a0d; color: #4CAF50; }
        .pp-btn-accept {
          width: 100%; padding: 9px 0; border-radius: 5px;
          border: 0.5px solid var(--gold); background: transparent;
          color: var(--gold); font-family: var(--font-inter); font-size: 12px;
          cursor: pointer; transition: background 0.15s, color 0.15s; margin-bottom: 8px;
        }
        .pp-btn-accept:hover { background: var(--gold); color: #0A0907; }
        .pp-btn-pay {
          width: 100%; padding: 9px 0; border-radius: 5px;
          border: none; background: var(--gold);
          color: #0A0907; font-family: var(--font-inter); font-size: 12px;
          font-weight: 600; cursor: pointer;
        }
        .pp-btn-pay:hover { opacity: 0.9; }
        .pp-main { margin-left: 200px; max-width: 720px; padding: 64px 48px 120px; }

        .pp-section { margin-bottom: 80px; scroll-margin-top: 80px; }
        .pp-section-label {
          font-family: var(--font-inter); font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
        }
        .pp-section-heading {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 32px; color: #FFFDF8; line-height: 1.25; font-weight: 400;
          margin-bottom: 20px;
        }
        .pp-prose {
          font-family: var(--font-inter); font-size: 15px; color: #888580;
          line-height: 1.8; white-space: pre-line;
        }

        .pp-title-block { margin-bottom: 64px; }
        .pp-title-block h1 {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 44px; color: #FFFDF8; font-weight: 400; line-height: 1.15; margin-bottom: 8px;
        }
        .pp-title-block .pp-for {
          font-family: var(--font-inter); font-size: 13px; color: #555250;
        }
        .pp-title-block .pp-for span { color: #FFFDF8; }

        .pp-divider {
          height: 0.5px; background: #1E1C18; margin: 40px 0;
        }

        .pp-ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #1E1C18; border-radius: 8px; overflow: hidden; }
        .pp-ba-col { background: #0F0E0B; padding: 24px; }
        .pp-ba-col-label {
          font-family: var(--font-inter); font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; color: #444440; margin-bottom: 16px;
        }
        .pp-ba-col.after .pp-ba-col-label { color: var(--gold); }
        .pp-ba-item { margin-bottom: 14px; font-family: var(--font-inter); font-size: 13px; line-height: 1.6; }
        .pp-ba-col.before .pp-ba-item { color: #555250; }
        .pp-ba-col.after .pp-ba-item { color: #FFFDF8; }

        .pp-phase { margin-bottom: 32px; }
        .pp-phase-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
        .pp-phase-tag {
          font-family: var(--font-inter); font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--gold); flex-shrink: 0;
        }
        .pp-phase-title {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 20px; color: #FFFDF8; font-weight: 400;
        }
        .pp-phase-dur {
          font-family: var(--font-inter); font-size: 11px; color: #444440; margin-left: auto;
        }
        .pp-phase-bullets { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .pp-phase-bullets li {
          font-family: var(--font-inter); font-size: 13px; color: #888580; line-height: 1.6;
          padding-left: 16px; position: relative;
        }
        .pp-phase-bullets li::before {
          content: ""; position: absolute; left: 0; top: 9px;
          width: 4px; height: 4px; border-radius: 50%; background: #333;
        }

        .pp-investment-box {
          background: #0F0E0B; border: 0.5px solid #1E1C18; border-radius: 10px;
          padding: 28px; margin-top: 24px;
        }
        .pp-investment-amount {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 40px; color: var(--gold); margin-bottom: 4px;
        }
        .pp-investment-label {
          font-family: var(--font-inter); font-size: 12px; color: #444440; margin-bottom: 20px;
        }
        .pp-investment-btns { display: flex; gap: 10px; }
        .pp-invest-btn-accept {
          flex: 1; padding: 12px; border-radius: 6px;
          border: 0.5px solid var(--gold); background: transparent;
          color: var(--gold); font-family: var(--font-inter); font-size: 13px;
          cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .pp-invest-btn-accept:hover { background: var(--gold); color: #0A0907; }
        .pp-invest-btn-pay {
          flex: 1; padding: 12px; border-radius: 6px;
          border: none; background: var(--gold);
          color: #0A0907; font-family: var(--font-inter); font-size: 13px;
          font-weight: 600; cursor: pointer;
        }
        .pp-invest-btn-pay:hover { opacity: 0.9; }
        .pp-accepted-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-inter); font-size: 12px; color: #4CAF50;
          background: #0d1a0d; border: 0.5px solid #1a2e1a;
          padding: 8px 14px; border-radius: 6px;
        }
        .pp-paid-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-inter); font-size: 12px; color: #4CAF50;
          background: #0d1a0d; border: 0.5px solid #1a2e1a;
          padding: 8px 14px; border-radius: 6px;
        }

        .pp-close-text {
          font-family: var(--font-inter); font-size: 15px; color: #888580; line-height: 1.8;
          margin-top: 20px; font-style: italic;
        }

        .pp-owner {
          display: flex; align-items: center; gap: 12px; margin-top: 28px;
          padding-top: 28px; border-top: 0.5px solid #1E1C18;
        }
        .pp-owner-photo {
          width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
          border: 0.5px solid #2A2826; flex-shrink: 0;
        }
        .pp-owner-initials {
          width: 40px; height: 40px; border-radius: 50%;
          background: #1E1C18; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-inter); font-size: 13px; color: #888580; flex-shrink: 0;
        }
        .pp-owner-name { font-family: var(--font-inter); font-size: 13px; color: #FFFDF8; }
        .pp-owner-role { font-family: var(--font-inter); font-size: 11px; color: #444440; }

        .pp-qa-existing { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
        .pp-q-block { background: #0F0E0B; border: 0.5px solid #1E1C18; border-radius: 8px; padding: 18px 20px; }
        .pp-q-meta { font-family: var(--font-inter); font-size: 11px; color: #555250; margin-bottom: 8px; }
        .pp-q-text { font-family: var(--font-inter); font-size: 14px; color: #FFFDF8; margin-bottom: 12px; line-height: 1.6; }
        .pp-q-answer {
          font-family: var(--font-inter); font-size: 13px; color: #888580; line-height: 1.7;
          border-left: 2px solid var(--gold); padding-left: 12px; margin-top: 4px;
        }
        .pp-q-unanswered { font-family: var(--font-inter); font-size: 11px; color: #333; font-style: italic; margin-top: 4px; }
        .pp-qa-form { display: flex; flex-direction: column; gap: 10px; }
        .pp-qa-input {
          background: #0F0E0B; border: 0.5px solid #1E1C18;
          border-radius: 6px; padding: 10px 14px;
          font-family: var(--font-inter); font-size: 13px; color: #FFFDF8;
          transition: border-color 0.15s; outline: none; width: 100%;
        }
        .pp-qa-input:focus { border-color: var(--gold); }
        .pp-qa-input::placeholder { color: #333; }
        .pp-qa-textarea { min-height: 80px; resize: vertical; }
        .pp-qa-submit {
          align-self: flex-start; padding: 9px 20px; border-radius: 5px;
          border: 0.5px solid var(--gold); background: transparent; color: var(--gold);
          font-family: var(--font-inter); font-size: 12px; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .pp-qa-submit:hover:not(:disabled) { background: var(--gold); color: #0A0907; }
        .pp-qa-submit:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-qa-success { font-family: var(--font-inter); font-size: 13px; color: #4CAF50; }

        .pp-dots {
          display: none; position: fixed; bottom: 80px; right: 16px;
          flex-direction: column; gap: 6px; z-index: 50;
        }
        .pp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #333; cursor: pointer; transition: background 0.2s;
        }
        .pp-dot.active { background: var(--gold); }
        .pp-mobile-cta {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          background: #0A0907; border-top: 0.5px solid #1E1C18;
          padding: 12px 20px; gap: 10px; z-index: 50;
        }
        .pp-mobile-btn {
          flex: 1; padding: 12px; border-radius: 6px; font-family: var(--font-inter);
          font-size: 13px; cursor: pointer; text-align: center;
        }

        @media (max-width: 768px) {
          .pp-sidebar { display: none; }
          .pp-main { margin-left: 0; padding: 40px 20px 120px; max-width: 100%; }
          .pp-title-block h1 { font-size: 30px; }
          .pp-section-heading { font-size: 24px; }
          .pp-investment-amount { font-size: 32px; }
          .pp-ba-grid { grid-template-columns: 1fr; }
          .pp-dots { display: flex; }
          .pp-mobile-cta { display: flex; }
        }
      `}</style>

      <div className="pp-wrap">
        <aside className="pp-sidebar">
          {logoUrl ? (
            <div className="pp-sidebar-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={agencyName ?? "Agency logo"} />
            </div>
          ) : null}
          <div className="pp-sidebar-agency">{agencyName ?? "Venn"}</div>
          <div className="pp-sidebar-title">{title}</div>

          <nav className="pp-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`pp-nav-item${activeSection === s.id ? " active" : ""}`}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="pp-sidebar-cta">
            <div className={`pp-sidebar-status pp-status-${paid ? "paid" : accepted ? "accepted" : status}`}>
              {paid ? "Deposit paid" : accepted ? "Accepted" : status === "viewed" ? "Viewed" : status === "sent" ? "Sent" : "Draft"}
            </div>
            {!accepted && !paid && (
              <>
                <button className="pp-btn-accept" onClick={handleAccept} disabled={accepting}>
                  {accepting ? "Accepting…" : "Accept proposal"}
                </button>
                {depositAmount && (
                  <button className="pp-btn-pay" onClick={handlePay}>
                    Pay deposit — £{depositAmount.toLocaleString()}
                  </button>
                )}
              </>
            )}
            {accepted && !paid && depositAmount && (
              <button className="pp-btn-pay" onClick={handlePay}>
                Pay deposit — £{depositAmount.toLocaleString()}
              </button>
            )}
            {paid && (
              <div className="pp-accepted-badge">
                <span>✓</span> Deposit received
              </div>
            )}
          </div>
        </aside>

        <main className="pp-main">
          <FadeIn className="pp-title-block">
            <h1>{title}</h1>
            <p className="pp-for">
              Prepared for <span>{businessName}</span>
              {agencyName ? <> · by <span>{agencyName}</span></> : null}
            </p>
          </FadeIn>

          {/* Section 1 — Thread */}
          {threadSection && (
            <section id="s-thread" className="pp-section">
              <FadeIn>
                <div className="pp-section-label">Overview</div>
                <div className="pp-prose">{threadSection}</div>
              </FadeIn>
            </section>
          )}

          <div className="pp-divider" />

          {/* Section 2 — Current State */}
          {currentState && (
            <section id="s-state" className="pp-section">
              <FadeIn>
                <div className="pp-section-label">Where You Are Now</div>
                <h2 className="pp-section-heading">An honest assessment.</h2>
                <div className="pp-prose">{currentState}</div>
              </FadeIn>
            </section>
          )}

          {/* Section 3 — Vision */}
          {visionSection && (
            <section id="s-vision" className="pp-section">
              <FadeIn>
                <div className="pp-section-label">The Vision</div>
                <h2 className="pp-section-heading">90 days from now.</h2>
                <div className="pp-prose">{visionSection}</div>
              </FadeIn>
            </section>
          )}

          <div className="pp-divider" />

          {/* Section 4 — Before / After */}
          {beforeAfter && beforeAfter.length > 0 && (
            <section id="s-before-after" className="pp-section">
              <FadeIn>
                <div className="pp-section-label">The Shift</div>
                <div className="pp-ba-grid">
                  <div className="pp-ba-col before">
                    <div className="pp-ba-col-label">Before</div>
                    {beforeAfter.map((item, i) => (
                      <div key={i} className="pp-ba-item">{item.before}</div>
                    ))}
                  </div>
                  <div className="pp-ba-col after">
                    <div className="pp-ba-col-label">After</div>
                    {beforeAfter.map((item, i) => (
                      <div key={i} className="pp-ba-item">{item.after}</div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </section>
          )}

          {/* Section 5 — Plan */}
          {planSection && planSection.length > 0 && (
            <section id="s-plan" className="pp-section">
              <FadeIn>
                <div className="pp-section-label">The Plan</div>
                <h2 className="pp-section-heading">How we get there.</h2>
              </FadeIn>
              {planSection.map((phase, i) => (
                <FadeIn key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="pp-phase">
                    <div className="pp-phase-header">
                      <span className="pp-phase-tag">{phase.phase}</span>
                      <span className="pp-phase-title">{phase.title}</span>
                      <span className="pp-phase-dur">{phase.duration}</span>
                    </div>
                    <ul className="pp-phase-bullets">
                      {phase.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </section>
          )}

          <div className="pp-divider" />

          {/* Section 6 — Investment */}
          <section id="s-investment" className="pp-section">
            <FadeIn>
              <div className="pp-section-label">Investment</div>
              <h2 className="pp-section-heading">What it takes to move.</h2>
              {investmentContext && (
                <div className="pp-prose" style={{ marginBottom: 24 }}>{investmentContext}</div>
              )}
              <div className="pp-investment-box">
                {depositAmount ? (
                  <>
                    <div className="pp-investment-amount">£{depositAmount.toLocaleString()}</div>
                    <div className="pp-investment-label">Deposit to begin</div>
                    {!paid && !accepted && (
                      <div className="pp-investment-btns">
                        <button className="pp-invest-btn-accept" onClick={handleAccept} disabled={accepting}>
                          {accepting ? "…" : "Accept proposal"}
                        </button>
                        <button className="pp-invest-btn-pay" onClick={handlePay}>
                          Pay deposit
                        </button>
                      </div>
                    )}
                    {accepted && !paid && (
                      <button className="pp-invest-btn-pay" style={{ width: "100%" }} onClick={handlePay}>
                        Pay deposit — £{depositAmount.toLocaleString()}
                      </button>
                    )}
                    {paid && (
                      <div className="pp-paid-badge"><span>✓</span> Deposit received — you&apos;re in.</div>
                    )}
                  </>
                ) : (
                  <>
                    {!paid && !accepted && (
                      <div className="pp-investment-btns">
                        <button className="pp-invest-btn-accept" onClick={handleAccept} disabled={accepting} style={{ flex: "none", padding: "12px 24px" }}>
                          {accepting ? "…" : "Accept this proposal"}
                        </button>
                      </div>
                    )}
                    {(accepted || paid) && (
                      <div className="pp-accepted-badge"><span>✓</span> Proposal accepted</div>
                    )}
                  </>
                )}
              </div>

              {closingSection && (
                <div className="pp-close-text">{closingSection}</div>
              )}

              <div className="pp-owner">
                {agencyOwnerPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={agencyOwnerPhoto} alt={agencyOwnerName ?? ""} className="pp-owner-photo" />
                ) : (
                  <div className="pp-owner-initials">{ownerInitials}</div>
                )}
                <div>
                  <div className="pp-owner-name">{agencyOwnerName ?? agencyName ?? "Venn"}</div>
                  <div className="pp-owner-role">{agencyName ?? ""}</div>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section 7 — Q&A */}
          <section id="s-qa" className="pp-section">
            <FadeIn>
              <div className="pp-section-label">Questions</div>
              <h2 className="pp-section-heading">Ask anything.</h2>

              {questions.length > 0 && (
                <div className="pp-qa-existing">
                  {questions.filter((q) => q.isPublic !== false).map((q) => (
                    <div key={q.id} className="pp-q-block">
                      <div className="pp-q-meta">{q.visitorName}</div>
                      <div className="pp-q-text">{q.question}</div>
                      {q.answer ? (
                        <div className="pp-q-answer">{q.answer}</div>
                      ) : (
                        <div className="pp-q-unanswered">Answer coming shortly…</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {qSubmitted ? (
                <div className="pp-qa-success">Got it — you&apos;ll see the answer here once it&apos;s been replied to.</div>
              ) : (
                <form className="pp-qa-form" onSubmit={handleQuestion}>
                  <input
                    className="pp-qa-input"
                    placeholder="Your name"
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                    required
                  />
                  <textarea
                    className="pp-qa-input pp-qa-textarea"
                    placeholder="What would you like to know?"
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="pp-qa-submit"
                    disabled={qSubmitting || !qName.trim() || !qText.trim()}
                  >
                    {qSubmitting ? "Sending…" : "Send question"}
                  </button>
                </form>
              )}
            </FadeIn>
          </section>
        </main>

        {/* Mobile dots nav */}
        <div className="pp-dots">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`pp-dot${activeSection === s.id ? " active" : ""}`}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              aria-label={s.label}
            />
          ))}
        </div>

        {/* Mobile sticky CTA */}
        <div className="pp-mobile-cta">
          {!accepted && !paid && (
            <button
              className="pp-mobile-btn"
              style={{ border: `0.5px solid ${gold}`, background: "transparent", color: gold }}
              onClick={handleAccept}
              disabled={accepting}
            >
              {accepting ? "…" : "Accept"}
            </button>
          )}
          {depositAmount && !paid && (
            <button
              className="pp-mobile-btn"
              style={{ background: gold, color: "#0A0907", fontWeight: 600, border: "none" }}
              onClick={handlePay}
            >
              Pay deposit — £{depositAmount.toLocaleString()}
            </button>
          )}
          {paid && (
            <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#4CAF50", flex: 1, textAlign: "center" }}>
              ✓ Deposit received
            </div>
          )}
          {accepted && !paid && !depositAmount && (
            <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#4CAF50", flex: 1, textAlign: "center" }}>
              ✓ Proposal accepted
            </div>
          )}
        </div>
      </div>
    </>
  );
}

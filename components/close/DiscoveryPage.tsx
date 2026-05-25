"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface DiscoveryQuestion {
  text: string;
  context?: string;
  placeholder?: string;
}

interface DiscoveryPageProps {
  slug: string;
  businessName: string;
  agencyOwnerName: string | null;
  agencyOwnerPhoto: string | null;
  agencyName: string | null;
  logoUrl: string | null;
  brandColour: string;
  questions: DiscoveryQuestion[];
  responseTime: string;
  closeIntroText: string | null;
  existingAnswers: Record<string, string>;
}

function VennMark({ size = 32, colour = "#C4973F" }: { size?: number; colour?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="12" cy="16" r="9" stroke={colour} strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="20" cy="16" r="9" stroke={colour} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

function ProgressDots({
  total,
  current,
  answered,
  gold,
}: {
  total: number;
  current: number;
  answered: number;
  gold: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = i < answered;
        const isCurrent = i === current;
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isAnswered ? gold : "transparent",
              border: `1.5px solid ${isAnswered || isCurrent ? gold : "#333"}`,
              opacity: isCurrent && !isAnswered ? 1 : isAnswered ? 1 : 0.4,
              transition: "all 0.3s ease",
              boxShadow: isCurrent && !isAnswered ? `0 0 6px ${gold}60` : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export function DiscoveryPage({
  slug,
  businessName,
  agencyOwnerName,
  agencyOwnerPhoto,
  agencyName,
  logoUrl,
  brandColour,
  questions,
  responseTime,
  closeIntroText,
  existingAnswers,
}: DiscoveryPageProps) {
  const gold = brandColour;
  const ownerFirst = (agencyOwnerName ?? agencyName ?? "We").split(" ")[0];
  const ownerInitials = (agencyOwnerName ?? agencyName ?? "V")
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const totalQ = questions.length;

  // Build initial answers from existing (supports both index 0 and 1 based keys)
  const initAnswers = () => {
    const a: string[] = Array(totalQ).fill("");
    Object.entries(existingAnswers).forEach(([k, v]) => {
      const idx = parseInt(k);
      if (!isNaN(idx) && idx < totalQ) a[idx] = v;
    });
    return a;
  };

  const [answers, setAnswers] = useState<string[]>(initAnswers);
  const [currentQ, setCurrentQ] = useState(() => {
    // Start at first unanswered
    const init = initAnswers();
    const first = init.findIndex((a) => !a.trim());
    return first === -1 ? totalQ : first;
  });
  const [showNext, setShowNext] = useState<boolean[]>(Array(totalQ).fill(false));
  const [phase, setPhase] = useState<"questions" | "summary" | "confirmed">("questions");
  const [submitting, setSubmitting] = useState(false);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Check if all answered on mount
  useEffect(() => {
    const init = initAnswers();
    const allAnswered = init.every((a) => a.trim().length > 0);
    if (allAnswered && totalQ > 0) setPhase("summary");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAnswer = useCallback(async (index: number, text: string) => {
    if (!text.trim()) return;
    await fetch(`/api/close/${slug}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionIndex: index,
        questionText: questions[index]?.text ?? "",
        answer: text.trim(),
      }),
    });
  }, [slug, questions]);

  const handleChange = (index: number, value: string) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    if (value.trim() && !showNext[index]) {
      const sn = [...showNext];
      sn[index] = true;
      setShowNext(sn);
    }
    // Auto-resize
    const el = textareaRefs.current[index];
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(100, el.scrollHeight)}px`;
    }
  };

  const handleNext = async (index: number) => {
    await saveAnswer(index, answers[index]);
    if (index < totalQ - 1) {
      setCurrentQ(index + 1);
      setTimeout(() => {
        textareaRefs.current[index + 1]?.focus();
        textareaRefs.current[index + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    } else {
      setPhase("summary");
    }
  };

  const handleEditQ = (index: number) => {
    setCurrentQ(index);
    setTimeout(() => {
      textareaRefs.current[index]?.focus();
      textareaRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Save any unsaved answers
    for (let i = 0; i < totalQ; i++) {
      if (answers[i].trim()) await saveAnswer(i, answers[i]);
    }
    await fetch(`/api/close/${slug}/complete`, { method: "PATCH" });
    setPhase("confirmed");
  };

  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  const defaultIntro = `I've already looked at ${businessName} in detail. Before I build your proposal I want to make sure it reflects what actually matters to you — not just what I found.\n\nThis takes about three minutes. There are no wrong answers.`;
  const introText = closeIntroText || defaultIntro;

  if (phase === "confirmed") {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0A0907; color: #FFFDF8; }
          @keyframes breathe { 0%,100%{opacity:.4;transform:scale(.95)} 50%{opacity:.7;transform:scale(1.05)} }
        `}</style>
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center",
          background: "#0A0907",
        }}>
          <div style={{ animation: "breathe 3s ease-in-out infinite", marginBottom: 32 }}>
            <VennMark size={48} colour={gold} />
          </div>
          <h1 style={{
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            fontSize: "clamp(24px, 5vw, 36px)", color: "#FFFDF8", fontWeight: 400,
            marginBottom: 16, lineHeight: 1.2,
          }}>
            Your answers are with {ownerFirst}.
          </h1>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: 16, color: "#888580",
            maxWidth: 400, lineHeight: 1.7, marginBottom: 32,
          }}>
            We&apos;ll have your proposal ready within {responseTime}.<br />
            No need to do anything — we&apos;ll be in touch.
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "#333230" }}>
            Questions? Reply directly to the email you received.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0907; color: #FFFDF8; }
        .disc-wrap { min-height: 100vh; background: #0A0907; padding: 32px 0 80px; }
        .disc-inner { max-width: 640px; margin: 0 auto; padding: 0 40px; }
        .disc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .disc-logo { display: flex; align-items: center; gap: 10px; }
        .disc-logo img { height: 24px; width: auto; object-fit: contain; }
        .disc-logo-text { font-family: var(--font-inter); font-size: 13px; color: #FFFDF8; font-weight: 500; }
        .disc-private { display: flex; align-items: center; gap: 6px; font-family: var(--font-inter); font-size: 11px; color: #444440; letter-spacing: 0.06em; text-transform: uppercase; }
        .disc-private-dot { width: 6px; height: 6px; border-radius: 50%; background: ${gold}; }

        .disc-intro { background: #0F0E0B; border: 0.5px solid #1E1C18; border-radius: 8px; padding: 32px; margin-bottom: 32px; }
        .disc-intro-from { font-family: var(--font-inter); font-size: 10px; color: ${gold}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
        .disc-intro-heading { font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif; font-size: 26px; color: #FFFDF8; font-weight: 400; line-height: 1.25; margin-bottom: 16px; }
        .disc-intro-body { font-family: var(--font-inter); font-size: 15px; color: #888580; line-height: 1.8; white-space: pre-line; }

        .disc-q-card { background: #0F0E0B; border: 0.5px solid #1E1C18; border-radius: 8px; margin-bottom: 16px; overflow: hidden; transition: all 0.35s ease; }
        .disc-q-card.collapsed { height: 56px; opacity: 0.5; }
        .disc-q-card.current { border-color: ${gold}30; }
        .disc-q-card-inner { padding: 32px; }
        .disc-q-collapsed-row { height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; cursor: pointer; }
        .disc-q-collapsed-label { font-family: var(--font-inter); font-size: 11px; color: #444440; }
        .disc-q-collapsed-answer { font-family: var(--font-inter); font-size: 12px; color: #888580; flex: 1; margin: 0 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .disc-q-edit { font-family: var(--font-inter); font-size: 11px; color: ${gold}; cursor: pointer; flex-shrink: 0; background: none; border: none; }
        .disc-q-num { font-family: var(--font-inter); font-size: 10px; color: ${gold}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
        .disc-q-text { font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif; font-size: 24px; color: #FFFDF8; font-style: italic; font-weight: 400; line-height: 1.35; margin-bottom: 12px; }
        .disc-q-context { font-family: var(--font-inter); font-size: 14px; color: #555250; line-height: 1.6; margin-bottom: 20px; }
        .disc-textarea { width: 100%; min-height: 100px; background: #1A1814; border: 0.5px solid #1E1C18; border-radius: 6px; padding: 16px; font-family: var(--font-inter); font-size: 15px; color: #FFFDF8; line-height: 1.6; resize: none; outline: none; transition: border-color 0.15s; }
        .disc-textarea:focus { border-color: ${gold}50; }
        .disc-textarea::placeholder { color: #333; }
        .disc-next-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
        .disc-next-btn { padding: 12px 24px; border-radius: 6px; background: ${gold}; color: #0A0907; font-family: var(--font-inter); font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.3s ease; }
        .disc-next-btn.hidden { opacity: 0; pointer-events: none; }
        .disc-next-btn:hover { opacity: 0.9; }

        .disc-summary { background: #0F0E0B; border: 0.5px solid #1E1C18; border-radius: 8px; padding: 32px; margin-bottom: 24px; }
        .disc-summary-heading { font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif; font-size: 28px; color: #FFFDF8; font-weight: 400; margin-bottom: 12px; }
        .disc-summary-body { font-family: var(--font-inter); font-size: 15px; color: #888580; line-height: 1.7; }
        .disc-check { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid ${gold}; margin-bottom: 20px; animation: checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes checkIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .disc-submit-btn { width: 100%; padding: 16px; border-radius: 8px; background: ${gold}; color: #0A0907; font-family: var(--font-inter); font-size: 15px; font-weight: 600; cursor: pointer; border: none; margin-top: 24px; transition: opacity 0.15s; }
        .disc-submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .disc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 640px) {
          .disc-inner { padding: 0 20px; }
          .disc-q-text { font-size: 20px; }
          .disc-intro-heading { font-size: 22px; }
          .disc-textarea { min-height: 120px; }
          .disc-next-btn { width: 100%; text-align: center; padding: 16px; font-size: 16px; }
          .disc-next-wrap { justify-content: stretch; }
        }
      `}</style>

      <div className="disc-wrap">
        <div className="disc-inner">
          {/* Header */}
          <div className="disc-header">
            <div className="disc-logo">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={agencyName ?? "Agency"} />
              ) : agencyOwnerPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agencyOwnerPhoto} alt={agencyOwnerName ?? ""} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#1E1C18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-inter)", fontSize: 11, color: gold,
                }}>
                  {ownerInitials}
                </div>
              )}
              <span className="disc-logo-text">{agencyName ?? agencyOwnerName ?? "Venn"}</span>
            </div>
            <div className="disc-private">
              <div className="disc-private-dot" />
              Private
            </div>
          </div>

          {/* Intro card */}
          <div className="disc-intro">
            <div className="disc-intro-from">{ownerFirst} asked:</div>
            <h1 className="disc-intro-heading">
              A few things before I put your proposal together.
            </h1>
            <p className="disc-intro-body">{introText}</p>
            <ProgressDots
              total={totalQ}
              current={currentQ >= totalQ ? totalQ - 1 : currentQ}
              answered={answeredCount}
              gold={gold}
            />
          </div>

          {/* Questions */}
          {phase === "questions" && (
            <>
              {questions.map((q, i) => {
                const isAnswered = i < currentQ && answers[i].trim().length > 0;
                const isCurrent = i === currentQ;
                const isLocked = i > currentQ;

                if (isAnswered) {
                  return (
                    <div key={i} className="disc-q-card collapsed">
                      <div className="disc-q-collapsed-row" onClick={() => handleEditQ(i)}>
                        <span className="disc-q-collapsed-label">Q{i + 1}</span>
                        <span className="disc-q-collapsed-answer">
                          {answers[i].slice(0, 60)}{answers[i].length > 60 ? "…" : ""}
                        </span>
                        <button className="disc-q-edit" onClick={(e) => { e.stopPropagation(); handleEditQ(i); }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                }

                if (isLocked) {
                  return (
                    <div key={i} className="disc-q-card" style={{ opacity: 0.2 }}>
                      <div className="disc-q-card-inner">
                        <div className="disc-q-num">Question {i + 1} of {totalQ}</div>
                        <div className="disc-q-text">{q.text}</div>
                      </div>
                    </div>
                  );
                }

                if (isCurrent) {
                  return (
                    <div key={i} className="disc-q-card current">
                      <div className="disc-q-card-inner">
                        <div className="disc-q-num">Question {i + 1} of {totalQ}</div>
                        <div className="disc-q-text">{q.text}</div>
                        {q.context && <div className="disc-q-context">{q.context}</div>}
                        <textarea
                          ref={(el) => { textareaRefs.current[i] = el; }}
                          className="disc-textarea"
                          placeholder={q.placeholder ?? "Take your time…"}
                          value={answers[i]}
                          onChange={(e) => handleChange(i, e.target.value)}
                          onBlur={() => { if (answers[i].trim()) saveAnswer(i, answers[i]); }}
                          onFocus={(e) => {
                            setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
                          }}
                          rows={4}
                        />
                        <div className="disc-next-wrap">
                          <button
                            className={`disc-next-btn${showNext[i] && answers[i].trim() ? "" : " hidden"}`}
                            onClick={() => handleNext(i)}
                          >
                            {i === totalQ - 1 ? "See your summary →" : "Next question →"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </>
          )}

          {/* Summary */}
          {phase === "summary" && (
            <>
              {questions.map((q, i) => (
                <div key={i} className="disc-q-card" style={{ opacity: 0.6 }}>
                  <div className="disc-q-collapsed-row" onClick={() => { setPhase("questions"); setCurrentQ(i); }}>
                    <span className="disc-q-collapsed-label">Q{i + 1}</span>
                    <span className="disc-q-collapsed-answer">
                      {answers[i]?.slice(0, 70)}{(answers[i]?.length ?? 0) > 70 ? "…" : ""}
                    </span>
                    <button className="disc-q-edit" onClick={(e) => { e.stopPropagation(); setPhase("questions"); setCurrentQ(i); }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}

              <div className="disc-summary">
                <div className="disc-check">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4,10 8,14 16,6" />
                  </svg>
                </div>
                <h2 className="disc-summary-heading">That&apos;s everything I need.</h2>
                <p className="disc-summary-body">
                  {ownerFirst} will have your proposal ready within {responseTime}.<br />
                  You&apos;ll receive it at this same link — we&apos;ll let you know when it&apos;s ready.
                </p>
                <button
                  className="disc-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send my answers →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

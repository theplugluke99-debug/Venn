"use client";

import { useState } from "react";

interface ReportContent {
  thisMonth?: string;
  completions?: string[];
  theNumbers?: string;
  howYoureLooking?: string;
  nextMonth?: string[];
  personalNote?: string;
}

interface ReportPageProps {
  slug: string;
  title: string;
  period: string;
  content: Record<string, unknown>;
  client: { businessName: string; ownerName?: string | null };
  agency: { name: string | null; ownerName: string | null; logoUrl: string | null; brandColour: string };
}

const EMOJI_LABELS = ["😟", "😕", "😐", "😊", "😄"];

export function ReportPage({ slug, title, period, content, client, agency }: ReportPageProps) {
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  const c = content as ReportContent;
  const gold = agency.brandColour || "#C4973F";

  async function submitFeedback() {
    if (!feedbackRating) return;
    setFeedbackSending(true);
    await fetch(`/api/reports/${slug}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: feedbackRating, comment: feedbackComment || undefined }),
    });
    setFeedbackSending(false);
    setFeedbackSent(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0907; color: #FFFDF8; font-family: 'Inter', sans-serif; }
        .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0A0907", padding: "0 0 80px" }}>
        {/* Header */}
        <div style={{ borderBottom: "0.5px solid #1E1C18", padding: "32px 40px 28px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.logoUrl} alt={agency.name ?? ""} style={{ height: 32, objectFit: "contain" }} />
            ) : (
              <p style={{ fontSize: 14, fontWeight: 500, color: "#888580", fontFamily: "'Inter', sans-serif" }}>
                {agency.name ?? "Your Agency"}
              </p>
            )}
            <p style={{ fontSize: 12, color: "#444440", fontFamily: "'Inter', sans-serif" }}>
              Prepared by {agency.ownerName ?? agency.name ?? "your agency"}
            </p>
          </div>
          <h1 className="serif fade-in" style={{ fontSize: 36, color: "#FFFDF8", fontWeight: 400, lineHeight: 1.15, marginBottom: 8 }}>
            {period}
          </h1>
          <p style={{ fontSize: 16, color: "#888580", fontFamily: "'Inter', sans-serif" }}>
            {client.businessName}
          </p>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 40px" }}>

          {/* This month */}
          {c.thisMonth && (
            <div className="fade-in" style={{ paddingTop: 48, paddingBottom: 40, borderBottom: "0.5px solid #1E1C18" }}>
              <p style={{ fontSize: 10, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                This month
              </p>
              <p style={{ fontSize: 16, color: "#FFFDF8", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {c.thisMonth}
              </p>

              {/* Completions */}
              {c.completions && c.completions.length > 0 && (
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                  {c.completions.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: gold, marginTop: 2, flexShrink: 0 }}>✓</span>
                      <p style={{ fontSize: 14, color: "#888580", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* The numbers */}
          {c.theNumbers && (
            <div className="fade-in" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: "0.5px solid #1E1C18" }}>
              <p style={{ fontSize: 10, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                The numbers
              </p>
              <p style={{ fontSize: 15, color: "#FFFDF8", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
                {c.theNumbers}
              </p>
            </div>
          )}

          {/* How you're looking */}
          {c.howYoureLooking && (
            <div className="fade-in" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: "0.5px solid #1E1C18" }}>
              <p style={{ fontSize: 10, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                How you&apos;re looking
              </p>
              <p style={{ fontSize: 15, color: "#FFFDF8", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
                {c.howYoureLooking}
              </p>
            </div>
          )}

          {/* Next month */}
          {c.nextMonth && c.nextMonth.length > 0 && (
            <div className="fade-in" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: "0.5px solid #1E1C18" }}>
              <p style={{ fontSize: 10, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>
                Next month
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {c.nextMonth.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span className="serif" style={{ fontSize: 20, color: gold, flexShrink: 0, lineHeight: 1.4 }}>{i + 1}</span>
                    <p style={{ fontSize: 14, color: "#888580", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal note */}
          {c.personalNote && (
            <div className="fade-in" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: "0.5px solid #1E1C18" }}>
              <p style={{ fontSize: 10, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                A note from {agency.ownerName ?? agency.name ?? "your agency"}
              </p>
              <p style={{ fontSize: 15, color: "#FFFDF8", fontFamily: "'Instrument Serif', Georgia, serif", lineHeight: 1.9, fontStyle: "italic" }}>
                &ldquo;{c.personalNote}&rdquo;
              </p>
            </div>
          )}

          {/* Feedback */}
          <div style={{ paddingTop: 48 }}>
            {feedbackSent ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 16, color: "#4CAF50", fontFamily: "'Inter', sans-serif" }}>
                  Thanks for the feedback
                </p>
                <p style={{ fontSize: 13, color: "#555250", fontFamily: "'Inter', sans-serif", marginTop: 6 }}>
                  Your agency will see this.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "#888580", fontFamily: "'Inter', sans-serif", textAlign: "center", marginBottom: 20 }}>
                  How are you feeling about our work together?
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
                  {EMOJI_LABELS.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setFeedbackRating(i + 1)}
                      style={{
                        background: feedbackRating === i + 1 ? "#1a1808" : "transparent",
                        border: `0.5px solid ${feedbackRating === i + 1 ? gold : "#1E1C18"}`,
                        borderRadius: 8, padding: "10px 14px", fontSize: 22, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {feedbackRating && (
                  <>
                    <textarea
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 6, border: "0.5px solid #1E1C18",
                        background: "#0F0E0B", color: "#FFFDF8", fontSize: 13, fontFamily: "'Inter', sans-serif",
                        outline: "none", resize: "vertical", minHeight: 64, display: "block",
                        boxSizing: "border-box", marginBottom: 12,
                      }}
                      placeholder="Anything to add? (optional)"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                    />
                    <button
                      onClick={submitFeedback}
                      disabled={feedbackSending}
                      style={{
                        background: gold, color: "#0A0907", border: "none",
                        borderRadius: 6, padding: "10px 24px", fontSize: 13, fontWeight: 500,
                        fontFamily: "'Inter', sans-serif", cursor: feedbackSending ? "not-allowed" : "pointer",
                        opacity: feedbackSending ? 0.6 : 1, display: "block", margin: "0 auto",
                      }}
                    >
                      {feedbackSending ? "Sending..." : "Send feedback"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ paddingTop: 60, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#2A2826", fontFamily: "'Inter', sans-serif" }}>
              Prepared with Venn
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

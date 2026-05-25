"use client";

import { useState } from "react";

interface Question {
  id: string;
  visitorName: string;
  question: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

interface AnswerClientProps {
  proposalSlug: string;
  questions: Question[];
}

export function AnswerClient({ proposalSlug, questions: initial }: AnswerClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const unanswered = questions.filter((q) => !q.answer);
  const answered = questions.filter((q) => q.answer);

  const handleSave = async (q: Question) => {
    const text = drafts[q.id]?.trim();
    if (!text) return;
    setSaving(q.id);
    try {
      const res = await fetch(`/api/proposals/${proposalSlug}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, answer: text }),
      });
      if (res.ok) {
        const data = await res.json() as { question: Question };
        setQuestions((prev) => prev.map((x) => x.id === q.id ? { ...x, answer: data.question.answer, answeredAt: data.question.answeredAt } : x));
        setSaved((prev) => ({ ...prev, [q.id]: true }));
        setTimeout(() => setSaved((prev) => ({ ...prev, [q.id]: false })), 2000);
        setDrafts((prev) => { const n = { ...prev }; delete n[q.id]; return n; });
      }
    } finally {
      setSaving(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontSize: 15, color: "#555250", fontFamily: "var(--font-inter)" }}>
          No questions yet. They&apos;ll appear here when someone asks via the proposal.
        </p>
      </div>
    );
  }

  return (
    <div>
      {unanswered.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, color: "#C4973F", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
            Needs a reply · {unanswered.length}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {unanswered.map((q) => (
              <div
                key={q.id}
                style={{ background: "#0F0E0B", border: "0.5px solid #2A2826", borderRadius: 8, padding: "18px 20px" }}
              >
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
                  {q.visitorName} · {new Date(q.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
                <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 14 }}>
                  {q.question}
                </p>
                <textarea
                  style={{
                    width: "100%", minHeight: 80, background: "#0A0907",
                    border: `0.5px solid ${drafts[q.id] ? "#C4973F" : "#1E1C18"}`,
                    borderRadius: 6, padding: "10px 12px", color: "#FFFDF8",
                    fontFamily: "var(--font-inter)", fontSize: 13, resize: "vertical",
                    outline: "none", transition: "border-color 0.15s",
                  }}
                  placeholder="Type your answer…"
                  value={drafts[q.id] ?? ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    onClick={() => handleSave(q)}
                    disabled={saving === q.id || !drafts[q.id]?.trim()}
                    style={{
                      padding: "8px 16px", borderRadius: 5, fontSize: 12,
                      fontFamily: "var(--font-inter)", cursor: "pointer",
                      background: saved[q.id] ? "#0d1a0d" : "#C4973F",
                      color: saved[q.id] ? "#4CAF50" : "#0A0907",
                      border: "none", opacity: (!drafts[q.id]?.trim() && !saving) ? 0.4 : 1,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {saved[q.id] ? "✓ Saved" : saving === q.id ? "Saving…" : "Post answer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {answered.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
            Answered · {answered.length}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {answered.map((q) => (
              <div
                key={q.id}
                style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 20px" }}
              >
                <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
                  {q.visitorName}
                </p>
                <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 10 }}>
                  {q.question}
                </p>
                <div style={{ borderLeft: "2px solid #C4973F", paddingLeft: 12 }}>
                  <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.7 }}>
                    {q.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

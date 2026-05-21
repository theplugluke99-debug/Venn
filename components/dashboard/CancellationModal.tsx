"use client";

import { useState } from "react";

type Step = "pause_offer" | "reason" | "confirmed";

const REASONS = [
  "Didn't get results",
  "Too expensive right now",
  "Found something else",
  "Just need a break",
];

interface CancellationModalProps {
  warmLeadCount: number;
  hotLeadName?: string;
  onCancel: () => void; // called when user wants to actually cancel (proceed to Stripe portal)
  onDismiss: () => void;
}

export function CancellationModal({
  warmLeadCount,
  hotLeadName,
  onCancel,
  onDismiss,
}: CancellationModalProps) {
  const [step, setStep] = useState<Step>("pause_offer");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handlePause() {
    setSubmitting(true);
    await fetch("/api/stripe/pause", { method: "POST" }).catch(() => null);
    setSubmitting(false);
    onDismiss();
  }

  async function handleConfirmCancel() {
    setSubmitting(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Cancellation reason: ${reason}. Notes: ${notes}` }),
    }).catch(() => null);
    setSubmitting(false);
    setStep("confirmed");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div
        style={{
          background: "#0F0E0B",
          border: "0.5px solid #1E1C18",
          borderRadius: 12,
          padding: "36px 32px",
          maxWidth: 480,
          width: "100%",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        {step === "pause_offer" && (
          <>
            <h2
              style={{
                fontSize: 22,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              Before you go — pause instead.
            </h2>

            <div
              style={{
                background: "#0D0C09",
                border: "0.5px solid #1E1C18",
                borderRadius: 8,
                padding: "14px 16px",
                marginBottom: 20,
              }}
            >
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                You have <strong style={{ color: "#FFFDF8" }}>{warmLeadCount} warm leads</strong> right now.
                {hotLeadName && (
                  <> <strong style={{ color: "#C4973F" }}>{hotLeadName}</strong> opened your card this week.</>
                )}
              </p>
            </div>

            <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6, marginBottom: 24 }}>
              Pause for one month. £0 for that month. Your pipeline stays exactly as it is. Come back when you're ready.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handlePause}
                disabled={submitting}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#C4973F",
                  color: "#0A0907",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Pausing…" : "Pause for a month"}
              </button>
              <button
                onClick={() => setStep("reason")}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "0.5px solid #2A2826",
                  background: "transparent",
                  color: "#666",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Continue cancelling
              </button>
            </div>
          </>
        )}

        {step === "reason" && (
          <>
            <h2
              style={{
                fontSize: 22,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              What could we have done better?
            </h2>
            <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6, marginBottom: 20 }}>
              No manipulation. Genuine curiosity.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: reason === r ? "0.5px solid #C4973F60" : "0.5px solid #2A2826",
                    background: reason === r ? "#C4973F15" : "transparent",
                    color: reason === r ? "#C4973F" : "#888",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-inter)",
                    transition: "all 0.15s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else you'd like to say..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "0.5px solid #2A2826",
                background: "#0D0C09",
                color: "#FFFDF8",
                fontSize: 13,
                fontFamily: "var(--font-inter)",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                marginBottom: 20,
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleConfirmCancel}
                disabled={!reason || submitting}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1A1814",
                  color: "#888",
                  fontSize: 13,
                  cursor: !reason || submitting ? "not-allowed" : "pointer",
                  opacity: !reason || submitting ? 0.5 : 1,
                }}
              >
                {submitting ? "Processing…" : "Cancel subscription"}
              </button>
              <button
                onClick={() => setStep("pause_offer")}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "0.5px solid #2A2826",
                  background: "transparent",
                  color: "#666",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            </div>
          </>
        )}

        {step === "confirmed" && (
          <>
            <h2
              style={{
                fontSize: 22,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              Subscription cancelled.
            </h2>
            <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.7, marginBottom: 16 }}>
              Your data is preserved for 90 days if you come back.
            </p>
            {reason === "Too expensive right now" && (
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>
                If budget was the issue — reply to our support email and we&apos;ll figure something out.
              </p>
            )}
            {reason === "Didn't get results" && (
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>
                If you&apos;d like a second pair of eyes on your approach before you go — reply to this email. No strings.
              </p>
            )}
            <p style={{ fontSize: 13, color: "#555250", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
              Thank you for building with us. Genuinely.
            </p>
            <p style={{ fontSize: 13, color: "#555250" }}>— Luke</p>
            <button
              onClick={() => { onCancel(); onDismiss(); }}
              style={{
                marginTop: 24,
                padding: "10px 20px",
                borderRadius: 8,
                border: "0.5px solid #2A2826",
                background: "transparent",
                color: "#666",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Go to billing →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

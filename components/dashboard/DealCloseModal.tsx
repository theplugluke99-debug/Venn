"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "form" | "submitting" | "celebration";

export function DealCloseModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [clientName, setClientName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!clientName.trim()) { setError("Enter the client name"); return; }
    if (!dealValue.trim() || isNaN(parseFloat(dealValue))) { setError("Enter the deal value"); return; }

    setStep("submitting");
    const res = await fetch("/api/solopreneur/deal-close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, dealValue: parseFloat(dealValue) }),
    });

    if (res.ok) {
      setStep("celebration");
    } else {
      setStep("form");
      setError("Something went wrong — try again");
    }
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#0F0E0B",
          border: "0.5px solid #C4973F40",
          borderRadius: 12,
          padding: "36px 32px",
          maxWidth: 440,
          width: "100%",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        {step === "celebration" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
            <h2
              style={{
                fontSize: 36,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              You did it.
            </h2>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7, marginBottom: 32 }}>
              This is what Venn is built for.<br />
              Your account is being upgraded to Growth.
            </p>
            <button
              onClick={() => { onClose(); router.refresh(); }}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: "#C4973F",
                color: "#0A0907",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
              }}
            >
              Continue to dashboard
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                Deal Closed
              </p>
              <h2
                style={{
                  fontSize: 22,
                  color: "#FFFDF8",
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontWeight: 400,
                  marginBottom: 8,
                }}
              >
                Tell me about the win.
              </h2>
              <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6 }}>
                Once confirmed, you&apos;ll be upgraded to Growth. No charge — you earned it.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>
                  Client name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => { setClientName(e.target.value); setError(""); }}
                  placeholder="e.g. Smith & Sons Plumbing"
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
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>
                  Deal value (£)
                </label>
                <input
                  type="number"
                  value={dealValue}
                  onChange={(e) => { setDealValue(e.target.value); setError(""); }}
                  placeholder="e.g. 1500"
                  min="0"
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
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#E5534B", marginBottom: 16 }}>{error}</p>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={step === "submitting"}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "#C4973F",
                    color: "#0A0907",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: step === "submitting" ? "not-allowed" : "pointer",
                    opacity: step === "submitting" ? 0.7 : 1,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {step === "submitting" ? "Confirming…" : "Confirm deal"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "0.5px solid #2A2826",
                    background: "transparent",
                    color: "#666",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

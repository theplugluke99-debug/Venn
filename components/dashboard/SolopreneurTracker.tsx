"use client";

import { useState } from "react";
import { DealCloseModal } from "./DealCloseModal";

interface TrackerProps {
  searchCount: number;
  cardCount: number;
  sequenceStepsSent: number;
  hasSequence: boolean;
  dealClosed: boolean;
  dealClientName?: string | null;
  solopreneurExpiry: Date | null;
}

function daysLeft(expiry: Date | null): number | null {
  if (!expiry) return null;
  const ms = new Date(expiry).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function SolopreneurTracker({
  searchCount,
  cardCount,
  sequenceStepsSent,
  hasSequence,
  dealClosed,
  dealClientName,
  solopreneurExpiry,
}: TrackerProps) {
  const [showDealModal, setShowDealModal] = useState(false);

  const days = daysLeft(solopreneurExpiry);

  const steps = [
    {
      id: "searches",
      label: "Run 3 searches",
      detail: `${Math.min(searchCount, 3)} / 3`,
      done: searchCount >= 3,
    },
    {
      id: "cards",
      label: "Generate 5 cards",
      detail: `${Math.min(cardCount, 5)} / 5`,
      done: cardCount >= 5,
    },
    {
      id: "sequences",
      label: "Start a sequence (2+ steps sent)",
      detail: hasSequence && sequenceStepsSent >= 2 ? "Done" : `${sequenceStepsSent} step${sequenceStepsSent !== 1 ? "s" : ""} sent`,
      done: hasSequence && sequenceStepsSent >= 2,
    },
    {
      id: "deal",
      label: "Close a deal",
      detail: dealClosed ? dealClientName ?? "Done" : "Not yet",
      done: dealClosed,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const pct = Math.round((completedCount / steps.length) * 100);
  const isExpired = days !== null && days === 0 && !dealClosed;
  const isUrgent = days !== null && days <= 7 && !dealClosed;
  const isWarning = days !== null && days <= 14 && days > 7 && !dealClosed;

  if (dealClosed) {
    return (
      <div
        style={{
          background: "#0F0E0B",
          border: "0.5px solid #C4973F40",
          borderRadius: 10,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>🎉</span>
          <h3
            style={{
              fontSize: 18,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontWeight: 400,
            }}
          >
            Deal closed{dealClientName ? ` — ${dealClientName}` : ""}
          </h3>
        </div>
        <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6 }}>
          You did it. Your account is being upgraded to Growth. Welcome to the other side.
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div
        style={{
          background: "#0F0E0B",
          border: "0.5px solid #2A2826",
          borderRadius: 10,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 11, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Solopreneur Trial
        </p>
        <h3
          style={{
            fontSize: 18,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          Your trial has ended.
        </h3>
        <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6, marginBottom: 20 }}>
          Time ran out — but the pipeline you built is still here. Pick up where you left off with a Starter plan at £149/month.
        </p>
        <a
          href="/subscribe"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: 8,
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View plans →
        </a>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: "#0F0E0B",
          border: isUrgent
            ? "0.5px solid #E5534B40"
            : isWarning
            ? "0.5px solid #C4973F40"
            : "0.5px solid #1E1C18",
          borderRadius: 10,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Solopreneur Programme
            </p>
            <h3
              style={{
                fontSize: 18,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontWeight: 400,
              }}
            >
              Your 30-day challenge
            </h3>
          </div>
          {days !== null && (
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: 24,
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  color: isUrgent ? "#E5534B" : isWarning ? "#C4973F" : "#FFFDF8",
                  fontWeight: 400,
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {days}
              </span>
              <span style={{ fontSize: 10, color: "#555250" }}>days left</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              height: 3,
              background: "#1E1C18",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "#C4973F",
                borderRadius: 2,
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#555250" }}>{completedCount} of {steps.length} steps complete</p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: step.done ? "#131209" : "#0D0C09",
                borderRadius: 8,
                border: step.done ? "0.5px solid #C4973F30" : "0.5px solid #1A1814",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: step.done ? "#C4973F" : "#1E1C18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {step.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="#0A0907" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: step.done ? "#FFFDF8" : "#888" }}>
                  {step.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: step.done ? "#C4973F" : "#444",
                  fontWeight: step.done ? 600 : 400,
                }}
              >
                {step.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Urgency copy */}
        {isUrgent && (
          <p style={{ fontSize: 13, color: "#E5534B", marginBottom: 16, lineHeight: 1.6 }}>
            {days === 1
              ? "Last day. Your pipeline is warmer than you think — close it today."
              : `${days} days left. This is the moment.`}
          </p>
        )}
        {isWarning && !isUrgent && (
          <p style={{ fontSize: 13, color: "#C4973F", marginBottom: 16, lineHeight: 1.6 }}>
            {days} days left. Your pipeline is warmer than you think.
          </p>
        )}

        {/* Deal close CTA */}
        <button
          onClick={() => setShowDealModal(true)}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "0.5px solid #C4973F60",
            background: "#C4973F15",
            color: "#C4973F",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
          }}
        >
          I closed a deal →
        </button>
      </div>

      {showDealModal && (
        <DealCloseModal onClose={() => setShowDealModal(false)} />
      )}
    </>
  );
}

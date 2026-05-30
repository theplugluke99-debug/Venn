"use client";

import Link from "next/link";
import { useMode } from "@/components/layout/DashboardProvider";
import type { AgencyIntelligence } from "@/lib/agency/intelligence";

interface AgencyFocusModeProps {
  intelligence: AgencyIntelligence;
}

const URGENCY_COLOURS: Record<string, { border: string; label: string; labelBg: string }> = {
  urgent: { border: "#C0392B", label: "#C0392B", labelBg: "#1a0808" },
  attention: { border: "#C4973F", label: "#C4973F", labelBg: "#1a1808" },
  today: { border: "#1E1C18", label: "#888580", labelBg: "#1A1814" },
  normal: { border: "#1E1C18", label: "#555250", labelBg: "#1A1814" },
};

function CalmState({ intelligence }: { intelligence: AgencyIntelligence }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 32px",
        maxWidth: 560,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Venn mark */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid #C4973F30",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          animation: "breathe 4s ease-in-out infinite",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="12" r="6" stroke="#C4973F" strokeWidth="1" opacity="0.6" />
          <circle cx="15" cy="12" r="6" stroke="#C4973F" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>

      <p
        style={{
          fontSize: 22,
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          color: "#FFFDF8",
          fontWeight: 400,
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        Everything is on track today.
      </p>

      {intelligence.nextDeliverable ? (
        <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
          Your next deliverable is due{" "}
          {new Date(intelligence.nextDeliverable.dueDate).toLocaleDateString("en-GB", {
            weekday: "long",
          })}{" "}
          for {intelligence.nextDeliverable.clientName}.
        </p>
      ) : (
        <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
          {intelligence.activeClientCount} active client{intelligence.activeClientCount === 1 ? "" : "s"}, all healthy.
        </p>
      )}

      <p
        style={{
          fontSize: 13,
          color: "#333230",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          marginTop: 16,
          fontStyle: "italic",
        }}
      >
        Take a breath.
      </p>
    </div>
  );
}

export function AgencyFocusMode({ intelligence }: AgencyFocusModeProps) {
  const { setMode } = useMode();

  if (!intelligence.topPriority) {
    return <CalmState intelligence={intelligence} />;
  }

  const p = intelligence.topPriority;
  const colours = URGENCY_COLOURS[p.urgency] ?? URGENCY_COLOURS.normal;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          background: "#0F0E0B",
          border: `1px solid ${colours.border}`,
          borderRadius: 8,
          padding: 32,
          maxWidth: 560,
          width: "100%",
        }}
      >
        {/* Priority label */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: colours.label,
              background: colours.labelBg,
              border: `0.5px solid ${colours.border}30`,
              padding: "3px 8px",
              borderRadius: 3,
              fontFamily: "var(--font-inter)",
            }}
          >
            {p.urgencyLabel}
          </span>
        </div>

        {/* Headline */}
        <p
          style={{
            fontSize: 24,
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            color: "#FFFDF8",
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {p.headline}
        </p>

        {/* Context */}
        <p
          style={{
            fontSize: 15,
            color: "#888580",
            fontFamily: "var(--font-inter)",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {p.context}
        </p>

        {/* Primary action */}
        <Link
          href={p.actionHref}
          style={{
            display: "block",
            textAlign: "center",
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-inter)",
            padding: "12px 24px",
            borderRadius: 6,
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          {p.actionLabel}
        </Link>

        {/* Secondary link */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setMode("today")}
            style={{
              fontSize: 13,
              color: "#555250",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              padding: 0,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            See everything →
          </button>
        </div>
      </div>
    </div>
  );
}

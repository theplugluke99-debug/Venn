"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateProposalButtonProps {
  leadId: string;
}

export function GenerateProposalButton({ leadId }: GenerateProposalButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      if (res.ok) {
        const data = await res.json() as { proposal: { id: string } };
        router.push(`/proposals/${data.proposal.id}/analytics`);
      } else {
        const err = await res.json() as { error?: string };
        alert(err.error ?? "Failed to generate proposal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      style={{
        width: "100%",
        padding: "11px",
        borderRadius: 8,
        border: "0.5px solid #1E1C18",
        background: "transparent",
        color: loading ? "#444440" : "#888580",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-inter)",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = "#C4973F40";
          e.currentTarget.style.color = "#C4973F";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1E1C18";
        e.currentTarget.style.color = "#888580";
      }}
    >
      {loading ? (
        <>
          <span style={{ opacity: 0.5 }}>Generating proposal…</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Generate proposal
        </>
      )}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  leadId: string;
  closeSessionId: string;
  businessName: string;
}

export function GenerateProposalFromClose({ leadId, closeSessionId, businessName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, closeSessionId }),
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
        width: "100%", padding: "14px", borderRadius: 8,
        background: loading ? "#1A1814" : "#C4973F",
        color: loading ? "#888580" : "#0A0907",
        fontSize: 14, fontWeight: 600, fontFamily: "var(--font-inter)",
        cursor: loading ? "not-allowed" : "pointer", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "background 0.2s",
      }}
    >
      {loading ? (
        <>
          <div style={{ width: 14, height: 14, border: "1.5px solid #44444040", borderTop: "1.5px solid #888580", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Generating proposal from {businessName}&apos;s answers…
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          Generate proposal from discovery answers →
        </>
      )}
    </button>
  );
}

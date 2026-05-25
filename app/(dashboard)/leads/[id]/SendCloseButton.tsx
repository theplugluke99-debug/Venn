"use client";

import { useState } from "react";
import { SendCloseModal } from "./SendCloseModal";

interface SendCloseButtonProps {
  leadId: string;
  businessName: string;
  phone?: string | null;
}

export function SendCloseButton({ leadId, businessName, phone }: SendCloseButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%", padding: "11px", borderRadius: 8,
          border: "0.5px solid #C4973F40", background: "transparent",
          color: "#C4973F", fontSize: 13, fontWeight: 500,
          fontFamily: "var(--font-inter)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#C4973F08";
          e.currentTarget.style.borderColor = "#C4973F70";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "#C4973F40";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 11V7a4 4 0 018 0v4M5 11h14l1 9H4l1-9z" />
        </svg>
        Send Venn Close →
      </button>

      {open && (
        <SendCloseModal
          leadId={leadId}
          businessName={businessName}
          phone={phone}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

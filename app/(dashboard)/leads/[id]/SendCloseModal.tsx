"use client";

import { useState } from "react";

interface SendCloseModalProps {
  leadId: string;
  businessName: string;
  phone?: string | null;
  onClose: () => void;
}

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "email", label: "Email" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

const RESPONSE_TIMES = ["24 hours", "48 hours", "72 hours"] as const;

interface CloseResult {
  closeUrl: string;
  sentMessage: string;
  responseTime: string;
}

export function SendCloseModal({ leadId, businessName, phone, onClose }: SendCloseModalProps) {
  const [channel, setChannel] = useState<string>("whatsapp");
  const [responseTime, setResponseTime] = useState<string>("24 hours");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CloseResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, sentChannel: channel, responseTime }),
      });
      if (res.ok) {
        const data = await res.json() as CloseResult;
        setResult(data);
      } else {
        const err = await res.json() as { error?: string };
        alert(err.error ?? "Failed to create session");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const waUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent((result?.sentMessage ?? "") + "\n\n" + (result?.closeUrl ?? ""))}`
    : null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,9,7,0.85)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 12,
        padding: 32, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto",
      }}>
        {!result ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontSize: 22, color: "#FFFDF8", fontWeight: 400, marginBottom: 8,
              }}>
                Send Venn Close to {businessName}
              </h2>
              <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
                They&apos;ll answer a few discovery questions at their own pace. When done — generate their proposal instantly.
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
                Venn will ask about
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Their biggest current challenge", "Growth goals for the next 12 months", "Previous agency experience"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C4973F", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
                I&apos;ll have their proposal ready within
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {RESPONSE_TIMES.map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setResponseTime(rt)}
                    style={{
                      padding: "7px 14px", borderRadius: 5, fontSize: 12,
                      fontFamily: "var(--font-inter)", cursor: "pointer",
                      background: responseTime === rt ? "#C4973F15" : "transparent",
                      border: `0.5px solid ${responseTime === rt ? "#C4973F" : "#1E1C18"}`,
                      color: responseTime === rt ? "#C4973F" : "#555250",
                      transition: "all 0.15s",
                    }}
                  >
                    {rt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
                Where are you sending this?
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id)}
                    style={{
                      padding: "7px 14px", borderRadius: 5, fontSize: 12,
                      fontFamily: "var(--font-inter)", cursor: "pointer",
                      background: channel === ch.id ? "#C4973F15" : "transparent",
                      border: `0.5px solid ${channel === ch.id ? "#C4973F" : "#1E1C18"}`,
                      color: channel === ch.id ? "#C4973F" : "#555250",
                      transition: "all 0.15s",
                    }}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleCreate}
                disabled={loading}
                style={{
                  flex: 1, padding: "12px", borderRadius: 6, background: "#C4973F",
                  color: "#0A0907", fontSize: 14, fontWeight: 600,
                  fontFamily: "var(--font-inter)", cursor: loading ? "not-allowed" : "pointer",
                  border: "none", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Generating questions…" : "Create Close session →"}
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "12px 16px", borderRadius: 6, background: "transparent",
                  border: "0.5px solid #1E1C18", color: "#555250",
                  fontFamily: "var(--font-inter)", fontSize: 13, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
                <span style={{ fontSize: 12, color: "#4CAF50", fontFamily: "var(--font-inter)" }}>Session created</span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontSize: 22, color: "#FFFDF8", fontWeight: 400, marginBottom: 8,
              }}>
                Ready to send
              </h2>
              <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
                Copy the pre-written message and the link below — or use the WhatsApp shortcut.
              </p>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
                Message
              </p>
              <div style={{
                background: "#0A0907", border: "0.5px solid #1E1C18", borderRadius: 6,
                padding: "14px 16px",
              }}>
                <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 8 }}>
                  {result.sentMessage}
                </p>
                <p style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", wordBreak: "break-all" }}>
                  {result.closeUrl}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => handleCopy(`${result.sentMessage}\n\n${result.closeUrl}`)}
                style={{
                  padding: "12px", borderRadius: 6, background: copied ? "#0d1a0d" : "#C4973F",
                  color: copied ? "#4CAF50" : "#0A0907", fontSize: 14, fontWeight: 600,
                  fontFamily: "var(--font-inter)", cursor: "pointer", border: "none",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied" : "Copy message + link"}
              </button>

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px", borderRadius: 6, background: "transparent",
                    border: "0.5px solid #C4973F40", color: "#C4973F",
                    fontSize: 14, fontFamily: "var(--font-inter)", textAlign: "center",
                    textDecoration: "none", cursor: "pointer",
                  }}
                >
                  Open in WhatsApp →
                </a>
              )}

              <button
                onClick={() => handleCopy(result.closeUrl)}
                style={{
                  padding: "10px", borderRadius: 6, background: "transparent",
                  border: "0.5px solid #1E1C18", color: "#555250",
                  fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                }}
              >
                Copy link only
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: "10px", borderRadius: 6, background: "transparent",
                  border: "none", color: "#444440",
                  fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

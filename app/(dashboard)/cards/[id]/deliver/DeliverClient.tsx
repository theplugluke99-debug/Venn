"use client";

import { useState } from "react";
import Link from "next/link";

interface DeliveryMessages {
  whatsapp?: string;
  instagramStep1?: string;
  instagramStep2?: string;
  emailSubject?: string;
  emailBody?: string;
  linkedinNote?: string;
  linkedinDm?: string;
}

interface DeliverClientProps {
  cardId: string;
  cardSlug: string;
  cardUrl: string;
  businessName: string;
  niche: string;
  location: string;
  intentScore: string;
  phone: string | null;
  instagramHandle: string | null;
  deliveryMessages: DeliveryMessages | null;
  personalNote: string | null;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        border: "0.5px solid #1E1C18",
        background: "transparent",
        color: copied ? "#4CAF50" : "#888580",
        fontSize: 12,
        cursor: "pointer",
        fontFamily: "var(--font-inter)",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function EditableMessage({
  value,
  onChange,
  rows = 4,
  mono = false,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  maxLength?: number;
}) {
  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 6,
          border: "0.5px solid #1E1C18",
          background: "#0A0907",
          color: "#FFFDF8",
          fontSize: 13,
          fontFamily: mono ? "monospace" : "var(--font-inter)",
          lineHeight: 1.65,
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
        onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
      />
      {maxLength && (
        <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "#444440" }}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ color: "#C4973F" }}>{icon}</div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#FFFDF8", margin: 0, fontFamily: "var(--font-inter)" }}>
        {title}
      </h3>
    </div>
  );
}

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://venn.so";

export function DeliverClient({
  cardSlug,
  cardUrl,
  businessName,
  niche,
  location,
  intentScore,
  phone,
  instagramHandle,
  deliveryMessages: initialMessages,
  personalNote: initialNote,
}: DeliverClientProps) {
  const [msgs, setMsgs] = useState<DeliveryMessages>({
    whatsapp: initialMessages?.whatsapp ?? `Put something together specifically for you — ${cardUrl}`,
    instagramStep1: initialMessages?.instagramStep1 ?? `Noticed something about ${businessName} worth sharing.`,
    instagramStep2: initialMessages?.instagramStep2 ?? `Here's what I found: ${cardUrl}`,
    emailSubject: initialMessages?.emailSubject ?? `Something specific to ${businessName}`,
    emailBody: initialMessages?.emailBody ?? `I spent 14 minutes looking at ${businessName}. Here's what I found: ${cardUrl}`,
    linkedinNote: initialMessages?.linkedinNote ?? `I noticed something specific about ${businessName} — put together a short analysis.`,
    linkedinDm: initialMessages?.linkedinDm ?? `Following up on my connection request — I put together a short analysis for ${businessName}: ${cardUrl}`,
  });
  const [note, setNote] = useState(initialNote ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  function update(key: keyof DeliveryMessages, val: string) {
    setMsgs((prev) => ({ ...prev, [key]: val }));
  }

  async function saveNote() {
    await fetch(`/api/cards/${cardSlug}/note`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalNote: note }),
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  const waLink = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msgs.whatsapp ?? "")}`
    : null;

  const igLink = instagramHandle
    ? `https://instagram.com/${instagramHandle.replace("@", "")}`
    : null;

  const mailtoLink = `mailto:?subject=${encodeURIComponent(msgs.emailSubject ?? "")}&body=${encodeURIComponent(msgs.emailBody ?? "")}`;

  const liSearchLink = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(businessName + " " + location)}`;

  const cardPreviewUrl = cardUrl;

  const sectionBox = {
    background: "#0F0E0B",
    border: "0.5px solid #1E1C18",
    borderRadius: 8,
    padding: "24px",
    marginBottom: 16,
  } as const;

  return (
    <div style={{ maxWidth: 720 }}>

      {/* Card preview strip */}
      <div style={{ ...sectionBox, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
              {businessName}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
              background: intentScore === "high" ? "#0d2b0d" : "#1a1600",
              color: intentScore === "high" ? "#4CAF50" : "#C4973F",
              letterSpacing: "0.08em",
            }}>
              {intentScore.toUpperCase()} INTENT
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", margin: 0 }}>
            {niche} · {location}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          <Link
            href={cardPreviewUrl}
            target="_blank"
            style={{
              fontSize: 13, color: "#C4973F", textDecoration: "none", padding: "7px 14px",
              border: "0.5px solid #C4973F30", borderRadius: 6, fontFamily: "var(--font-inter)",
            }}
          >
            View card →
          </Link>
          <CopyButton text={cardUrl} label="Copy URL" />
        </div>
      </div>

      {/* Personal note */}
      <div style={sectionBox}>
        <p style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 12 }}>
          Add a personal note (optional)
        </p>
        <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
          One line only you would write. Appended to messages if set.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={100}
            placeholder="e.g. I noticed your salon on the high street last week..."
            style={{
              flex: 1, padding: "10px 12px", borderRadius: 6, border: "0.5px solid #1E1C18",
              background: "#0A0907", color: "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
            onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
          />
          <button
            onClick={saveNote}
            style={{
              padding: "8px 16px", borderRadius: 6, border: "none", background: "#1A1814",
              color: noteSaved ? "#4CAF50" : "#888580", fontSize: 12, cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            {noteSaved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>

      {/* WhatsApp */}
      <div style={sectionBox}>
        <SectionHeader
          title="WhatsApp"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>}
        />
        {phone ? (
          <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
            Number found: <span style={{ color: "#888580" }}>{phone}</span>
          </p>
        ) : (
          <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
            No phone number found. Search manually.
          </p>
        )}
        <EditableMessage value={msgs.whatsapp ?? ""} onChange={(v) => update("whatsapp", v)} rows={3} />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <CopyButton text={msgs.whatsapp ?? ""} label="Copy message" />
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C4973F", textDecoration: "none", padding: "6px 14px", border: "0.5px solid #C4973F30", borderRadius: 6, fontFamily: "var(--font-inter)" }}>
              Open WhatsApp →
            </a>
          )}
        </div>
      </div>

      {/* Instagram */}
      <div style={sectionBox}>
        <SectionHeader
          title="Instagram"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>}
        />
        <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 16, lineHeight: 1.5 }}>
          Send step 1 first. Wait for a reply. Then send step 2 with the link.
        </p>
        <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Step 1 — No link</p>
        <EditableMessage value={msgs.instagramStep1 ?? ""} onChange={(v) => update("instagramStep1", v)} rows={3} />
        <div style={{ display: "flex", gap: 10, marginTop: 10, marginBottom: 20 }}>
          <CopyButton text={msgs.instagramStep1 ?? ""} label="Copy step 1" />
        </div>
        <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Step 2 — With link</p>
        <EditableMessage value={msgs.instagramStep2 ?? ""} onChange={(v) => update("instagramStep2", v)} rows={2} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <CopyButton text={msgs.instagramStep2 ?? ""} label="Copy step 2" />
          {igLink && (
            <a href={igLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C4973F", textDecoration: "none", padding: "6px 14px", border: "0.5px solid #C4973F30", borderRadius: 6, fontFamily: "var(--font-inter)" }}>
              Open Instagram →
            </a>
          )}
        </div>
      </div>

      {/* Email */}
      <div style={sectionBox}>
        <SectionHeader
          title="Email"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
        />
        <p style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Subject</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            value={msgs.emailSubject ?? ""}
            onChange={(e) => update("emailSubject", e.target.value)}
            style={{
              flex: 1, padding: "10px 12px", borderRadius: 6, border: "0.5px solid #1E1C18",
              background: "#0A0907", color: "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)", outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
            onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
          />
          <CopyButton text={msgs.emailSubject ?? ""} label="Copy" />
        </div>
        <p style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Body</p>
        <EditableMessage value={msgs.emailBody ?? ""} onChange={(v) => update("emailBody", v)} rows={6} />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <CopyButton text={msgs.emailBody ?? ""} label="Copy body" />
          <a href={mailtoLink} style={{ fontSize: 12, color: "#C4973F", textDecoration: "none", padding: "6px 14px", border: "0.5px solid #C4973F30", borderRadius: 6, fontFamily: "var(--font-inter)" }}>
            Open in mail →
          </a>
        </div>
      </div>

      {/* LinkedIn */}
      <div style={sectionBox}>
        <SectionHeader
          title="LinkedIn"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>}
        />
        <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Connection note</p>
        <EditableMessage value={msgs.linkedinNote ?? ""} onChange={(v) => update("linkedinNote", v)} rows={3} maxLength={280} />
        <div style={{ display: "flex", gap: 10, marginTop: 10, marginBottom: 20 }}>
          <CopyButton text={msgs.linkedinNote ?? ""} label="Copy note" />
        </div>
        <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>DM (after connecting)</p>
        <EditableMessage value={msgs.linkedinDm ?? ""} onChange={(v) => update("linkedinDm", v)} rows={4} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <CopyButton text={msgs.linkedinDm ?? ""} label="Copy DM" />
          <a href={liSearchLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C4973F", textDecoration: "none", padding: "6px 14px", border: "0.5px solid #C4973F30", borderRadius: 6, fontFamily: "var(--font-inter)" }}>
            Search on LinkedIn →
          </a>
        </div>
      </div>

      {/* Card style selector */}
      <div style={sectionBox}>
        <p style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
          Card style
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { id: "editorial", label: "Editorial", active: true },
            { id: "minimal", label: "Minimal", soon: true },
            { id: "letter", label: "Letter", soon: true },
            { id: "narrative", label: "Narrative", soon: true },
          ].map((style) => (
            <div
              key={style.id}
              style={{
                position: "relative",
                padding: "8px 16px",
                borderRadius: 6,
                border: style.active ? "0.5px solid #C4973F" : "0.5px solid #1E1C18",
                background: style.active ? "rgba(196,151,63,0.06)" : "transparent",
                color: style.active ? "#C4973F" : "#2A2826",
                fontSize: 13,
                fontFamily: "var(--font-inter)",
                cursor: style.active ? "default" : "not-allowed",
                opacity: style.soon ? 0.5 : 1,
              }}
            >
              {style.label}
              {style.soon && (
                <span style={{ fontSize: 9, color: "#444440", marginLeft: 6, fontFamily: "var(--font-inter)" }}>
                  Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

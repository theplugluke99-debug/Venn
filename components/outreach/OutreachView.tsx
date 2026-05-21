"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SequenceStep {
  id: string;
  stepNumber: number;
  channel: string;
  message: string;
  subject?: string | null;
  status: string;
  scheduledAt: string;
  sentAt?: string | null;
}

interface Sequence {
  id: string;
  status: string;
  currentStep: number;
  steps: SequenceStep[];
}

interface Lead {
  id: string;
  businessName: string;
  location: string;
  niche: string;
  intentScore: string;
  recommendedChannel: string;
  openingLine: string | null;
  phone: string | null;
  email: string | null;
  instagramHandle: string | null;
  card: { slug: string; viewCount: number; lastViewed: string | null } | null;
  sequence: Sequence | null;
}

interface DueTodayStep {
  id: string;
  stepNumber: number;
  channel: string;
  message: string;
  subject?: string | null;
  status: string;
  scheduledAt: string;
  lead: { id: string; businessName: string; intentScore: string; location: string };
}

interface Stats {
  total: number;
  high: number;
  cardsSent: number;
  hotLeads: number;
}

interface OutreachViewProps {
  leads: Lead[];
  stats: Stats;
  dueToday: DueTodayStep[];
}

const CHANNELS = ["whatsapp", "instagram", "email", "linkedin"] as const;
type Channel = (typeof CHANNELS)[number];

const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  email: "Email",
  linkedin: "LinkedIn",
};

const CHANNEL_ICONS: Record<Channel, React.ReactNode> = {
  whatsapp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.118 1.526 5.847L0 24l6.293-1.501A11.933 11.933 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.924 0-3.724-.502-5.285-1.379l-.379-.217-3.934.938.977-3.838-.239-.395A9.954 9.954 0 0 1 2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

function isHot(lastViewed: string | null): boolean {
  if (!lastViewed) return false;
  return Date.now() - new Date(lastViewed).getTime() < 86_400_000;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function IntentBar({ score }: { score: string }) {
  const colors: Record<string, string> = { high: "#4CAF50", medium: "#C4973F", low: "#5b7db1" };
  return <div style={{ width: 2, background: colors[score] ?? "#444", alignSelf: "stretch", borderRadius: 2 }} />;
}

function CopyButton({ text, label = "Copy message" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        fontSize: 11,
        fontFamily: "var(--font-inter)",
        background: "#1A1814",
        border: "0.5px solid #1E1C18",
        color: copied ? "#4CAF50" : "#888",
        padding: "4px 10px",
        borderRadius: 5,
        cursor: "pointer",
        transition: "color 0.2s",
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function GenerateCardButton({ leadId, card }: { leadId: string; card: Lead["card"] }) {
  const [loading, setLoading] = useState(false);
  const [cardSlug, setCardSlug] = useState<string | null>(card?.slug ?? null);

  if (cardSlug) {
    return (
      <Link
        href={`/card/${cardSlug}`}
        target="_blank"
        style={{
          fontSize: 11,
          fontFamily: "var(--font-inter)",
          background: "#C4973F15",
          border: "0.5px solid #C4973F30",
          color: "#C4973F",
          padding: "4px 10px",
          borderRadius: 5,
          textDecoration: "none",
        }}
      >
        View card
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadId }),
          });
          if (res.ok) {
            const { card } = await res.json();
            setCardSlug(card.slug);
          }
        } catch {}
        setLoading(false);
      }}
      disabled={loading}
      style={{
        fontSize: 11,
        fontFamily: "var(--font-inter)",
        background: loading ? "#8B6A2B" : "#C4973F",
        color: "#0A0907",
        padding: "4px 10px",
        borderRadius: 5,
        cursor: loading ? "not-allowed" : "pointer",
        border: "none",
      }}
    >
      {loading ? "Generating…" : "Send card"}
    </button>
  );
}

function DueTodaySection({ steps }: { steps: DueTodayStep[] }) {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  if (steps.length === 0) return null;

  async function markSent(stepId: string) {
    try {
      await fetch(`/api/sequence-steps/${stepId}/sent`, { method: "POST" });
      setSentIds((s) => new Set([...s, stepId]));
    } catch {}
  }

  const pending = steps.filter((s) => !sentIds.has(s.id));

  if (pending.length === 0) return null;

  return (
    <div
      className="mb-8"
      style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, overflow: "hidden" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "0.5px solid #1E1C18" }}>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              background: "#C4973F",
              color: "#0A0907",
              padding: "2px 8px",
              borderRadius: 10,
              fontFamily: "var(--font-inter)",
            }}
          >
            {pending.length} due today
          </span>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
            Actions ready to take
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#1E1C18]">
        {pending.map((step) => (
          <div key={step.id} className="flex items-center gap-4 px-4 py-3">
            <IntentBar score={step.lead.intentScore} />
            <div className="flex items-center gap-2 shrink-0">
              <span style={{ color: "#555250", fontSize: 12 }}>
                {CHANNEL_ICONS[step.channel as Channel]}
              </span>
              <span style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)" }}>
                Step {step.stepNumber}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 2 }}>
                {step.lead.businessName}
              </p>
              <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.4 }}>
                {step.message.length > 80 ? step.message.slice(0, 80) + "…" : step.message}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CopyButton text={step.message} />
              <button
                onClick={() => markSent(step.id)}
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                  background: "#4CAF5015",
                  border: "0.5px solid #4CAF5030",
                  color: "#4CAF50",
                  padding: "4px 10px",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Mark sent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const hot = isHot(lead.card?.lastViewed ?? null);

  const channelAction = (): React.ReactNode => {
    if (lead.recommendedChannel === "whatsapp" && lead.phone) {
      const cleaned = lead.phone.replace(/\D/g, "");
      const msg = encodeURIComponent(lead.openingLine ?? "Hi, I'd love to connect.");
      return (
        <a
          href={`https://wa.me/${cleaned}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, fontFamily: "var(--font-inter)", background: "#25D366",
            color: "#fff", padding: "4px 10px", borderRadius: 5, textDecoration: "none",
          }}
        >
          Open WhatsApp
        </a>
      );
    }
    if (lead.recommendedChannel === "instagram" && lead.instagramHandle) {
      return (
        <a
          href={`https://instagram.com/${lead.instagramHandle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, fontFamily: "var(--font-inter)", background: "#833AB415",
            color: "#C13584", border: "0.5px solid #833AB430", padding: "4px 10px",
            borderRadius: 5, textDecoration: "none",
          }}
        >
          Open Instagram
        </a>
      );
    }
    if (lead.recommendedChannel === "linkedin") {
      return (
        <a
          href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(lead.businessName)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, fontFamily: "var(--font-inter)", background: "#0077B515",
            color: "#0077B5", border: "0.5px solid #0077B530", padding: "4px 10px",
            borderRadius: 5, textDecoration: "none",
          }}
        >
          Search LinkedIn
        </a>
      );
    }
    return null;
  };

  return (
    <div
      className="flex items-stretch gap-3 px-4 py-3"
      style={{ borderBottom: "0.5px solid #1E1C18" }}
    >
      <IntentBar score={lead.intentScore} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/leads/${lead.id}`}
            style={{ fontSize: 14, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)", textDecoration: "none" }}
            className="hover:text-[#C4973F] transition-colors"
          >
            {lead.businessName}
          </Link>
          {hot && (
            <span
              style={{
                fontSize: 9, fontWeight: 700, background: "#C4973F", color: "#0A0907",
                padding: "1px 6px", borderRadius: 10, fontFamily: "var(--font-inter)",
                letterSpacing: "0.05em",
              }}
            >
              HOT
            </span>
          )}
          {lead.card?.viewCount ? (
            <span style={{ fontSize: 10, color: hot ? "#C4973F" : "#444", fontFamily: "var(--font-inter)" }}>
              {lead.card.viewCount} view{lead.card.viewCount !== 1 ? "s" : ""}
              {lead.card.lastViewed ? ` · ${timeAgo(lead.card.lastViewed)}` : ""}
            </span>
          ) : null}
        </div>

        <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
          {lead.location}
          {lead.phone && ` · ${lead.phone}`}
          {lead.email && ` · ${lead.email}`}
          {lead.instagramHandle && ` · @${lead.instagramHandle}`}
        </p>

        {lead.openingLine && (
          <p
            style={{
              fontSize: 12, color: "#777", fontStyle: "italic",
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{lead.openingLine}&rdquo;
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {lead.openingLine && <CopyButton text={lead.openingLine} />}
        {channelAction()}
        <GenerateCardButton leadId={lead.id} card={lead.card} />
      </div>
    </div>
  );
}

export function OutreachView({ leads, stats, dueToday }: OutreachViewProps) {
  const [activeChannel, setActiveChannel] = useState<Channel>("whatsapp");

  const byChannel = (ch: Channel) =>
    leads.filter((l) => l.recommendedChannel === ch);

  return (
    <div>
      {/* Summary bar */}
      <div
        className="flex items-center gap-6 mb-8 px-4 py-3 rounded"
        style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18" }}
      >
        {[
          { label: "Ready to contact", value: stats.total, color: "#FFFDF8" },
          { label: "High intent", value: stats.high, color: "#4CAF50" },
          { label: "Cards sent", value: stats.cardsSent, color: "#888" },
          { label: "Card viewed today", value: stats.hotLeads, color: "#C4973F" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p
              style={{ fontSize: 20, color, fontFamily: "var(--font-instrument-serif)", lineHeight: 1 }}
            >
              {value}
            </p>
            <p style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Due today */}
      <DueTodaySection steps={dueToday} />

      {/* Channel tabs */}
      <div
        className="flex items-center gap-1 mb-4"
        style={{ borderBottom: "0.5px solid #1E1C18" }}
      >
        {CHANNELS.map((ch) => {
          const count = byChannel(ch).length;
          const active = activeChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className="flex items-center gap-1.5 px-4 py-2.5 transition-colors"
              style={{
                fontSize: 13,
                fontFamily: "var(--font-inter)",
                color: active ? "#C4973F" : "#555250",
                background: "none",
                border: "none",
                borderBottom: active ? "2px solid #C4973F" : "2px solid transparent",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              <span style={{ color: active ? "#C4973F" : "#555250" }}>
                {CHANNEL_ICONS[ch]}
              </span>
              {CHANNEL_LABELS[ch]}
              {count > 0 && (
                <span
                  style={{
                    fontSize: 10, background: active ? "#C4973F15" : "#1A1814",
                    color: active ? "#C4973F" : "#444",
                    border: `0.5px solid ${active ? "#C4973F30" : "#1E1C18"}`,
                    padding: "1px 6px", borderRadius: 10,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lead list for active channel */}
      <div
        style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, overflow: "hidden" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChannel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {byChannel(activeChannel).length === 0 ? (
              <div
                className="text-center py-16"
                style={{ fontSize: 13, color: "#333230", fontFamily: "var(--font-inter)" }}
              >
                No leads recommended for {CHANNEL_LABELS[activeChannel]} yet.
                <br />
                <span style={{ fontSize: 11, color: "#222" }}>Complete a search and Venn will assign channels automatically.</span>
              </div>
            ) : (
              byChannel(activeChannel).map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

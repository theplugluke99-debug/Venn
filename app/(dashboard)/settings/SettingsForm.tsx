"use client";

import { useState } from "react";
import { hasFeatureAccess } from "@/lib/auth/features";
import type { Feature } from "@/lib/auth/features";
import { CancellationModal } from "@/components/dashboard/CancellationModal";

interface CardIdentity {
  brandColour: string;
  accentColour: string;
  logoUrl: string | null;
  agencyName: string | null;
  agencyTagline: string | null;
  agencyOwnerName: string | null;
  agencyOwnerPhoto: string | null;
  writingStyle: string | null;
  defaultAngle: string;
  ctaType: string;
  ctaValue: string | null;
  cardStyle: string;
  defaultResponseTime?: string | null;
  closeIntroText?: string | null;
  agencyWebsite?: string | null;
  agencyEmail?: string | null;
  reportSchedule?: string | null;
  reportAutoSend?: boolean | null;
  healthAlertThreshold?: number | null;
  deliverableReminderDays?: number | null;
  useColdCall?: boolean | null;
  useVideoMessage?: boolean | null;
}

interface ServicePackageRow {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

interface SettingsFormProps {
  initialData: CardIdentity | null;
  plan: string;
  renewalDate: string | null;
  hasStripeCustomer: boolean;
  warmLeadCount?: number;
  hotLeadName?: string;
  initialPackages?: ServicePackageRow[];
}

const angles = ["pain", "opportunity", "compliment"] as const;
const ctaTypes = ["reply", "calendly", "link", "video"] as const;
const ctaLabels: Record<string, string> = {
  reply: "Reply-to Email",
  calendly: "Calendly URL",
  video: "Video URL",
  link: "Link URL",
};
const ctaPlaceholders: Record<string, string> = {
  reply: "hello@youragency.com",
  calendly: "https://calendly.com/...",
  video: "https://loom.com/...",
  link: "https://...",
};

// Fake lead data for card preview
const FAKE_LEAD = {
  businessName: "Glow Aesthetics",
  location: "Manchester",
  niche: "Aesthetic clinic",
  headline: "47 reviews mention wait times — here's what we found",
  observations: [
    { title: "Review response rate 0%", detail: "No owner responses to Google reviews, including 3-star complaints about wait times." },
    { title: "No online booking", detail: "Website has no booking system. Customers must call — creating friction at the conversion point." },
    { title: "Strong reputation, weak capture", detail: "4.2 stars across 47 reviews but no email capture or follow-up system visible on site." },
  ],
  revenueLoss: "£3,200/month",
};

function LockBadge({ feature, plan }: { feature: Feature; plan: string }) {
  const hasAccess = hasFeatureAccess(plan, feature);
  if (hasAccess) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded ml-2"
      style={{ fontSize: 10, background: "#C4973F15", border: "0.5px solid #C4973F30", color: "#C4973F", fontFamily: "var(--font-inter)" }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Upgrade
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 11, color: "#555250", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "var(--font-inter)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="px-3 py-2.5 rounded outline-none transition-colors w-full"
      style={{
        background: "#0F0E0B", border: "0.5px solid #1E1C18",
        color: disabled ? "#444" : "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)",
      }}
      onFocus={(e) => !disabled && (e.target.style.borderColor = "#C4973F")}
      onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
    />
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const c: Record<string, string> = { starter: "#555250", growth: "#5b7db1", pro: "#C4973F", enterprise: "#4CAF50" };
  const color = c[plan] ?? "#555250";
  return (
    <span style={{ fontSize: 12, color, background: `${color}15`, border: `0.5px solid ${color}30`, padding: "3px 10px", borderRadius: 20, fontFamily: "var(--font-inter)", fontWeight: 500 }}>
      {plan}
    </span>
  );
}

// Mini card preview
function CardPreview({ form }: { form: { agencyName: string; brandColour: string; logoUrl: string; ctaType: string; ctaValue: string } }) {
  const brand = form.brandColour || "#C4973F";

  function getCtaHref() {
    if (!form.ctaValue) return "#";
    if (form.ctaType === "reply") return `mailto:${form.ctaValue}`;
    return form.ctaValue;
  }

  return (
    <div
      style={{
        background: "#FAFAF8",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 0 0 1px #E8E5E0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 13,
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0EDE8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, color: brand, fontSize: 14 }}>
          {form.agencyName || "Your Agency"}
        </span>
        <span style={{ fontSize: 10, color: "#aaa" }}>Put this together for you</span>
      </div>

      {/* Business name */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          {FAKE_LEAD.niche} · {FAKE_LEAD.location}
        </p>
        <p style={{ fontSize: 22, color: "#1a1a18", fontFamily: "Georgia, serif", lineHeight: 1.1, marginBottom: 10 }}>
          {FAKE_LEAD.businessName}
        </p>
        <p style={{ fontSize: 13, color: "#4a4a48", lineHeight: 1.5, fontFamily: "Georgia, serif" }}>
          {FAKE_LEAD.headline}
        </p>
      </div>

      {/* Observations */}
      <div style={{ padding: "16px 20px" }}>
        {FAKE_LEAD.observations.slice(0, 2).map((obs, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 2, background: brand, borderRadius: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#1a1a18", marginBottom: 2 }}>{obs.title}</p>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>{obs.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div style={{ padding: "8px 20px 12px", borderTop: "1px solid #F0EDE8" }}>
        <p style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Estimated monthly impact</p>
        <p style={{ fontSize: 24, color: brand, fontFamily: "Georgia, serif" }}>{FAKE_LEAD.revenueLoss}</p>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 20px 20px" }}>
        <a
          href={getCtaHref()}
          style={{
            display: "block", textAlign: "center", padding: "10px", borderRadius: 8,
            background: brand, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
          }}
        >
          {form.ctaType === "reply" ? "Reply to this email" : "Book a call"}
        </a>
      </div>
    </div>
  );
}

function FeedbackWidget() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSending(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    setSent(true);
    setSending(false);
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 10 }}>
        What should we build next?
      </p>
      {sent ? (
        <p style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)" }}>
          Sent. I read every one.
        </p>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell Luke what you need..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "0.5px solid #2A2826",
              background: "#0D0C09",
              color: "#FFFDF8",
              fontSize: 12,
              fontFamily: "var(--font-inter)",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box",
              marginBottom: 8,
            }}
          />
          <button
            onClick={submit}
            disabled={!text.trim() || sending}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              background: "#1A1814",
              color: "#888",
              fontSize: 12,
              cursor: !text.trim() || sending ? "not-allowed" : "pointer",
              opacity: !text.trim() || sending ? 0.5 : 1,
              fontFamily: "var(--font-inter)",
            }}
          >
            {sending ? "Sending…" : "Send to Luke"}
          </button>
        </>
      )}
    </div>
  );
}

export function SettingsForm({ initialData, plan, renewalDate, hasStripeCustomer, warmLeadCount = 0, hotLeadName, initialPackages = [] }: SettingsFormProps) {
  const [form, setForm] = useState({
    brandColour: initialData?.brandColour ?? "#C4973F",
    accentColour: initialData?.accentColour ?? "#E8B44B",
    logoUrl: initialData?.logoUrl ?? "",
    agencyName: initialData?.agencyName ?? "",
    agencyTagline: initialData?.agencyTagline ?? "",
    agencyOwnerName: initialData?.agencyOwnerName ?? "",
    agencyOwnerPhoto: initialData?.agencyOwnerPhoto ?? "",
    writingStyle: initialData?.writingStyle ?? "",
    defaultAngle: initialData?.defaultAngle ?? "pain",
    ctaType: initialData?.ctaType ?? "reply",
    ctaValue: initialData?.ctaValue ?? "",
    cardStyle: initialData?.cardStyle ?? "editorial",
    defaultResponseTime: initialData?.defaultResponseTime ?? "24 hours",
    closeIntroText: initialData?.closeIntroText ?? "",
    agencyWebsite: initialData?.agencyWebsite ?? "",
    agencyEmail: initialData?.agencyEmail ?? "",
    reportSchedule: initialData?.reportSchedule ?? "manual",
    reportAutoSend: String(initialData?.reportAutoSend ?? false),
    healthAlertThreshold: String(initialData?.healthAlertThreshold ?? 60),
    deliverableReminderDays: String(initialData?.deliverableReminderDays ?? 2),
    useColdCall: String(initialData?.useColdCall ?? true),
    useVideoMessage: String(initialData?.useVideoMessage ?? false),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [packages, setPackages] = useState<ServicePackageRow[]>(initialPackages);
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgDesc, setPkgDesc] = useState("");
  const [pkgSaving, setPkgSaving] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  const sectionTitle = (title: string) => (
    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)", marginBottom: 16 }}>
      {title}
    </p>
  );

  return (
    <div className="flex gap-8 items-start">
      {/* Form column */}
      <form onSubmit={handleSave} className="space-y-8 flex-1 min-w-0 max-w-xl">
        {/* Card identity */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Card identity")}
          <div className="space-y-4">
            <Field label="Agency name">
              <TextInput value={form.agencyName} onChange={(v) => update("agencyName", v)} placeholder="e.g. Apex Digital" />
            </Field>
            <Field label="Agency tagline">
              <TextInput value={form.agencyTagline} onChange={(v) => update("agencyTagline", v)} placeholder="e.g. We grow local service businesses" />
            </Field>
            <Field label="Logo URL">
              <TextInput value={form.logoUrl} onChange={(v) => update("logoUrl", v)} placeholder="https://cdn.youragency.com/logo.svg" />
            </Field>
            <Field label="Your name (shown on card)">
              <TextInput value={form.agencyOwnerName} onChange={(v) => update("agencyOwnerName", v)} placeholder="e.g. Luke K." />
            </Field>
            <Field label="Your photo URL (circular, shown on card)">
              <TextInput value={form.agencyOwnerPhoto} onChange={(v) => update("agencyOwnerPhoto", v)} placeholder="https://..." />
            </Field>
            <Field label="Brand colour">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <input type="color" value={form.brandColour} onChange={(e) => update("brandColour", e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: form.brandColour, border: "0.5px solid #1E1C18" }} />
                </div>
                <TextInput value={form.brandColour} onChange={(v) => update("brandColour", v)} placeholder="#C4973F" />
              </div>
            </Field>
          </div>
        </section>

        {/* Voice & angle */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Voice & angle")}
          <div className="space-y-4">
            <Field label="Writing style">
              <textarea
                value={form.writingStyle}
                onChange={(e) => update("writingStyle", e.target.value)}
                placeholder="Describe how you write to prospects. This shapes every opening line Venn generates for you."
                rows={5}
                className="px-3 py-2.5 rounded outline-none resize-none w-full transition-colors"
                style={{ background: "#0A0907", border: "0.5px solid #1E1C18", color: "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.6 }}
                onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
                onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
              />
            </Field>
            <Field label="Default angle">
              <div className="flex gap-2">
                {angles.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => update("defaultAngle", a)}
                    className="px-3 py-1.5 rounded capitalize transition-all"
                    style={{
                      fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)",
                      background: form.defaultAngle === a ? "#C4973F" : "#1A1814",
                      color: form.defaultAngle === a ? "#0A0907" : "#555250",
                      border: `0.5px solid ${form.defaultAngle === a ? "transparent" : "#1E1C18"}`,
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Call to action")}
          <div className="space-y-4">
            <Field label="CTA type">
              <div className="flex gap-2">
                {ctaTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("ctaType", t)}
                    className="px-3 py-1.5 rounded capitalize transition-all"
                    style={{
                      fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)",
                      background: form.ctaType === t ? "#C4973F" : "#1A1814",
                      color: form.ctaType === t ? "#0A0907" : "#555250",
                      border: `0.5px solid ${form.ctaType === t ? "transparent" : "#1E1C18"}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={ctaLabels[form.ctaType] ?? "CTA value"}>
              <TextInput value={form.ctaValue} onChange={(v) => update("ctaValue", v)} placeholder={ctaPlaceholders[form.ctaType] ?? ""} />
            </Field>
          </div>
        </section>

        {/* Service packages */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Service packages")}
          <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 16, lineHeight: 1.5 }}>
            Packages are referenced when generating proposals for Pro plan users.
          </p>

          {packages.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#0A0907", border: "0.5px solid #1E1C18", borderRadius: 6, padding: "10px 14px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>{pkg.name}</p>
                    <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", marginTop: 2 }}>
                      £{pkg.price.toLocaleString()} {pkg.currency}
                      {pkg.description ? ` · ${pkg.description}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/service-packages/${pkg.id}`, { method: "DELETE" });
                      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
                    }}
                    style={{ fontSize: 11, color: "#444440", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", padding: "4px 8px" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Package name"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              style={{
                flex: "2 1 140px", padding: "8px 12px", borderRadius: 6, fontSize: 12,
                background: "#0A0907", border: "0.5px solid #1E1C18", color: "#FFFDF8",
                fontFamily: "var(--font-inter)", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
              onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
            />
            <input
              placeholder="Price (£)"
              value={pkgPrice}
              onChange={(e) => setPkgPrice(e.target.value)}
              type="number"
              style={{
                flex: "1 1 80px", padding: "8px 12px", borderRadius: 6, fontSize: 12,
                background: "#0A0907", border: "0.5px solid #1E1C18", color: "#FFFDF8",
                fontFamily: "var(--font-inter)", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
              onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
            />
            <input
              placeholder="Description (optional)"
              value={pkgDesc}
              onChange={(e) => setPkgDesc(e.target.value)}
              style={{
                flex: "3 1 180px", padding: "8px 12px", borderRadius: 6, fontSize: 12,
                background: "#0A0907", border: "0.5px solid #1E1C18", color: "#FFFDF8",
                fontFamily: "var(--font-inter)", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
              onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
            />
            <button
              type="button"
              disabled={!pkgName.trim() || !pkgPrice || pkgSaving}
              onClick={async () => {
                if (!pkgName.trim() || !pkgPrice) return;
                setPkgSaving(true);
                try {
                  const res = await fetch("/api/service-packages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: pkgName.trim(), price: parseFloat(pkgPrice), description: pkgDesc.trim() || undefined }),
                  });
                  if (res.ok) {
                    const data = await res.json() as { package: ServicePackageRow };
                    setPackages((prev) => [...prev, data.package]);
                    setPkgName(""); setPkgPrice(""); setPkgDesc("");
                  }
                } finally {
                  setPkgSaving(false);
                }
              }}
              style={{
                padding: "8px 14px", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-inter)",
                background: "transparent", border: "0.5px solid #C4973F", color: "#C4973F",
                cursor: (!pkgName.trim() || !pkgPrice) ? "not-allowed" : "pointer",
                opacity: (!pkgName.trim() || !pkgPrice) ? 0.4 : 1,
              }}
            >
              {pkgSaving ? "…" : "Add"}
            </button>
          </div>
        </section>

        {/* Card style */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Card style")}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { id: "editorial", label: "Editorial", desc: "Dark, numbered sections, review quotes" },
              { id: "minimal", label: "Minimal", desc: "Very sparse, data focused", soon: true },
              { id: "letter", label: "Letter", desc: "Warm, personal tone", soon: true },
              { id: "narrative", label: "Narrative", desc: "Cinematic scroll", soon: true },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => !style.soon && update("cardStyle", style.id)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: form.cardStyle === style.id ? "0.5px solid #C4973F" : "0.5px solid #1E1C18",
                  background: form.cardStyle === style.id ? "rgba(196,151,63,0.06)" : "transparent",
                  color: form.cardStyle === style.id ? "#C4973F" : style.soon ? "#2A2826" : "#555250",
                  fontSize: 13,
                  fontFamily: "var(--font-inter)",
                  cursor: style.soon ? "not-allowed" : "pointer",
                  textAlign: "left" as const,
                  opacity: style.soon ? 0.5 : 1,
                }}
              >
                <div>{style.label}{style.soon && <span style={{ fontSize: 10, marginLeft: 6, color: "#444440" }}>Soon</span>}</div>
                <div style={{ fontSize: 11, color: "#444440", marginTop: 2 }}>{style.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Venn Close settings */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Venn Close")}
          <div className="flex flex-col gap-5">
            <Field label="Default response time">
              <div style={{ display: "flex", gap: 8 }}>
                {["24 hours", "48 hours", "72 hours"].map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => update("defaultResponseTime", rt)}
                    style={{
                      padding: "7px 14px", borderRadius: 5, fontSize: 12,
                      fontFamily: "var(--font-inter)", cursor: "pointer",
                      background: form.defaultResponseTime === rt ? "#C4973F15" : "transparent",
                      border: `0.5px solid ${form.defaultResponseTime === rt ? "#C4973F" : "#1E1C18"}`,
                      color: form.defaultResponseTime === rt ? "#C4973F" : "#555250",
                    }}
                  >
                    {rt}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Opening message (shown to prospects)">
              <textarea
                value={form.closeIntroText}
                onChange={(e) => update("closeIntroText", e.target.value)}
                placeholder={`I've already looked at [businessName] in detail. Before I build your proposal I want to make sure it reflects what actually matters to you — not just what I found.\n\nThis takes about three minutes. There are no wrong answers.`}
                rows={5}
                style={{
                  width: "100%", background: "#0F0E0B", border: "0.5px solid #1E1C18",
                  borderRadius: 6, padding: "10px 12px", color: "#FFFDF8",
                  fontSize: 13, fontFamily: "var(--font-inter)", outline: "none",
                  resize: "vertical", lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
                onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
              />
              <p style={{ fontSize: 11, color: "#333230", fontFamily: "var(--font-inter)", marginTop: 4 }}>
                Leave blank to use the default. [businessName] is replaced automatically.
              </p>
            </Field>
          </div>
        </section>

        {/* Agency OS settings */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Agency OS")}
          <div className="flex flex-col gap-5">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Agency website">
                <TextInput value={form.agencyWebsite} onChange={(v) => update("agencyWebsite", v)} placeholder="https://youragency.com" />
              </Field>
              <Field label="Client-facing contact email">
                <TextInput value={form.agencyEmail} onChange={(v) => update("agencyEmail", v)} placeholder="hello@youragency.com" />
              </Field>
            </div>
            <Field label="Default report schedule">
              <div style={{ display: "flex", gap: 8 }}>
                {[["manual", "Manual only"], ["first", "1st of month"], ["last", "Last day of month"]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => update("reportSchedule", val)} style={{
                    padding: "7px 12px", borderRadius: 5, fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                    background: form.reportSchedule === val ? "#C4973F15" : "transparent",
                    border: `0.5px solid ${form.reportSchedule === val ? "#C4973F" : "#1E1C18"}`,
                    color: form.reportSchedule === val ? "#C4973F" : "#555250",
                  }}>{label}</button>
                ))}
              </div>
            </Field>
            <Field label="Client health alert threshold">
              <div style={{ display: "flex", gap: 8 }}>
                {[["80", "80 — Early warning"], ["60", "60 — Attention needed"], ["40", "40 — Critical"]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => update("healthAlertThreshold", val)} style={{
                    padding: "7px 12px", borderRadius: 5, fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                    background: form.healthAlertThreshold === val ? "#C4973F15" : "transparent",
                    border: `0.5px solid ${form.healthAlertThreshold === val ? "#C4973F" : "#1E1C18"}`,
                    color: form.healthAlertThreshold === val ? "#C4973F" : "#555250",
                  }}>{label}</button>
                ))}
              </div>
            </Field>
            <Field label="Deliverable reminder (days before due)">
              <div style={{ display: "flex", gap: 8 }}>
                {[["1", "1 day"], ["2", "2 days"], ["3", "3 days"], ["7", "7 days"]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => update("deliverableReminderDays", val)} style={{
                    padding: "7px 12px", borderRadius: 5, fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                    background: form.deliverableReminderDays === val ? "#C4973F15" : "transparent",
                    border: `0.5px solid ${form.deliverableReminderDays === val ? "#C4973F" : "#1E1C18"}`,
                    color: form.deliverableReminderDays === val ? "#C4973F" : "#555250",
                  }}>{label}</button>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* Outreach preferences */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Outreach Preferences")}
          <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 16 }}>
            These settings hide tools you don&apos;t use, so your arsenal stays focused.
          </p>
          {[
            { key: "useColdCall" as const, label: "Make cold calls", description: "Includes a cold call guide in your arsenal." },
            { key: "useVideoMessage" as const, label: "Send video messages", description: "Includes a Loom video script in your arsenal." },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>{description}</p>
              </div>
              <button
                type="button"
                onClick={() => update(key, form[key] === "true" ? "false" : "true")}
                style={{
                  width: 40, height: 22, borderRadius: 11, flexShrink: 0,
                  background: form[key] === "true" ? "#C4973F" : "#1A1814",
                  border: `0.5px solid ${form[key] === "true" ? "#C4973F" : "#1E1C18"}`,
                  cursor: "pointer", position: "relative", transition: "all 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 3,
                  left: form[key] === "true" ? 20 : 4,
                  width: 14, height: 14, borderRadius: "50%",
                  background: form[key] === "true" ? "#0A0907" : "#333",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>
          ))}
        </section>

        {/* Account / plan */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20 }}>
          {sectionTitle("Account")}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 6 }}>Current plan</p>
              <PlanBadge plan={plan} />
              {renewalDate && (
                <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginTop: 4 }}>
                  Renews {renewalDate}
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {hasStripeCustomer && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  style={{ fontSize: 12, fontWeight: 500, background: "#1A1814", color: "#888", fontFamily: "var(--font-inter)", borderRadius: 6, cursor: "pointer", padding: "6px 14px", border: "0.5px solid #1E1C18" }}
                >
                  Manage billing
                </button>
              )}
              {plan !== "pro" && plan !== "enterprise" && (
                <a
                  href="/subscribe"
                  style={{ fontSize: 12, fontWeight: 500, background: "#C4973F", color: "#0A0907", fontFamily: "var(--font-inter)", borderRadius: 6, cursor: "pointer", padding: "6px 14px", border: "none", textDecoration: "none", display: "inline-block" }}
                >
                  Upgrade plan
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LockBadge feature="api_access" plan={plan} />
            <LockBadge feature="white_label" plan={plan} />
            <LockBadge feature="advanced_reporting" plan={plan} />
          </div>
        </section>

        {/* Enterprise teaser */}
        <section style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: 20, opacity: 0.7 }}>
          <div className="flex items-center gap-2 mb-3">
            {sectionTitle("Enterprise")}
            <span style={{ fontSize: 10, background: "#4CAF5015", color: "#4CAF50", border: "0.5px solid #4CAF5030", padding: "1px 8px", borderRadius: 10, fontFamily: "var(--font-inter)", fontWeight: 500 }}>
              Coming soon
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {[
              { icon: "👥", label: "Team seats — up to 10 users" },
              { icon: "🔑", label: "API access for custom integrations" },
              { icon: "🏷", label: "White-label — your brand, your product" },
              { icon: "📊", label: "Advanced reporting and analytics" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)" }}>{label}</span>
              </div>
            ))}
          </div>
          <a
            href="mailto:hello@venn.so?subject=Enterprise enquiry"
            style={{ fontSize: 13, fontWeight: 500, background: "#1A1814", color: "#C4973F", border: "0.5px solid #C4973F30", fontFamily: "var(--font-inter)", textDecoration: "none", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px" }}
          >
            Contact us about Enterprise →
          </a>
        </section>

        {error && <p style={{ fontSize: 13, color: "#ef4444", fontFamily: "var(--font-inter)" }}>{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#C4973F", color: "#0A0907", fontSize: 13, fontWeight: 500,
              fontFamily: "var(--font-inter)", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1, padding: "8px 20px", border: "none",
            }}
          >
            {saving ? "Saving…" : "Save identity"}
          </button>
          {saved && <span style={{ fontSize: 12, color: "#4CAF50", fontFamily: "var(--font-inter)" }}>✓ Saved</span>}
        </div>
      </form>

      {/* Live preview column */}
      <div className="w-80 shrink-0 sticky top-6">
        <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 12 }}>
          Card preview — live
        </p>
        <CardPreview form={form} />
        <p style={{ fontSize: 11, color: "#333230", fontFamily: "var(--font-inter)", marginTop: 8, lineHeight: 1.5 }}>
          Updates as you change settings. This is what prospects see.
        </p>

        {/* Feedback */}
        <FeedbackWidget />
      </div>

      {showCancelModal && (
        <CancellationModal
          warmLeadCount={warmLeadCount}
          hotLeadName={hotLeadName}
          onCancel={async () => {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const d = await res.json();
            if (d.url) window.location.href = d.url;
          }}
          onDismiss={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}

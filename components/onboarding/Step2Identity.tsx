"use client";

import { useState, useEffect } from "react";

const ANGLES = [
  {
    key: "pain",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Lead with the problem",
    description: "Open by naming what's broken. Works best for high intent leads.",
  },
  {
    key: "opportunity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Lead with the upside",
    description: "Open with what's possible. Works for any intent level.",
  },
  {
    key: "compliment",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Open with a genuine observation",
    description: "Acknowledge what they do well before pivoting. Works for low intent.",
  },
] as const;

type AngleKey = "pain" | "opportunity" | "compliment";

interface FormData {
  agencyName: string;
  yourName: string;
  whatYouSell: string;
  whoYouSellTo: string;
  writingStyle: string;
  defaultAngle: AngleKey;
}

interface Step2Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  saving: boolean;
}

const LS_KEY = "venn_onboarding_identity";

function loadSaved(): Partial<FormData> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          color: "#555250",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 500,
          fontFamily: "var(--font-inter)",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#C4973F", marginLeft: 4 }}>*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded outline-none transition-colors"
        style={{
          background: "#0A0907",
          border: "0.5px solid #1E1C18",
          color: "#FFFDF8",
          fontSize: 14,
          fontFamily: "var(--font-inter)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
        onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
      />
    </div>
  );
}

export function Step2Identity({ onNext, onBack, saving }: Step2Props) {
  const [form, setForm] = useState<FormData>({
    agencyName: "",
    yourName: "",
    whatYouSell: "",
    whoYouSellTo: "",
    writingStyle: "",
    defaultAngle: "pain",
  });
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = loadSaved();
    setForm((prev) => ({ ...prev, ...saved }));
  }, []);

  // Auto-save on every change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  function set(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agencyName.trim() || !form.yourName.trim() || !form.writingStyle.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    onNext(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2
          style={{
            fontSize: 28,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          First — who are you?
        </h2>
        <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)" }}>
          This shapes everything Venn generates for you.
        </p>
      </div>

      <InputField label="Agency name" value={form.agencyName} onChange={(v) => set("agencyName", v)} placeholder="e.g. Momentum Agency" required />
      <InputField label="Your name" value={form.yourName} onChange={(v) => set("yourName", v)} placeholder="e.g. Luke" required />
      <InputField label="What do you sell?" value={form.whatYouSell} onChange={(v) => set("whatYouSell", v)} placeholder="e.g. AI automation for aesthetic clinics" />
      <InputField label="Who do you sell to?" value={form.whoYouSellTo} onChange={(v) => set("whoYouSellTo", v)} placeholder="e.g. Aesthetic clinic owners in the UK" />

      {/* Writing style */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 11,
            color: "#555250",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            marginBottom: 6,
          }}
        >
          How do you naturally write to prospects?
          <span style={{ color: "#C4973F", marginLeft: 4 }}>*</span>
        </label>
        <textarea
          value={form.writingStyle}
          onChange={(e) => set("writingStyle", e.target.value)}
          placeholder="Write a sentence or two like you'd normally open a message. Don't overthink it — just write how you talk."
          rows={4}
          className="w-full px-3 py-2.5 rounded outline-none resize-none transition-colors"
          style={{
            background: "#0A0907",
            border: "0.5px solid #1E1C18",
            color: "#FFFDF8",
            fontSize: 14,
            fontFamily: "var(--font-inter)",
            lineHeight: 1.6,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
          onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
        />
        <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginTop: 5, lineHeight: 1.5 }}>
          This is what makes every opening line sound like you, not like a template.
        </p>
      </div>

      {/* Angle selector */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 11,
            color: "#555250",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            marginBottom: 10,
          }}
        >
          Default angle
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ANGLES.map(({ key, icon, title, description }) => {
            const selected = form.defaultAngle === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => set("defaultAngle", key)}
                className="text-left p-3 rounded transition-all"
                style={{
                  background: selected ? "#1A1206" : "#0A0907",
                  border: `0.5px solid ${selected ? "#C4973F" : "#1E1C18"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <div className="mb-2">{icon}</div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 4 }}>
                  {title}
                </p>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>
                  {description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#C0392B", fontFamily: "var(--font-inter)" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded transition-opacity"
        style={{
          background: "#C4973F",
          color: "#0A0907",
          fontSize: 15,
          fontWeight: 500,
          fontFamily: "var(--font-inter)",
          borderRadius: 8,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {saving && (
          <div style={{ width: 14, height: 14, border: "1.5px solid #0A090730", borderTop: "1.5px solid #0A0907", borderRadius: "50%" }} className="animate-spin" />
        )}
        {saving ? "Saving…" : "Save my identity →"}
      </button>
    </form>
  );
}

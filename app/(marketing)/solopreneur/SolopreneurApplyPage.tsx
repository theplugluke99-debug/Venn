"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type State = "form" | "submitting" | "success";

const TEAM_SIZES = ["Just me", "2–5", "5–10", "10+"];
const NICHES = [
  "Local services",
  "E-commerce",
  "SaaS / Tech",
  "Real estate",
  "Finance",
  "Hospitality",
  "Other",
];

export function SolopreneurApplyPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    agency: "",
    teamSize: "",
    niche: "",
    monthlySpend: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.niche) e.niche = "Select a niche";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setState("submitting");
    try {
      const res = await fetch("/api/solopreneur/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setState("success");
      } else {
        setState("form");
      }
    } catch {
      setState("form");
    }
  }

  if (state === "success") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0907",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#C4973F15",
              border: "0.5px solid #C4973F40",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 24,
            }}
          >
            ✓
          </div>
          <h1
            style={{
              fontSize: 28,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Application received
          </h1>
          <p style={{ fontSize: 14, color: "#666462", lineHeight: 1.7, marginBottom: 32 }}>
            I review every application personally. You&apos;ll hear back within 24 hours — usually sooner. If approved, your 30-day trial starts immediately.
          </p>
          <p style={{ fontSize: 13, color: "#444240", lineHeight: 1.6 }}>
            — Luke
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: 40,
              padding: "10px 24px",
              borderRadius: 8,
              border: "0.5px solid #2A2826",
              background: "transparent",
              color: "#888",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0907",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span
            style={{
              fontSize: 11,
              color: "#C4973F",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 500,
              display: "block",
              marginBottom: 12,
            }}
          >
            Solopreneur Programme
          </span>
          <h1
            style={{
              fontSize: 32,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            30 days free. Close a deal.<br />Upgrade on results.
          </h1>
          <p style={{ fontSize: 14, color: "#666462", lineHeight: 1.7 }}>
            The Solopreneur Programme is for freelancers and solo agency owners who want to prove Venn works before committing to a paid plan. Use the tool, close a client, then decide.
          </p>
        </div>

        {/* What you get */}
        <div
          style={{
            background: "#0D0C09",
            border: "0.5px solid #1E1C18",
            borderRadius: 10,
            padding: "20px 24px",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#555250",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 500,
              marginBottom: 14,
            }}
          >
            Included in your trial
          </p>
          <ul className="solo-feature-grid" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            {[
              "100 leads",
              "20 prospect cards",
              "Outreach sequences",
              "30-day access",
              "Full AI intelligence",
              "Personal review by Luke",
            ].map((item) => (
              <li key={item} style={{ fontSize: 13, color: "#888", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#C4973F", fontSize: 11, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="solo-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
            {/* Name */}
            <Field
              label="Your name"
              error={errors.name}
              style={{ gridColumn: "1" }}
            >
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Luke Anderson"
                style={inputStyle(!!errors.name)}
              />
            </Field>

            {/* Email */}
            <Field
              label="Email address"
              error={errors.email}
              style={{ gridColumn: "2" }}
            >
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="luke@agency.co"
                style={inputStyle(!!errors.email)}
              />
            </Field>

            {/* Agency */}
            <Field
              label="Agency / business name"
              optional
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                type="text"
                value={form.agency}
                onChange={(e) => set("agency", e.target.value)}
                placeholder="Anderson Digital"
                style={inputStyle(false)}
              />
            </Field>

            {/* Team size */}
            <Field label="Team size" style={{ gridColumn: "1" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TEAM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => set("teamSize", size)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 6,
                      border: form.teamSize === size ? "0.5px solid #C4973F60" : "0.5px solid #2A2826",
                      background: form.teamSize === size ? "#C4973F15" : "transparent",
                      color: form.teamSize === size ? "#C4973F" : "#666",
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "var(--font-inter)",
                      transition: "all 0.15s",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </Field>

            {/* Niche */}
            <Field label="Primary niche" error={errors.niche} style={{ gridColumn: "2" }}>
              <select
                value={form.niche}
                onChange={(e) => set("niche", e.target.value)}
                style={{ ...inputStyle(!!errors.niche), color: form.niche ? "#FFFDF8" : "#444" }}
              >
                <option value="" disabled>Select a niche</option>
                {NICHES.map((n) => (
                  <option key={n} value={n} style={{ background: "#0D0C09" }}>{n}</option>
                ))}
              </select>
            </Field>

            {/* Monthly ad spend */}
            <Field
              label="Current monthly client spend"
              optional
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                type="text"
                value={form.monthlySpend}
                onChange={(e) => set("monthlySpend", e.target.value)}
                placeholder="e.g. £2,000–£5,000/month"
                style={inputStyle(false)}
              />
            </Field>

            {/* Notes */}
            <Field
              label="Anything else I should know?"
              optional
              style={{ gridColumn: "1 / -1" }}
            >
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Your situation, goals, or why you applied..."
                rows={3}
                style={{ ...inputStyle(false), resize: "vertical" }}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={state === "submitting"}
            style={{
              marginTop: 28,
              width: "100%",
              padding: "14px 24px",
              borderRadius: 8,
              border: "none",
              background: "#C4973F",
              color: "#0A0907",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-inter)",
              cursor: state === "submitting" ? "not-allowed" : "pointer",
              opacity: state === "submitting" ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {state === "submitting" ? "Submitting…" : "Submit application"}
          </button>

          <p style={{ fontSize: 12, color: "#333230", marginTop: 16, textAlign: "center" }}>
            No credit card. No commitment. Luke reviews every application personally.
          </p>
        </form>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .solo-feature-grid { grid-template-columns: 1fr !important; }
          .solo-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: hasError ? "0.5px solid #E5534B60" : "0.5px solid #2A2826",
    background: "#0D0C09",
    color: "#FFFDF8",
    fontSize: 13,
    fontFamily: "var(--font-inter)",
    outline: "none",
    boxSizing: "border-box",
  };
}

function Field({
  label,
  error,
  optional,
  style,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div style={style}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: "#888",
          marginBottom: 6,
          fontFamily: "var(--font-inter)",
        }}
      >
        {label}
        {optional && <span style={{ color: "#444", marginLeft: 4 }}>(optional)</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 11, color: "#E5534B", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}

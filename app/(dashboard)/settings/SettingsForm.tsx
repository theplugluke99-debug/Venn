"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CardIdentity {
  brandColour: string;
  accentColour: string;
  logoUrl: string | null;
  agencyName: string | null;
  agencyTagline: string | null;
  writingStyle: string | null;
  defaultAngle: string;
  ctaType: string;
  ctaValue: string | null;
}

const angles = ["pain", "opportunity", "compliment"];
const ctaTypes = ["reply", "calendly", "link", "video"];

export function SettingsForm({ initialData }: { initialData: CardIdentity | null }) {
  const [form, setForm] = useState({
    brandColour: initialData?.brandColour ?? "#C4973F",
    accentColour: initialData?.accentColour ?? "#E8B44B",
    logoUrl: initialData?.logoUrl ?? "",
    agencyName: initialData?.agencyName ?? "",
    agencyTagline: initialData?.agencyTagline ?? "",
    writingStyle: initialData?.writingStyle ?? "",
    defaultAngle: initialData?.defaultAngle ?? "pain",
    ctaType: initialData?.ctaType ?? "reply",
    ctaValue: initialData?.ctaValue ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(d.error || "Failed to save.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xs text-[#555] uppercase tracking-wider">Agency Identity</h2>
        <Input
          label="Agency Name"
          placeholder="e.g. Apex Digital"
          value={form.agencyName}
          onChange={(e) => update("agencyName", e.target.value)}
        />
        <Input
          label="Tagline (optional)"
          placeholder="e.g. We grow local service businesses"
          value={form.agencyTagline}
          onChange={(e) => update("agencyTagline", e.target.value)}
        />
        <Input
          label="Logo URL (optional)"
          placeholder="https://cdn.your-agency.com/logo.svg"
          value={form.logoUrl}
          onChange={(e) => update("logoUrl", e.target.value)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs text-[#555] uppercase tracking-wider">Brand Colours</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
              Brand Colour
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.brandColour}
                onChange={(e) => update("brandColour", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <Input
                value={form.brandColour}
                onChange={(e) => update("brandColour", e.target.value)}
                className="flex-1"
                placeholder="#C4973F"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
              Accent Colour
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.accentColour}
                onChange={(e) => update("accentColour", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <Input
                value={form.accentColour}
                onChange={(e) => update("accentColour", e.target.value)}
                className="flex-1"
                placeholder="#E8B44B"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs text-[#555] uppercase tracking-wider">Voice & Angle</h2>
        <Textarea
          label="Writing Style"
          placeholder="Paste a sample of how you write cold outreach. The more specific, the better Claude can match your voice."
          value={form.writingStyle}
          onChange={(e) => update("writingStyle", e.target.value)}
          rows={4}
          hint="Claude will mimic this style when writing opening lines and card copy."
        />
        <div>
          <label className="text-xs font-medium text-[#888] uppercase tracking-wider block mb-2">
            Default Angle
          </label>
          <div className="flex gap-2">
            {angles.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => update("defaultAngle", a)}
                className={[
                  "px-3 py-1.5 text-xs rounded capitalize transition-colors",
                  form.defaultAngle === a
                    ? "bg-[#C4973F] text-[#0A0907] font-medium"
                    : "bg-[#1A1814] text-[#888] border border-[#2A2720] hover:text-[#FFFDF8]",
                ].join(" ")}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs text-[#555] uppercase tracking-wider">Call to Action</h2>
        <div>
          <label className="text-xs font-medium text-[#888] uppercase tracking-wider block mb-2">
            CTA Type
          </label>
          <div className="flex gap-2">
            {ctaTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("ctaType", t)}
                className={[
                  "px-3 py-1.5 text-xs rounded capitalize transition-colors",
                  form.ctaType === t
                    ? "bg-[#C4973F] text-[#0A0907] font-medium"
                    : "bg-[#1A1814] text-[#888] border border-[#2A2720] hover:text-[#FFFDF8]",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Input
          label={
            form.ctaType === "reply"
              ? "Reply-to Email"
              : form.ctaType === "calendly"
              ? "Calendly URL"
              : form.ctaType === "video"
              ? "Video URL"
              : "Link URL"
          }
          placeholder={
            form.ctaType === "reply"
              ? "hello@your-agency.com"
              : "https://"
          }
          value={form.ctaValue}
          onChange={(e) => update("ctaValue", e.target.value)}
        />
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={saving}>
          Save Settings
        </Button>
        {saved ? (
          <span className="text-xs text-emerald-400">Saved</span>
        ) : null}
      </div>
    </form>
  );
}

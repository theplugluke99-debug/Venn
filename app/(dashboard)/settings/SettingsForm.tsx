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
    <form onSubmit={handleSave} className="space-y-10">
      <fieldset className="space-y-4">
        <legend className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-4">
          Agency Identity
        </legend>
        <Input
          label="Agency Name"
          placeholder="e.g. Apex Digital"
          value={form.agencyName}
          onChange={(e) => update("agencyName", e.target.value)}
        />
        <Input
          label="Tagline"
          placeholder="e.g. We grow local service businesses"
          value={form.agencyTagline}
          onChange={(e) => update("agencyTagline", e.target.value)}
        />
        <Input
          label="Logo URL"
          placeholder="https://cdn.youragency.com/logo.svg"
          value={form.logoUrl}
          onChange={(e) => update("logoUrl", e.target.value)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-4">
          Brand Colours
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888] uppercase tracking-wider block">
              Primary
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <input
                  type="color"
                  value={form.brandColour}
                  onChange={(e) => update("brandColour", e.target.value)}
                  className="w-9 h-9 cursor-pointer rounded opacity-0 absolute inset-0"
                />
                <div
                  className="w-9 h-9 rounded border border-[#2A2720]"
                  style={{ background: form.brandColour }}
                />
              </div>
              <Input
                value={form.brandColour}
                onChange={(e) => update("brandColour", e.target.value)}
                placeholder="#C4973F"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888] uppercase tracking-wider block">
              Accent
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <input
                  type="color"
                  value={form.accentColour}
                  onChange={(e) => update("accentColour", e.target.value)}
                  className="w-9 h-9 cursor-pointer rounded opacity-0 absolute inset-0"
                />
                <div
                  className="w-9 h-9 rounded border border-[#2A2720]"
                  style={{ background: form.accentColour }}
                />
              </div>
              <Input
                value={form.accentColour}
                onChange={(e) => update("accentColour", e.target.value)}
                placeholder="#E8B44B"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-4">
          Voice &amp; Angle
        </legend>
        <Textarea
          label="Writing Style"
          placeholder="Paste a sample of your cold outreach writing. The more specific, the better Claude can match your voice."
          value={form.writingStyle}
          onChange={(e) => update("writingStyle", e.target.value)}
          rows={5}
          hint="Claude mimics this style when writing opening lines and card copy."
        />
        <div>
          <label className="text-xs font-medium text-[#888] uppercase tracking-wider block mb-2.5">
            Default Angle
          </label>
          <div className="flex gap-2">
            {angles.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => update("defaultAngle", a)}
                className={[
                  "px-3 py-1.5 text-xs rounded capitalize transition-all",
                  form.defaultAngle === a
                    ? "bg-[#C4973F] text-[#0A0907] font-semibold"
                    : "bg-[#1A1814] text-[#666] border border-[#2A2720] hover:text-[#FFFDF8] hover:border-[#444]",
                ].join(" ")}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-4">
          Call to Action
        </legend>
        <div>
          <label className="text-xs font-medium text-[#888] uppercase tracking-wider block mb-2.5">
            CTA Type
          </label>
          <div className="flex gap-2">
            {ctaTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("ctaType", t)}
                className={[
                  "px-3 py-1.5 text-xs rounded capitalize transition-all",
                  form.ctaType === t
                    ? "bg-[#C4973F] text-[#0A0907] font-semibold"
                    : "bg-[#1A1814] text-[#666] border border-[#2A2720] hover:text-[#FFFDF8] hover:border-[#444]",
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
              ? "hello@youragency.com"
              : "https://"
          }
          value={form.ctaValue}
          onChange={(e) => update("ctaValue", e.target.value)}
        />
      </fieldset>

      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}

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

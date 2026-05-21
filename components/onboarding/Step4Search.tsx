"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTED_NICHES = [
  "Aesthetic clinics",
  "Dentists",
  "Estate agents",
  "Gyms",
  "Accountants",
  "Solicitors",
  "Restaurants",
  "Car dealerships",
];

interface Step4Props {
  onSkip: () => void;
  onBack: () => void;
}

export function Step4Search({ onSkip, onBack }: Step4Props) {
  const router = useRouter();
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim() || !location.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // Mark onboarding complete then redirect to search
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {}

    const params = new URLSearchParams({ niche, location, autostart: "1" });
    router.push(`/search?${params.toString()}`);
  }

  return (
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
        Now let&apos;s find your first leads
      </h2>
      <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 24 }}>
        Tell Venn who you&apos;re looking for.
      </p>

      <form onSubmit={handleSearch} className="space-y-4">
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
            Niche
          </label>
          <input
            value={niche}
            onChange={(e) => { setNiche(e.target.value); setError(null); }}
            placeholder="e.g. aesthetic clinic, dentist, estate agent"
            disabled={loading}
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
            Location
          </label>
          <input
            value={location}
            onChange={(e) => { setLocation(e.target.value); setError(null); }}
            placeholder="e.g. Manchester, London, Birmingham"
            disabled={loading}
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

        {/* Niche chips */}
        <div>
          <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
            Quick fill:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_NICHES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNiche(n)}
                className="px-3 py-1 rounded-full transition-all"
                style={{
                  fontSize: 12,
                  background: niche === n ? "#C4973F15" : "#1A1814",
                  color: niche === n ? "#C4973F" : "#555250",
                  border: `0.5px solid ${niche === n ? "#C4973F40" : "#1E1C18"}`,
                  fontFamily: "var(--font-inter)",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: "#C0392B", fontFamily: "var(--font-inter)" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 15,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading && (
            <div style={{ width: 14, height: 14, border: "1.5px solid #0A090730", borderTop: "1.5px solid #0A0907", borderRadius: "50%" }} className="animate-spin" />
          )}
          {loading ? "Starting search…" : "Find my first leads →"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onSkip}
          style={{
            fontSize: 13,
            color: "#444",
            fontFamily: "var(--font-inter)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          I&apos;ll search later — take me to the dashboard
        </button>
      </div>
    </div>
  );
}

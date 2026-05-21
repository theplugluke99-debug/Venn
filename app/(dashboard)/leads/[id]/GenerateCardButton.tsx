"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function GenerateCardButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate card.");
        return;
      }
      router.push(`/card/${data.card.slug}`);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded transition-opacity hover:opacity-90"
        style={{
          background: "#C4973F",
          color: "#0A0907",
          fontSize: 15,
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading && (
          <div
            className="animate-spin"
            style={{ width: 14, height: 14, border: "1.5px solid #0A090730", borderTop: "1.5px solid #0A0907", borderRadius: "50%" }}
          />
        )}
        {loading ? "Generating…" : "Generate prospect card →"}
      </button>
      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8, fontFamily: "var(--font-inter)" }}>{error}</p>}
    </div>
  );
}

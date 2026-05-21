"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { JobStatus } from "@/types";

const STAGES = [
  { key: "finding", label: "Finding businesses" },
  { key: "analysing", label: "Analysing reviews" },
  { key: "scoring", label: "Scoring intent" },
  { key: "building", label: "Building profiles" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

const STATUS_TO_STAGE: Record<string, StageKey> = {
  pending: "finding",
  scraping: "analysing",
  enriching: "scoring",
  complete: "building",
};

function StageRow({
  label,
  state,
}: {
  label: string;
  state: "pending" | "active" | "done";
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{ width: 20, height: 20 }}
        >
          {state === "done" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#4CAF5015",
                border: "0.5px solid #4CAF5040",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 6l3 3 5-5" />
              </svg>
            </motion.div>
          )}
          {state === "active" && (
            <div
              className="animate-spin"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: "1.5px solid #C4973F30",
                borderTop: "1.5px solid #C4973F",
              }}
            />
          )}
          {state === "pending" && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#333230",
              }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            color: state === "done" ? "#4CAF50" : state === "active" ? "#FFFDF8" : "#333230",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-inter)",
          color: state === "done" ? "#4CAF50" : state === "active" ? "#C4973F" : "#333230",
        }}
      >
        {state === "done" ? "Done" : state === "active" ? "In progress…" : "Waiting"}
      </span>
    </div>
  );
}

function getStageState(
  stageKey: StageKey,
  currentStage: StageKey | null
): "pending" | "active" | "done" {
  if (!currentStage) return "pending";
  const stageIndex = STAGES.findIndex((s) => s.key === stageKey);
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
  if (stageIndex < currentIndex) return "done";
  if (stageIndex === currentIndex) return "active";
  return "pending";
}

export function SearchForm() {
  const router = useRouter();
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<StageKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pollJobStatus(jobId: string, leadId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data: JobStatus = await res.json();

        const stage = STATUS_TO_STAGE[data.status];
        if (stage) setCurrentStage(stage);

        if (data.status === "complete" || data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          if (data.status === "complete") {
            router.push(`/leads/${leadId}`);
          } else {
            setError("Enrichment failed. The lead was still saved.");
            router.push("/leads");
          }
        }
      } catch {
        clearInterval(interval);
        setLoading(false);
        router.push(`/leads/${leadId}`);
      }
    }, 2500);

    setTimeout(() => {
      clearInterval(interval);
      if (loading) {
        setLoading(false);
        router.push("/leads");
      }
    }, 120000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim() || !location.trim() || !businessName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setLoading(true);
    setCurrentStage("finding");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location, businessName, limit }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        setCurrentStage(null);
        return;
      }

      await pollJobStatus(data.jobId, data.leadId);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setCurrentStage(null);
    }
  }

  return (
    <div className="max-w-lg w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business name */}
        <div>
          <label
            className="block mb-1.5"
            style={{
              fontSize: 11,
              color: "#555250",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 500,
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            }}
          >
            Business name
          </label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Bloom Beauty Studio"
            disabled={loading}
            required
            className="w-full px-3 py-2.5 rounded outline-none transition-colors"
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              color: "#FFFDF8",
              fontSize: 14,
              fontFamily: "var(--font-inter)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
            onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Niche */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: 11,
                color: "#555250",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                fontFamily: "var(--font-inter)",
              }}
            >
              Niche
            </label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. aesthetic clinic"
              disabled={loading}
              required
              className="w-full px-3 py-2.5 rounded outline-none transition-colors"
              style={{
                background: "#0F0E0B",
                border: "0.5px solid #1E1C18",
                color: "#FFFDF8",
                fontSize: 14,
                fontFamily: "var(--font-inter)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
              onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
            />
          </div>

          {/* Location */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: 11,
                color: "#555250",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                fontFamily: "var(--font-inter)",
              }}
            >
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Manchester"
              disabled={loading}
              required
              className="w-full px-3 py-2.5 rounded outline-none transition-colors"
              style={{
                background: "#0F0E0B",
                border: "0.5px solid #1E1C18",
                color: "#FFFDF8",
                fontSize: 14,
                fontFamily: "var(--font-inter)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
              onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
            />
          </div>
        </div>

        {/* Limit slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              style={{
                fontSize: 11,
                color: "#555250",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                fontFamily: "var(--font-inter)",
              }}
            >
              Number of leads
            </label>
            <span style={{ fontSize: 13, color: "#C4973F", fontWeight: 600, fontFamily: "var(--font-inter)" }}>
              {limit}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            disabled={loading}
            className="w-full"
            style={{ accentColor: "#C4973F" }}
          />
          <div
            className="flex justify-between mt-1"
            style={{ fontSize: 10, color: "#333230", fontFamily: "var(--font-inter)" }}
          >
            <span>10</span>
            <span>50</span>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "#ef4444", fontFamily: "var(--font-inter)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded transition-opacity"
          style={{
            background: loading ? "#8B6A2B" : "#C4973F",
            color: "#0A0907",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <div
                className="animate-spin"
                style={{ width: 14, height: 14, border: "1.5px solid #0A090730", borderTop: "1.5px solid #0A0907", borderRadius: "50%" }}
              />
              Processing…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
              Start intelligence search
            </>
          )}
        </button>
      </form>

      {/* Progress stages */}
      <AnimatePresence>
        {loading && currentStage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: "0.5px solid #1E1C18" }}
            >
              <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Intelligence search in progress
              </p>
            </div>
            <div className="px-4">
              {STAGES.map(({ key, label }) => (
                <StageRow
                  key={key}
                  label={label}
                  state={getStageState(key, currentStage)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

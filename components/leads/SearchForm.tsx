"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LeadJob {
  leadId: string;
  jobId: string;
  businessName: string;
  address: string;
  status: "pending" | "scraping" | "enriching" | "complete" | "failed";
  progress: number;
  lead: null | {
    id: string;
    intentScore: string;
    openingLine: string | null;
    googleRating: number | null;
    reviewCount: number | null;
    niche: string;
    location: string;
    card: { slug: string } | null;
  };
}

function progressLabel(progress: number): string {
  if (progress < 35) return "Finding details…";
  if (progress < 60) return "Auditing website…";
  if (progress < 85) return "Scoring intent…";
  return "Building profile…";
}

function IntentBadge({ score }: { score: string }) {
  const config: Record<string, { label: string; bg: string; color: string; border: string }> = {
    high: { label: "High intent", bg: "#0d2b0d", color: "#4CAF50", border: "#4CAF5030" },
    medium: { label: "Medium intent", bg: "#2b1e05", color: "#C4973F", border: "#C4973F30" },
    low: { label: "Low intent", bg: "#0d1524", color: "#5b7db1", border: "#5b7db130" },
  };
  const c = config[score] ?? config.medium;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        background: c.bg,
        color: c.color,
        border: `0.5px solid ${c.border}`,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "var(--font-inter)",
      }}
    >
      {c.label}
    </span>
  );
}

function LeadResult({ job }: { job: LeadJob }) {
  const isDone = job.status === "complete";
  const isFailed = job.status === "failed";
  const lead = job.lead;

  const intentBorderColor =
    lead?.intentScore === "high"
      ? "#4CAF50"
      : lead?.intentScore === "low"
      ? "#5b7db1"
      : "#C4973F";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: isDone && lead ? `2px solid ${intentBorderColor}` : "2px solid #1E1C18",
        borderRadius: 8,
        padding: 16,
        transition: "border-left-color 0.4s ease",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
              {job.businessName}
            </span>
            {isDone && lead && <IntentBadge score={lead.intentScore} />}
          </div>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
            {job.address}
          </p>
        </div>

        {isDone && (
          <Link
            href={`/leads/${job.leadId}`}
            style={{
              fontSize: 12,
              color: "#C4973F",
              fontFamily: "var(--font-inter)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            View →
          </Link>
        )}
        {isFailed && (
          <span style={{ fontSize: 11, color: "#ef4444", fontFamily: "var(--font-inter)" }}>Failed</span>
        )}
      </div>

      {/* Progress bar */}
      {!isDone && !isFailed && (
        <div>
          <div
            style={{
              height: 2,
              background: "#1A1814",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            <motion.div
              animate={{ width: `${Math.max(job.progress, 3)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ height: "100%", background: "#C4973F", borderRadius: 2 }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
            {progressLabel(job.progress)}
          </p>
        </div>
      )}

      {/* Opening line when complete */}
      {isDone && lead?.openingLine && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 13,
            color: "#888",
            fontStyle: "italic",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.5,
            marginTop: 6,
          }}
        >
          &ldquo;{lead.openingLine}&rdquo;
        </motion.p>
      )}
    </motion.div>
  );
}

interface SearchFormProps {
  initialNiche?: string;
  initialLocation?: string;
  autostart?: boolean;
}

export function SearchForm({ initialNiche = "", initialLocation = "", autostart = false }: SearchFormProps) {
  const [niche, setNiche] = useState(initialNiche);
  const [location, setLocation] = useState(initialLocation);
  const [limit, setLimit] = useState(10);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<LeadJob[]>([]);
  const pollingRefs = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const autostartFired = useRef(false);

  function updateJob(jobId: string, updates: Partial<LeadJob>) {
    setJobs((prev) => prev.map((j) => (j.jobId === jobId ? { ...j, ...updates } : j)));
  }

  function stopPolling(jobId: string) {
    const t = pollingRefs.current.get(jobId);
    if (t) {
      clearInterval(t);
      pollingRefs.current.delete(jobId);
    }
  }

  function startPolling(job: LeadJob) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${job.jobId}`);
        if (!res.ok) return;
        const data = await res.json();

        const progress = typeof data.progress === "number" ? data.progress : 0;
        updateJob(job.jobId, { progress, status: data.status });

        if (data.status === "complete") {
          stopPolling(job.jobId);
          // Fetch lead detail
          try {
            const leadRes = await fetch(`/api/leads/${job.leadId}`);
            if (leadRes.ok) {
              const { lead } = await leadRes.json();
              updateJob(job.jobId, { lead, status: "complete" });
            }
          } catch {}
        } else if (data.status === "failed") {
          stopPolling(job.jobId);
          updateJob(job.jobId, { status: "failed" });
        }
      } catch {
        stopPolling(job.jobId);
      }
    }, 2000);

    pollingRefs.current.set(job.jobId, interval);

    // Safety timeout after 3 min
    setTimeout(() => stopPolling(job.jobId), 180_000);
  }

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!niche.trim() || !location.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setError(null);
    setSearching(true);
    setJobs([]);

    // Clear any existing polls
    pollingRefs.current.forEach((t) => clearInterval(t));
    pollingRefs.current.clear();

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location, limit }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSearching(false);
        return;
      }

      const initialJobs: LeadJob[] = data.businesses.map(
        (b: { leadId: string; jobId: string; businessName: string; address: string }) => ({
          leadId: b.leadId,
          jobId: b.jobId,
          businessName: b.businessName,
          address: b.address,
          status: "pending" as const,
          progress: 0,
          lead: null,
        })
      );

      setJobs(initialJobs);
      setSearching(false);

      // Start polling each job
      initialJobs.forEach((job) => startPolling(job));
    } catch {
      setError("Network error. Please try again.");
      setSearching(false);
    }
  }

  // Auto-submit when props say autostart and we haven't fired yet
  useEffect(() => {
    if (autostart && initialNiche && initialLocation && !autostartFired.current) {
      autostartFired.current = true;
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart, initialNiche, initialLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pollingRefs.current.forEach((t) => clearInterval(t));
    };
  }, []);

  const completedCount = jobs.filter((j) => j.status === "complete").length;
  const totalCount = jobs.length;
  const allDone = totalCount > 0 && jobs.every((j) => j.status === "complete" || j.status === "failed");

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. aesthetic clinic"
              disabled={searching || jobs.length > 0}
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
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Manchester"
              disabled={searching || jobs.length > 0}
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

        {jobs.length === 0 && (
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
                Results
              </label>
              <span style={{ fontSize: 13, color: "#C4973F", fontWeight: 600, fontFamily: "var(--font-inter)" }}>
                {limit}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={5}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#C4973F" }}
            />
            <div className="flex justify-between mt-1" style={{ fontSize: 10, color: "#333230", fontFamily: "var(--font-inter)" }}>
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: 13, color: "#ef4444", fontFamily: "var(--font-inter)" }}>{error}</p>
        )}

        {jobs.length === 0 && (
          <button
            type="submit"
            disabled={searching}
            className="w-full flex items-center justify-center gap-2 py-3 rounded transition-opacity hover:opacity-90"
            style={{
              background: searching ? "#8B6A2B" : "#C4973F",
              color: "#0A0907",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "var(--font-inter)",
              borderRadius: 8,
              cursor: searching ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            {searching ? (
              <>
                <div
                  className="animate-spin"
                  style={{ width: 14, height: 14, border: "1.5px solid #0A090730", borderTop: "1.5px solid #0A0907", borderRadius: "50%" }}
                />
                Searching…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16.5 16.5 4 4" />
                </svg>
                Find leads →
              </>
            )}
          </button>
        )}
      </form>

      {/* Results */}
      <AnimatePresence>
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-2"
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                  {allDone
                    ? `Found ${completedCount} lead${completedCount !== 1 ? "s" : ""}`
                    : `Analysing ${totalCount} businesses…`}
                </p>
                {!allDone && (
                  <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                    {completedCount} of {totalCount} complete
                  </p>
                )}
              </div>

              {allDone && (
                <button
                  onClick={() => {
                    setJobs([]);
                    setNiche("");
                    setLocation("");
                  }}
                  style={{
                    fontSize: 12,
                    color: "#555250",
                    fontFamily: "var(--font-inter)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  New search
                </button>
              )}
            </div>

            {jobs.map((job) => (
              <LeadResult key={job.jobId} job={job} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

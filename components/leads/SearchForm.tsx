"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { JobStatus } from "@/types";

const NICHES = [
  "Beauty Salon",
  "Dental Practice",
  "Restaurant",
  "Personal Trainer",
  "Estate Agent",
  "Solicitor",
  "Accountant",
  "Plumber",
  "Electrician",
  "Gym",
];

export function SearchForm() {
  const router = useRouter();
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function pollJobStatus(jobId: string, leadId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data: JobStatus = await res.json();
        setProgress(data.progress);
        setStatus(data.status);

        if (data.status === "complete" || data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          if (data.status === "complete") {
            router.push(`/leads/${leadId}`);
          } else {
            setError("Enrichment failed. The lead was still saved.");
            router.push(`/leads`);
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
        router.push(`/leads`);
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
    setStatus("pending");
    setProgress(0);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location, businessName, website }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      await pollJobStatus(data.jobId, data.leadId);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const statusLabels: Record<string, string> = {
    pending: "Queuing search…",
    scraping: "Pulling Google data…",
    enriching: "Running AI analysis…",
    complete: "Done — redirecting…",
    failed: "Something went wrong",
  };

  return (
    <div className="max-w-xl w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Business Name"
          placeholder="e.g. Bloom Beauty Studio"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
              Niche
            </label>
            <input
              list="niches"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Beauty Salon"
              disabled={loading}
              className="bg-[#0F0E0B] border border-[#2A2720] focus:border-[#C4973F] text-[#FFFDF8] text-sm rounded px-3 py-2.5 outline-none transition-colors placeholder:text-[#555]"
              required
            />
            <datalist id="niches">
              {NICHES.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          <Input
            label="Location"
            placeholder="e.g. Manchester"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Input
          label="Website (optional)"
          placeholder="e.g. https://bloombeauty.co.uk"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={loading}
        />

        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? statusLabels[status ?? "pending"] ?? "Processing…" : "Research Business"}
        </Button>
      </form>

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#888]">
                {statusLabels[status ?? "pending"]}
              </span>
              <span className="text-xs text-[#555]">{progress}%</span>
            </div>
            <div className="h-1 bg-[#1A1814] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#C4973F] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

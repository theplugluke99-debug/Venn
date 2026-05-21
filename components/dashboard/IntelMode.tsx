"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeadCard } from "@/components/leads/LeadCard";
import type { IntentScore } from "@/types";

interface Lead {
  id: string;
  businessName: string;
  niche: string;
  location: string;
  intentScore: string;
  status: string;
  googleRating: number | null;
  reviewCount: number | null;
  openingLine: string | null;
  card: { slug: string } | null;
  createdAt: Date;
}

type Filter = "all" | "high" | "medium" | "low";
type SortKey = "intent" | "recent" | "name";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const INTENT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function IntelMode({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("intent");
  const [search, setSearch] = useState("");

  const completedLeads = leads.filter((l) => l.status === "complete");

  let filtered = completedLeads.filter((l) => {
    if (filter !== "all" && l.intentScore !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.niche.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "intent") return (INTENT_ORDER[a.intentScore] ?? 2) - (INTENT_ORDER[b.intentScore] ?? 2);
    if (sort === "name") return a.businessName.localeCompare(b.businessName);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl"
    >
      {/* Filter row */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-full"
          style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18" }}
        >
          {(["all", "high", "medium", "low"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full transition-all capitalize"
              style={{
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                background: filter === f ? "#C4973F" : "transparent",
                color: filter === f ? "#0A0907" : "#555250",
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            fontSize: 11,
            color: "#555250",
            fontFamily: "var(--font-inter)",
          }}
        >
          <span>Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent outline-none cursor-pointer capitalize"
            style={{ color: "#FFFDF8", fontSize: 11, fontFamily: "var(--font-inter)" }}
          >
            <option value="intent">Intent</option>
            <option value="recent">Recent</option>
            <option value="name">Name</option>
          </select>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads…"
          className="flex-1 min-w-[140px] px-3 py-1.5 rounded outline-none transition-colors"
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            color: "#FFFDF8",
            fontSize: 11,
            fontFamily: "var(--font-inter)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#C4973F")}
          onBlur={(e) => (e.target.style.borderColor = "#1E1C18")}
        />
      </div>

      {/* Lead feed */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-12"
          style={{
            border: "0.5px dashed #1E1C18",
            borderRadius: 8,
            color: "#333230",
            fontSize: 13,
            fontFamily: "var(--font-inter)",
          }}
        >
          {leads.length === 0 ? "No leads yet. Run a search to get started." : "No leads match your filters."}
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03, duration: 0.15 }}
              >
                <LeadCard
                  id={lead.id}
                  businessName={lead.businessName}
                  niche={lead.niche}
                  location={lead.location}
                  intentScore={lead.intentScore as IntentScore}
                  status={lead.status}
                  googleRating={lead.googleRating}
                  reviewCount={lead.reviewCount}
                  openingLine={lead.openingLine}
                  cardSlug={lead.card?.slug ?? null}
                  createdAt={lead.createdAt}
                  compact={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

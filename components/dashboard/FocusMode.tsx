"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

interface FocusModeProps {
  leads: Lead[];
  totalLeads: number;
}

function SectionHeader({
  title,
  count,
  href,
}: {
  title: string;
  count: number;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2
          style={{
            fontSize: 11,
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          }}
        >
          {title}
        </h2>
        <span
          className="px-1.5 py-0.5 rounded"
          style={{
            fontSize: 10,
            background: "#1A1814",
            border: "0.5px solid #1E1C18",
            color: "#555250",
            fontFamily: "var(--font-inter)",
          }}
        >
          {count}
        </span>
      </div>
      <Link
        href={href}
        style={{
          fontSize: 11,
          color: "#C4973F",
          fontFamily: "var(--font-inter)",
          textDecoration: "none",
        }}
      >
        View all →
      </Link>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div
      className="text-center py-8"
      style={{
        border: "0.5px dashed #1E1C18",
        borderRadius: 8,
        color: "#333230",
        fontSize: 12,
        fontFamily: "var(--font-inter)",
      }}
    >
      {message}
    </div>
  );
}

export function FocusMode({ leads, totalLeads }: FocusModeProps) {
  const highIntent = leads.filter((l) => l.intentScore === "high" && l.status === "complete");
  const warmLeads = leads.filter((l) => l.intentScore === "medium" && l.status === "complete");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-2xl"
    >
      {/* High intent section */}
      <section>
        <SectionHeader
          title="High intent leads"
          count={highIntent.length}
          href="/leads?filter=high"
        />
        {highIntent.length === 0 ? (
          <EmptySection message="No high intent leads yet. Run a search to find opportunities." />
        ) : (
          <div className="space-y-2">
            {highIntent.slice(0, 5).map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Warm opportunities */}
      <section>
        <SectionHeader
          title="Warm opportunities"
          count={warmLeads.length}
          href="/leads?filter=medium"
        />
        {warmLeads.length === 0 ? (
          <EmptySection message="No warm leads yet." />
        ) : (
          <div className="space-y-2">
            {warmLeads.slice(0, 4).map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
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
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {totalLeads === 0 && (
        <div
          className="text-center py-16"
          style={{
            border: "0.5px dashed #1E1C18",
            borderRadius: 8,
          }}
        >
          <div
            className="mx-auto mb-4 flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#C4973F10",
              border: "0.5px solid #C4973F30",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </div>
          <p
            className="mb-2"
            style={{
              fontSize: 18,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            }}
          >
            No leads yet
          </p>
          <p
            className="mb-6 max-w-xs mx-auto"
            style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}
          >
            Run your first search to start building your intelligence pipeline
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 rounded transition-opacity hover:opacity-90"
            style={{
              background: "#C4973F",
              color: "#0A0907",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "var(--font-inter)",
              textDecoration: "none",
              borderRadius: 6,
            }}
          >
            Start searching
          </Link>
        </div>
      )}
    </motion.div>
  );
}

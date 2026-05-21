"use client";

import Link from "next/link";
import { useMode } from "@/components/layout/DashboardProvider";
import { KPICard } from "./KPICard";
import { FocusMode } from "./FocusMode";
import { IntelMode } from "./IntelMode";
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

interface ActivityItem {
  type: string;
  message: string;
  timestamp: string;
  leadId: string | null;
  isHot: boolean;
}

interface Stats {
  totalLeads: number;
  highIntentLeads: number;
  cardsSent: number;
  replyRate: number;
}

interface DashboardContentProps {
  leads: Lead[];
  totalLeads: number;
  totalCards: number;
  stats: Stats;
  recentActivity: ActivityItem[];
}

const ACTIVITY_DOT: Record<string, string> = {
  lead_ready: "#4CAF50",
  card_generated: "#C4973F",
  card_viewed: "#C4973F",
};

function timeLabel(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DashboardContent({
  leads,
  totalLeads,
  totalCards,
  stats,
  recentActivity,
}: DashboardContentProps) {
  const { mode } = useMode();

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <KPICard
          label="High intent leads"
          value={stats.highIntentLeads}
          subtext="ready to contact"
          goldTopBorder
        />
        <KPICard
          label="Total leads"
          value={stats.totalLeads}
          subtext="in pipeline"
        />
        <KPICard
          label="Cards sent"
          value={stats.cardsSent}
          subtext="prospect cards"
        />
        <KPICard
          label="Reply rate"
          value={stats.replyRate}
          delta="—"
          subtext="track in outreach"
          goldTopBorder
        />
      </div>

      {/* Mode content */}
      {mode === "focus" ? (
        <FocusMode leads={leads} totalLeads={totalLeads} />
      ) : (
        <IntelMode leads={leads} />
      )}

      {/* Activity feed — only show if there's activity */}
      {recentActivity.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <p
            style={{
              fontSize: 10,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 500,
              fontFamily: "var(--font-inter)",
              marginBottom: 12,
            }}
          >
            Recent activity
          </p>
          <div
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
            }}
          >
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < recentActivity.length - 1 ? "0.5px solid #1E1C18" : "none",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: item.isHot ? "#C4973F" : (ACTIVITY_DOT[item.type] ?? "#444"),
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: item.isHot ? "#C4973F" : "#888",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {item.message}
                  {item.isHot && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        background: "#C4973F",
                        color: "#0A0907",
                        padding: "1px 5px",
                        borderRadius: 8,
                      }}
                    >
                      HOT
                    </span>
                  )}
                </p>
                <span style={{ fontSize: 11, color: "#333230", fontFamily: "var(--font-inter)", flexShrink: 0 }}>
                  {timeLabel(item.timestamp)}
                </span>
                {item.leadId && (
                  <Link
                    href={`/leads/${item.leadId}`}
                    style={{ fontSize: 11, color: "#C4973F", textDecoration: "none", flexShrink: 0 }}
                  >
                    →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

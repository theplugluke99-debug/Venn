"use client";

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

interface DashboardContentProps {
  leads: Lead[];
  totalLeads: number;
  totalCards: number;
}

export function DashboardContent({ leads, totalLeads, totalCards }: DashboardContentProps) {
  const { mode } = useMode();

  const completedLeads = leads.filter((l) => l.status === "complete");
  const highIntentCount = completedLeads.filter((l) => l.intentScore === "high").length;

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <KPICard
          label="High intent leads"
          value={highIntentCount}
          subtext="ready to contact"
          goldTopBorder
        />
        <KPICard
          label="Total leads"
          value={totalLeads}
          subtext="in pipeline"
        />
        <KPICard
          label="Cards sent"
          value={totalCards}
          subtext="prospect cards"
        />
        <KPICard
          label="Reply rate"
          value={0}
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
    </div>
  );
}

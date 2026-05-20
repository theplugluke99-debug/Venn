"use client";

import Link from "next/link";
import { IntentBadge } from "./IntentBadge";
import { Badge } from "@/components/ui/Badge";
import type { IntentScore, LeadStatus } from "@/types";

interface LeadCardProps {
  id: string;
  businessName: string;
  niche: string;
  location: string;
  intentScore: IntentScore;
  status: LeadStatus;
  googleRating: number | null;
  reviewCount: number | null;
  openingLine: string | null;
  cardSlug: string | null;
  createdAt: Date | string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  pending: { label: "Queued", className: "text-[#555]" },
  scraping: { label: "Scraping", className: "text-[#C4973F]" },
  enriching: { label: "Enriching", className: "text-[#C4973F]" },
  complete: { label: "Complete", className: "text-emerald-400" },
  failed: { label: "Failed", className: "text-red-400" },
};

export function LeadCard({
  id,
  businessName,
  niche,
  location,
  intentScore,
  status,
  googleRating,
  reviewCount,
  openingLine,
  cardSlug,
  createdAt,
}: LeadCardProps) {
  const statusInfo = statusConfig[status] ?? statusConfig.pending;
  const date = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link
      href={`/leads/${id}`}
      className="block bg-[#1A1814] border border-[#2A2720] rounded-lg p-5 hover:border-[#C4973F]/40 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[#FFFDF8] font-medium text-sm truncate group-hover:text-[#C4973F] transition-colors">
              {businessName}
            </h3>
          </div>
          <p className="text-xs text-[#555]">
            {niche} · {location}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === "complete" ? (
            <IntentBadge score={intentScore} />
          ) : (
            <span className={`text-xs font-medium ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          )}
        </div>
      </div>

      {openingLine && status === "complete" ? (
        <p className="mt-3 text-xs text-[#888] line-clamp-2 leading-relaxed">
          "{openingLine}"
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {googleRating != null ? (
            <span className="text-xs text-[#555]">
              ★{" "}
              <span className="text-[#888]">
                {googleRating.toFixed(1)} ({reviewCount ?? 0})
              </span>
            </span>
          ) : null}
          {cardSlug ? (
            <Badge variant="outline" size="sm">
              Card ready
            </Badge>
          ) : null}
        </div>
        <span className="text-xs text-[#444]">{date}</span>
      </div>
    </Link>
  );
}

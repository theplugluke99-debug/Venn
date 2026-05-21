"use client";

import Link from "next/link";
import type { IntentScore } from "@/types";

const INTENT_BORDER: Record<IntentScore, string> = {
  high: "#4CAF50",
  medium: "#C4973F",
  low: "#5b7db1",
};

const INTENT_CHIP: Record<IntentScore, { bg: string; color: string; label: string }> = {
  high: { bg: "#0d2b0d", color: "#4CAF50", label: "High" },
  medium: { bg: "#2b1e05", color: "#C4973F", label: "Medium" },
  low: { bg: "#0d1524", color: "#5b7db1", label: "Low" },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? "full" : i === full && half ? "half" : "empty"
  );
  return (
    <span>
      {stars.map((s, i) => (
        <span key={i} style={{ color: s === "empty" ? "#333230" : "#C4973F", fontSize: 11 }}>
          ★
        </span>
      ))}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : name.slice(0, 2);

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "#C4973F15",
        border: "0.5px solid #C4973F40",
        fontSize: 13,
        fontWeight: 500,
        color: "#C4973F",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        textTransform: "uppercase",
      }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

interface LeadCardProps {
  id: string;
  businessName: string;
  niche: string;
  location: string;
  intentScore: IntentScore;
  status: string;
  googleRating: number | null;
  reviewCount: number | null;
  openingLine: string | null;
  cardSlug: string | null;
  createdAt: Date | string;
  compact?: boolean;
}

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
  compact = false,
}: LeadCardProps) {
  const chip = INTENT_CHIP[intentScore] ?? INTENT_CHIP.low;
  const borderColor = INTENT_BORDER[intentScore] ?? INTENT_BORDER.low;
  const isComplete = status === "complete";

  if (compact) {
    return (
      <Link href={`/leads/${id}`} className="block group">
        <div
          className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#0F0E0B]"
          style={{ borderLeft: `3px solid ${borderColor}` }}
        >
          <Initials name={businessName} />
          <div className="flex-1 min-w-0">
            <p
              className="truncate group-hover:text-[#C4973F] transition-colors"
              style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}
            >
              {businessName}
            </p>
            <p
              className="truncate"
              style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}
            >
              {location} · {niche}
            </p>
          </div>
          {openingLine && (
            <p
              className="hidden md:block truncate max-w-[200px]"
              style={{ fontSize: 11, color: "#666", fontStyle: "italic", fontFamily: "var(--font-inter)" }}
            >
              {openingLine}
            </p>
          )}
          <div className="shrink-0 flex items-center gap-2">
            {isComplete && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  background: chip.bg,
                  color: chip.color,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {chip.label}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="group"
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: `2px solid ${borderColor}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Link href={`/leads/${id}`} className="block p-4">
        <div className="flex items-start gap-3">
          <Initials name={businessName} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="truncate group-hover:text-[#C4973F] transition-colors"
                  style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}
                >
                  {businessName}
                </p>
                <div
                  className="flex items-center gap-1.5 mt-0.5 flex-wrap"
                  style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}
                >
                  <span>{location}</span>
                  <span style={{ color: "#333230" }}>·</span>
                  <span>{niche}</span>
                  {googleRating != null && (
                    <>
                      <span style={{ color: "#333230" }}>·</span>
                      <StarRating rating={googleRating} />
                      <span style={{ color: "#555250" }}>{googleRating.toFixed(1)}</span>
                      {reviewCount != null && (
                        <span style={{ color: "#333230" }}>({reviewCount})</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isComplete && (
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    background: chip.bg,
                    color: chip.color,
                    fontFamily: "var(--font-inter)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip.label}
                </span>
              )}

              {!isComplete && (
                <span
                  style={{
                    fontSize: 11,
                    color: status === "failed" ? "#ef4444" : "#C4973F",
                    fontFamily: "var(--font-inter)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status === "failed" ? "Failed" : "Processing…"}
                </span>
              )}
            </div>

            {openingLine && isComplete && (
              <p
                className="mt-2 line-clamp-2"
                style={{
                  fontSize: 11,
                  color: "#666",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {openingLine}
              </p>
            )}
          </div>
        </div>
      </Link>

      {isComplete && (
        <div
          className="flex items-center justify-end gap-2 px-4 pb-3"
        >
          {cardSlug ? (
            <Link
              href={`/card/${cardSlug}`}
              target="_blank"
              className="px-3 py-1.5 rounded transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 500,
                background: "#C4973F",
                color: "#0A0907",
                fontFamily: "var(--font-inter)",
                textDecoration: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              View card
            </Link>
          ) : (
            <Link
              href={`/leads/${id}`}
              className="px-3 py-1.5 rounded transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 500,
                background: "#C4973F",
                color: "#0A0907",
                fontFamily: "var(--font-inter)",
                textDecoration: "none",
              }}
            >
              Send card
            </Link>
          )}
          <Link
            href={`/leads/${id}`}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              fontSize: 12,
              background: "#1A1814",
              border: "0.5px solid #1E1C18",
              color: "#555250",
              fontFamily: "var(--font-inter)",
              textDecoration: "none",
            }}
          >
            View profile
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { AgencyIntelligence, BriefingItem } from "@/lib/agency/intelligence";

interface AgencyBriefingProps {
  intelligence: AgencyIntelligence;
  firstName: string;
}

function todayKey() {
  const d = new Date();
  return `venn_briefing_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function weekKey() {
  const d = new Date();
  // Use Monday's date as the week key
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return `venn_weekly_${monday.getFullYear()}_${monday.getMonth()}_${monday.getDate()}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function generateBriefingText(intel: AgencyIntelligence): string {
  const issueCount =
    (intel.unhealthyCount > 0 ? 1 : 0) +
    (intel.overdueCount > 0 ? 1 : 0) +
    (intel.proposalsHot2hCount > 0 ? 1 : 0) +
    (intel.checkInsOverdue14dCount > 0 ? 1 : 0) +
    (intel.unansweredQuestionsCount > 0 ? 1 : 0);

  if (issueCount === 0) {
    let text = `Everything looks healthy today. ${intel.activeClientCount} active client${intel.activeClientCount === 1 ? "" : "s"}, all on track.`;
    if (intel.nextDeliverable) {
      const d = new Date(intel.nextDeliverable.dueDate);
      const dayName = d.toLocaleDateString("en-GB", { weekday: "long" });
      text += ` Your next deliverable is due ${dayName} for ${intel.nextDeliverable.clientName}.`;
    }
    return text;
  }

  const parts: string[] = [];
  if (intel.checkInsOverdue14dCount > 0) {
    const first = intel.briefingItems.find((b) => b.type === "checkin");
    if (first?.clientName) parts.push(`${first.clientName} hasn't had a check-in in a while.`);
  }
  if (intel.overdueCount > 0) {
    parts.push(
      `You have ${intel.overdueCount} overdue deliverable${intel.overdueCount === 1 ? "" : "s"}.`
    );
  }
  if (intel.proposalsHot2hCount > 0) {
    const hot = intel.briefingItems.find((b) => b.type === "hot_proposal");
    if (hot?.clientName) parts.push(`${hot.clientName}'s proposal is hot — viewed it recently.`);
  }
  if (intel.unansweredQuestionsCount > 0) {
    parts.push(
      `${intel.unansweredQuestionsCount} proposal question${intel.unansweredQuestionsCount === 1 ? "" : "s"} waiting for an answer.`
    );
  }
  if (intel.unhealthyCount > 0 && parts.length < 3) {
    parts.push(`${intel.unhealthyCount} client${intel.unhealthyCount === 1 ? "" : "s"} need${intel.unhealthyCount === 1 ? "s" : ""} attention.`);
  }

  const word = issueCount === 1 ? "One thing" : `${issueCount} things`;
  return `${word} need${issueCount === 1 ? "s" : ""} your attention today. ${parts.join(" ")}`;
}

function BriefingItemCard({ item }: { item: BriefingItem }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 0",
        borderBottom: "0.5px solid #1E1C18",
      }}
    >
      <div>
        {item.clientName && (
          <p style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", marginBottom: 2, fontWeight: 500 }}>
            {item.clientName}
          </p>
        )}
        <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.4 }}>
          {item.description}
        </p>
      </div>
      <Link
        href={item.actionHref}
        style={{
          flexShrink: 0,
          fontSize: 11,
          color: "#0A0907",
          background: "#C4973F",
          padding: "5px 12px",
          borderRadius: 4,
          textDecoration: "none",
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {item.actionLabel}
      </Link>
    </div>
  );
}

function DailyBriefing({
  intelligence,
  firstName,
  onDismiss,
}: {
  intelligence: AgencyIntelligence;
  firstName: string;
  onDismiss: () => void;
}) {
  const briefingText = generateBriefingText(intelligence);
  const hasItems = intelligence.briefingItems.length > 0;

  return (
    <div
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #C4973F",
        borderRadius: 8,
        padding: 24,
        marginBottom: 32,
      }}
    >
      {/* Header */}
      <p
        style={{
          fontSize: 24,
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          color: "#FFFDF8",
          fontWeight: 400,
          marginBottom: 4,
        }}
      >
        Good morning {firstName}.
      </p>
      <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", marginBottom: 20 }}>
        {formatDate()}
      </p>

      {/* Briefing text */}
      <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.7, marginBottom: hasItems ? 20 : 0 }}>
        {briefingText}
      </p>

      {/* Action items */}
      {hasItems && (
        <div>
          {intelligence.briefingItems.map((item, i) => (
            <BriefingItemCard key={i} item={item} />
          ))}
        </div>
      )}

      {/* Dismiss */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button
          onClick={onDismiss}
          style={{
            fontSize: 12,
            color: "#555250",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
            padding: 0,
          }}
        >
          Got it →
        </button>
      </div>
    </div>
  );
}

function WeeklySummary({
  summary,
  firstName,
  onDismiss,
}: {
  summary: NonNullable<AgencyIntelligence["weeklySummary"]>;
  firstName: string;
  onDismiss: () => void;
}) {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 86400000);
  const weekRange = `${now.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

  return (
    <div
      style={{
        background: "#0F0E0B",
        border: "0.5px solid #C4973F",
        borderRadius: 8,
        padding: 24,
        marginBottom: 32,
      }}
    >
      <p
        style={{
          fontSize: 24,
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          color: "#FFFDF8",
          fontWeight: 400,
          marginBottom: 4,
        }}
      >
        Good morning {firstName}.
      </p>
      <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", marginBottom: 24 }}>
        Last week in review.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Last week */}
        <div>
          <p style={{ fontSize: 10, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Last week
          </p>
          {[
            { label: "Deliverables completed", value: summary.deliverablesCompleted },
            { label: "Check-ins logged", value: summary.checkIns },
            { label: "Proposals sent", value: summary.proposalsSent },
            {
              label: "Revenue active",
              value: summary.revenueActive > 0 ? `£${summary.revenueActive.toLocaleString()}` : "—",
            },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)" }}>{label}</span>
              <span style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* This week */}
        <div>
          <p style={{ fontSize: 10, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            This week — {weekRange}
          </p>
          {[
            { label: "Deliverables due", value: summary.deliverablesDueThisWeek },
            { label: "Renewals approaching", value: summary.renewalsApproaching },
            { label: "Clients needing attention", value: summary.clientsNeedingAttention },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)" }}>{label}</span>
              <span style={{
                fontSize: 13,
                color: value > 0 ? "#C4973F" : "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended focus */}
      {summary.recommendedFocus && (
        <div
          style={{
            background: "#1A1814",
            borderRadius: 6,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Recommended focus
          </p>
          <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
            This week focus on{" "}
            <Link
              href={`/clients/${summary.recommendedFocus.clientId}`}
              style={{ color: "#C4973F", textDecoration: "none" }}
            >
              {summary.recommendedFocus.clientName}
            </Link>
            . {summary.recommendedFocus.reason}
          </p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onDismiss}
          style={{
            fontSize: 12,
            color: "#555250",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
            padding: 0,
          }}
        >
          Got it →
        </button>
      </div>
    </div>
  );
}

export function AgencyBriefing({ intelligence, firstName }: AgencyBriefingProps) {
  const [visible, setVisible] = useState<"daily" | "weekly" | null>(null);

  useEffect(() => {
    if (!intelligence.hasClients) return;

    const isMonday = new Date().getDay() === 1;
    const wKey = weekKey();
    const dKey = todayKey();

    try {
      // Monday: show weekly summary first (unless dismissed this week)
      if (isMonday && intelligence.weeklySummary && !localStorage.getItem(wKey)) {
        setVisible("weekly");
        return;
      }
      // Daily briefing (unless dismissed today)
      if (!localStorage.getItem(dKey)) {
        setVisible("daily");
      }
    } catch {
      // ignore
    }
  }, [intelligence]);

  if (!visible || !intelligence.hasClients) return null;

  function dismiss() {
    try {
      if (visible === "weekly") {
        localStorage.setItem(weekKey(), "1");
        // Also check if daily briefing needs showing after
        const dKey = todayKey();
        if (!localStorage.getItem(dKey)) {
          setVisible("daily");
          return;
        }
      } else {
        localStorage.setItem(todayKey(), "1");
      }
    } catch {
      // ignore
    }
    setVisible(null);
  }

  if (visible === "weekly" && intelligence.weeklySummary) {
    return (
      <WeeklySummary
        summary={intelligence.weeklySummary}
        firstName={firstName}
        onDismiss={dismiss}
      />
    );
  }

  return (
    <DailyBriefing
      intelligence={intelligence}
      firstName={firstName}
      onDismiss={dismiss}
    />
  );
}

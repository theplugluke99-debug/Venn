"use client";

import Link from "next/link";
import type { AgencyIntelligence } from "@/lib/agency/intelligence";

interface AgencyTodayModeProps {
  intelligence: AgencyIntelligence;
}

function SectionHeader({
  label,
  colour,
}: {
  label: string;
  colour: string;
}) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: colour,
        fontFamily: "var(--font-inter)",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </p>
  );
}

function CompactRow({
  badge,
  badgeColour,
  title,
  subtitle,
  actionLabel,
  actionHref,
  isHot,
}: {
  badge?: string;
  badgeColour?: string;
  title: string;
  subtitle?: string;
  actionLabel: string;
  actionHref: string;
  isHot?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: "#0F0E0B",
        borderRadius: 6,
        marginBottom: 4,
        border: "0.5px solid #1E1C18",
      }}
    >
      {badge && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: isHot ? "#0A0907" : badgeColour ?? "#888580",
            background: isHot ? "#C4973F" : `${badgeColour ?? "#888580"}18`,
            border: `0.5px solid ${badgeColour ?? "#888580"}40`,
            padding: "2px 6px",
            borderRadius: 3,
            fontFamily: "var(--font-inter)",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            color: "#FFFDF8",
            fontFamily: "var(--font-inter)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>
      <Link
        href={actionHref}
        style={{
          fontSize: 11,
          color: "#C4973F",
          fontFamily: "var(--font-inter)",
          textDecoration: "none",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function DeliverableRow({
  id,
  clientId,
  clientName,
  title,
}: {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: "#0F0E0B",
        borderRadius: 6,
        marginBottom: 4,
        border: "0.5px solid #1E1C18",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          border: "1px solid #333230",
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            color: "#FFFDF8",
            fontFamily: "var(--font-inter)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 1 }}>
          {clientName}
        </p>
      </div>
      <Link
        href={`/clients/${clientId}`}
        style={{
          fontSize: 11,
          color: "#C4973F",
          fontFamily: "var(--font-inter)",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        View →
      </Link>
    </div>
  );
}

function UpcomingRow({
  type,
  clientName,
  title,
  date,
  clientId,
}: {
  type: string;
  clientName?: string;
  title: string;
  date: string;
  clientId?: string;
}) {
  const d = new Date(date);
  const dayLabel = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: "#0F0E0B",
        borderRadius: 6,
        marginBottom: 4,
        border: "0.5px solid #1E1C18",
      }}
    >
      <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", flexShrink: 0, minWidth: 60 }}>
        {dayLabel}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            color: "#FFFDF8",
            fontFamily: "var(--font-inter)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        {clientName && (
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 1 }}>
            {clientName}
          </p>
        )}
      </div>
      {clientId && (
        <Link
          href={`/clients/${clientId}`}
          style={{
            fontSize: 11,
            color: "#444440",
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          →
        </Link>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function AgencyTodayMode({ intelligence }: AgencyTodayModeProps) {
  const {
    hotProposals,
    urgentClients,
    dueToday,
    needsAttention,
    upcoming,
  } = intelligence;

  const hasAnything =
    hotProposals.length > 0 ||
    urgentClients.length > 0 ||
    dueToday.length > 0 ||
    needsAttention.length > 0 ||
    upcoming.length > 0;

  if (!hasAnything) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "#333230",
          fontFamily: "var(--font-inter)",
          fontSize: 13,
        }}
      >
        <p style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", fontSize: 18, color: "#555250", marginBottom: 8, fontWeight: 400 }}>
          Nothing urgent today.
        </p>
        <p>All clients are healthy and deliverables are on track.</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/clients" style={{ fontSize: 12, color: "#C4973F", textDecoration: "none" }}>
            View all clients →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* HOT PROSPECTS */}
      {hotProposals.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Hot prospects" colour="#C4973F" />
          {hotProposals.map((p) => (
            <CompactRow
              key={p.proposalId}
              badge="HOT"
              badgeColour="#C4973F"
              isHot={true}
              title={p.leadName}
              subtitle={`Viewed ${p.viewCount} time${p.viewCount === 1 ? "" : "s"} · ${timeAgo(p.lastViewedAt)}`}
              actionLabel="View proposal →"
              actionHref={`/proposals/${p.proposalId}`}
            />
          ))}
        </div>
      )}

      {/* URGENT */}
      {urgentClients.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Urgent" colour="#C0392B" />
          {urgentClients.map((c) => (
            <CompactRow
              key={c.id}
              badge={`${c.healthScore}`}
              badgeColour="#C0392B"
              title={c.name}
              subtitle={c.reason}
              actionLabel="View client →"
              actionHref={`/clients/${c.id}`}
            />
          ))}
        </div>
      )}

      {/* DUE TODAY */}
      {dueToday.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Due today" colour="#888580" />
          {dueToday.map((d) => (
            <DeliverableRow
              key={d.id}
              id={d.id}
              clientId={d.clientId}
              clientName={d.clientName}
              title={d.title}
            />
          ))}
        </div>
      )}

      {/* NEEDS ATTENTION */}
      {needsAttention.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Needs attention" colour="#888580" />
          {needsAttention.map((item, i) => (
            <CompactRow
              key={i}
              badge={
                item.type === "health"
                  ? "HEALTH"
                  : item.type === "overdue"
                  ? "OVERDUE"
                  : item.type === "checkin"
                  ? "CHECK-IN"
                  : "QUESTION"
              }
              badgeColour="#888580"
              title={item.clientName ?? ""}
              subtitle={item.title}
              actionLabel="→"
              actionHref={item.href}
            />
          ))}
        </div>
      )}

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Upcoming" colour="#333230" />
          {upcoming.map((item, i) => (
            <UpcomingRow
              key={i}
              type={item.type}
              clientName={item.clientName}
              title={item.title}
              date={item.date}
              clientId={item.clientId}
            />
          ))}
        </div>
      )}

      {/* Footer links */}
      <div style={{ display: "flex", gap: 16, paddingTop: 8 }}>
        <Link href="/clients" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
          All clients →
        </Link>
        <Link href="/deliverables" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
          All deliverables →
        </Link>
        <Link href="/proposals" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
          All proposals →
        </Link>
      </div>
    </div>
  );
}

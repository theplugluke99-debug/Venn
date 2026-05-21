"use client";

import Link from "next/link";

interface IntentCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface ActivityItem {
  type: "reply" | "card_sent" | "card_viewed" | "lead_added";
  text: string;
  timestamp: string;
}

interface RightPanelProps {
  counts: IntentCounts;
  activity: ActivityItem[];
}

function pct(n: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((n / total) * 100);
}

const DOT_COLORS: Record<ActivityItem["type"], string> = {
  reply: "#4CAF50",
  card_sent: "#C4973F",
  card_viewed: "#C4973F",
  lead_added: "#555250",
};

export function RightPanel({ counts, activity }: RightPanelProps) {
  const total = counts.total;

  return (
    <aside
      className="shrink-0 flex flex-col overflow-y-auto"
      style={{
        width: 280,
        borderLeft: "0.5px solid #1E1C18",
        background: "#0F0E0B",
      }}
    >
      {/* Pipeline health */}
      <div className="p-4">
        <p
          className="uppercase tracking-[0.1em] mb-4"
          style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", fontWeight: 500 }}
        >
          Pipeline health
        </p>

        <div className="space-y-3">
          {(
            [
              { label: "High intent", count: counts.high, color: "#4CAF50" },
              { label: "Medium intent", count: counts.medium, color: "#C4973F" },
              { label: "Low intent", count: counts.low, color: "#5b7db1" },
            ] as const
          ).map(({ label, count, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  style={{
                    fontSize: 11,
                    color: "#555250",
                    fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                  }}
                >
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                    {count}
                  </span>
                  <span style={{ fontSize: 10, color: "#333230", fontFamily: "var(--font-inter)" }}>
                    {pct(count, total)}%
                  </span>
                </div>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 3, background: "#1E1C18" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct(count, total)}%`,
                    background: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "#1E1C18" }} />

      {/* Activity feed */}
      <div className="p-4 flex-1">
        <p
          className="uppercase tracking-[0.1em] mb-3"
          style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", fontWeight: 500 }}
        >
          Activity
        </p>

        {activity.length === 0 ? (
          <p style={{ fontSize: 11, color: "#333230", fontFamily: "var(--font-inter)" }}>
            No recent activity.
          </p>
        ) : (
          <div className="space-y-3">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="shrink-0 rounded-full mt-1"
                  style={{ width: 6, height: 6, background: DOT_COLORS[item.type] }}
                />
                <div className="min-w-0">
                  <p
                    className="leading-snug"
                    style={{ fontSize: 11, color: "#666", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
                  >
                    {item.text}
                  </p>
                  <p
                    style={{ fontSize: 10, color: "#333230", fontFamily: "var(--font-inter)", marginTop: 2 }}
                  >
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "#1E1C18" }} />

      {/* CTA */}
      <div className="p-4">
        <Link
          href="/search"
          className="block w-full text-center transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            borderRadius: 6,
            padding: "10px 0",
            textDecoration: "none",
          }}
        >
          Find more leads →
        </Link>
      </div>
    </aside>
  );
}

"use client";

interface JourneyEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

interface Stats {
  totalSearches: number;
  totalLeads: number;
  totalCards: number;
  totalViews: number;
  memberSince: string;
  memberDays: number;
}

const MILESTONE_TYPES = new Set([
  "search_milestone_10", "search_milestone_25",
  "leads_milestone_50", "leads_milestone_100",
  "cards_milestone_10", "cards_milestone_50",
  "member_month_1", "member_month_3", "member_month_6", "member_month_12",
  "first_deal_closed",
]);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function JourneyClient({ events, stats }: { events: JourneyEvent[]; stats: Stats }) {
  const isMilestone = (type: string) => MILESTONE_TYPES.has(type);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0907",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        padding: "40px 40px 80px",
        maxWidth: 720,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 24,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            marginBottom: 6,
          }}
        >
          Your Venn story
        </h1>
        <p style={{ fontSize: 13, color: "#555250" }}>
          Member since {formatDate(stats.memberSince)} · {stats.memberDays} day{stats.memberDays !== 1 ? "s" : ""} building
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 40,
        }}
      >
        {[
          { label: "Searches run", value: stats.totalSearches },
          { label: "Leads found", value: stats.totalLeads },
          { label: "Cards sent", value: stats.totalCards },
          { label: "Days as member", value: stats.memberDays },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <p style={{ fontSize: 22, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontWeight: 400, lineHeight: 1, marginBottom: 4 }}>
              {value.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: "#555250" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 28, marginBottom: 16, color: "#C4973F" }}>◎</div>
          <h3
            style={{
              fontSize: 18,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontWeight: 400,
              marginBottom: 8,
            }}
          >
            Your story starts with your first search.
          </h3>
          <a
            href="/search"
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "10px 20px",
              borderRadius: 8,
              background: "#C4973F",
              color: "#0A0907",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Find your first leads →
          </a>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 8,
              bottom: 0,
              width: 1,
              background: "#1E1C18",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {events.map((event) => {
              const milestone = isMilestone(event.type);
              return (
                <div key={event.id} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* Dot */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: milestone ? "#C4973F" : "#2A5C3A",
                      border: milestone ? "2px solid #C4973F30" : "2px solid #1C3D27",
                      marginTop: 3,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, color: "#FFFDF8", fontWeight: 500 }}>
                        {event.title}
                      </span>
                      <span style={{ fontSize: 11, color: "#333230" }}>
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                    {event.description && (
                      <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6 }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

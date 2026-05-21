"use client";

import { useState } from "react";

interface Application {
  id: string;
  name: string;
  email: string;
  agency: string | null;
  teamSize: string | null;
  niche: string | null;
  monthlySpend: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
}

type LocalStatus = Record<string, "approved" | "declined" | null>;

export function AdminSolopreneurClient({ applications }: { applications: Application[] }) {
  const [localStatus, setLocalStatus] = useState<LocalStatus>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function act(applicationId: string, action: "approve" | "decline") {
    setLoading(applicationId + action);
    const endpoint = action === "approve" ? "/api/solopreneur/approve" : "/api/solopreneur/decline";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });
    if (res.ok) {
      setLocalStatus((s) => ({ ...s, [applicationId]: action === "approve" ? "approved" : "declined" }));
    }
    setLoading(null);
  }

  const statusBadge = (app: Application) => {
    const local = localStatus[app.id];
    const status = local ?? app.status;
    const colours: Record<string, { bg: string; color: string }> = {
      pending: { bg: "#1E1C18", color: "#888" },
      approved: { bg: "#16271A", color: "#4ADE80" },
      declined: { bg: "#271616", color: "#E57373" },
    };
    const style = colours[status] ?? colours.pending;
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          padding: "2px 8px",
          borderRadius: 4,
          background: style.bg,
          color: style.color,
          textTransform: "uppercase",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0907",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        padding: "40px 32px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Admin
        </p>
        <h1
          style={{
            fontSize: 28,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            marginBottom: 4,
          }}
        >
          Solopreneur Applications
        </h1>
        <p style={{ fontSize: 13, color: "#555250" }}>
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {applications.length === 0 && (
          <p style={{ fontSize: 14, color: "#444", textAlign: "center", padding: "48px 0" }}>
            No applications yet.
          </p>
        )}
        {applications.map((app) => {
          const local = localStatus[app.id];
          const currentStatus = local ?? app.status;
          const isPending = currentStatus === "pending";

          return (
            <div
              key={app.id}
              style={{
                background: "#0F0E0B",
                border: "0.5px solid #1E1C18",
                borderRadius: 10,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, color: "#FFFDF8", fontWeight: 500 }}>{app.name}</span>
                    {statusBadge(app)}
                  </div>
                  <a
                    href={`mailto:${app.email}`}
                    style={{ fontSize: 12, color: "#555250", textDecoration: "none" }}
                  >
                    {app.email}
                  </a>
                </div>
                <span style={{ fontSize: 11, color: "#333230", flexShrink: 0 }}>
                  {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", marginBottom: 12 }}>
                {[
                  ["Agency", app.agency],
                  ["Team size", app.teamSize],
                  ["Niche", app.niche],
                  ["Monthly spend", app.monthlySpend],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label!}>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 13, color: "#888" }}>{value}</p>
                  </div>
                ))}
              </div>

              {app.notes && (
                <p style={{ fontSize: 13, color: "#666462", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>
                  &ldquo;{app.notes}&rdquo;
                </p>
              )}

              {isPending && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => act(app.id, "approve")}
                    disabled={!!loading}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "none",
                      background: "#C4973F",
                      color: "#0A0907",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading === app.id + "approve" ? 0.7 : 1,
                    }}
                  >
                    {loading === app.id + "approve" ? "Approving…" : "Approve"}
                  </button>
                  <button
                    onClick={() => act(app.id, "decline")}
                    disabled={!!loading}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "0.5px solid #2A2826",
                      background: "transparent",
                      color: "#666",
                      fontSize: 13,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading === app.id + "decline" ? 0.7 : 1,
                    }}
                  >
                    {loading === app.id + "decline" ? "Declining…" : "Decline"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

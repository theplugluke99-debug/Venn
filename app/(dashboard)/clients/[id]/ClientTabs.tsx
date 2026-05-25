"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getHealthColour } from "@/lib/agency/colours";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://venn.so";

interface HealthSignal { key: string; label: string; impact: number; active: boolean; }

interface ClientData {
  id: string;
  businessName: string;
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  niche?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  status: string;
  startDate: string;
  contractValue?: number | null;
  billingCycle: string;
  nextBillingDate?: string | null;
  contractEndDate?: string | null;
  healthScore: number;
  healthSignals: HealthSignal[];
  notes?: string | null;
  leadId?: string | null;
  lead?: {
    id: string;
    businessName: string;
    googleRating?: number | null;
    reviewCount?: number | null;
    observations?: Record<string, unknown>[] | null;
    instagramData?: unknown;
    openingLine?: string | null;
    businessBio?: string | null;
    niche: string;
    location: string;
  } | null;
  deliverables: Array<{
    id: string; title: string; description?: string | null; category: string;
    status: string; priority: string; dueDate?: string | null; completedAt?: string | null; notes?: string | null;
  }>;
  reports: Array<{
    id: string; slug: string; title: string; period: string; status: string;
    sentAt?: string | null; viewedAt?: string | null; viewCount: number; createdAt: string;
  }>;
  checkIns: Array<{
    id: string; type: string; notes?: string | null; sentiment?: string | null;
    nextAction?: string | null; completedAt?: string | null; createdAt: string;
  }>;
  activities: Array<{
    id: string; type: string; title: string; description?: string | null; createdAt: string;
  }>;
}

interface ClientTabsProps {
  client: ClientData;
  stats: { totalValue: number; monthsActive: number; completedDeliverables: number; reportsSent: number };
}

const TABS = ["Overview", "Deliverables", "Reports", "Check-ins", "Revenue", "Intel"] as const;
type Tab = typeof TABS[number];

const DELIVERABLE_CATEGORIES = ["Content", "Social", "SEO", "Reporting", "Strategy", "Technical", "Other"];
const CHECKIN_TYPES = ["Call", "Email", "WhatsApp", "In person"];
const SENTIMENTS = ["positive", "neutral", "concerned"];
const SENTIMENT_COLOURS: Record<string, string> = { positive: "#4CAF50", neutral: "#C4973F", concerned: "#C0392B" };

const STATUS_COLOURS: Record<string, { colour: string; bg: string }> = {
  pending:     { colour: "#555250", bg: "#1A1814" },
  in_progress: { colour: "#5b7db1", bg: "#0d1524" },
  complete:    { colour: "#4CAF50", bg: "#0d1a0d" },
  overdue:     { colour: "#C0392B", bg: "#1a0808" },
};

const PRIORITY_COLOURS: Record<string, string> = {
  low: "#555250", medium: "#C4973F", high: "#C0392B",
};

function timeAgo(date: string): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function isOverdue(dueDate: string | null | undefined, status: string): boolean {
  return status !== "complete" && !!dueDate && new Date(dueDate) < new Date();
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "8px 11px", borderRadius: 5,
  border: "0.5px solid #1E1C18", background: "#0A0907",
  color: "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)",
  outline: "none", boxSizing: "border-box",
};

export function ClientTabs({ client, stats }: ClientTabsProps) {
  const [tab, setTab] = useState<Tab>("Overview");
  const router = useRouter();

  // Deliverable quick-add form
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [dForm, setDForm] = useState({ title: "", category: "Content", dueDate: "", priority: "medium" });
  const [dSaving, setDSaving] = useState(false);

  // Check-in form
  const [showAddCheckIn, setShowAddCheckIn] = useState(false);
  const [cForm, setCForm] = useState({ type: "Call", notes: "", sentiment: "positive", nextAction: "" });
  const [cSaving, setCSaving] = useState(false);

  // Report generate form
  const [showReportForm, setShowReportForm] = useState(false);
  const [rForm, setRForm] = useState({
    period: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    metric1Key: "", metric1Value: "", metric2Key: "", metric2Value: "",
    priority1: "", priority2: "", priority3: "",
  });
  const [rSaving, setRSaving] = useState(false);
  const [rUrl, setRUrl] = useState<string | null>(null);

  const healthColour = getHealthColour(client.healthScore);

  async function addDeliverable() {
    setDSaving(true);
    await fetch("/api/deliverables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, ...dForm, dueDate: dForm.dueDate || undefined }),
    });
    setDSaving(false);
    setShowAddDeliverable(false);
    setDForm({ title: "", category: "Content", dueDate: "", priority: "medium" });
    router.refresh();
  }

  async function toggleDeliverable(delivId: string, currentStatus: string) {
    const newStatus = currentStatus === "complete" ? "pending" : "complete";
    await fetch(`/api/deliverables/${delivId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function addCheckIn() {
    setCSaving(true);
    await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, ...cForm }),
    });
    setCSaving(false);
    setShowAddCheckIn(false);
    setCForm({ type: "Call", notes: "", sentiment: "positive", nextAction: "" });
    router.refresh();
  }

  async function generateReport() {
    setRSaving(true);
    const metrics: Record<string, string> = {};
    if (rForm.metric1Key && rForm.metric1Value) metrics[rForm.metric1Key] = rForm.metric1Value;
    if (rForm.metric2Key && rForm.metric2Value) metrics[rForm.metric2Key] = rForm.metric2Value;
    const nextPriorities = [rForm.priority1, rForm.priority2, rForm.priority3].filter(Boolean);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, period: rForm.period, metrics, nextPriorities }),
    });
    const data = await res.json() as { reportUrl?: string };
    setRSaving(false);
    if (data.reportUrl) setRUrl(data.reportUrl);
    router.refresh();
  }

  const now = new Date();
  const sortedDeliverables = [...client.deliverables].sort((a, b) => {
    const aOver = isOverdue(a.dueDate, a.status) ? 0 : 1;
    const bOver = isOverdue(b.dueDate, b.status) ? 0 : 1;
    return aOver - bOver;
  });

  const lastCheckIn = client.checkIns[0];
  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((Date.now() - new Date(lastCheckIn.createdAt).getTime()) / 86400000)
    : null;

  const mrr = client.contractValue ?? 0;
  const startDate = new Date(client.startDate);
  const monthsArr: Array<{ month: string; amount: number; status: string }> = [];
  for (let i = 0; i < stats.monthsActive; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    monthsArr.push({
      month: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      amount: mrr,
      status: d < now ? "paid" : "pending",
    });
  }

  const renewalDays = client.contractEndDate
    ? Math.floor((new Date(client.contractEndDate).getTime() - now.getTime()) / 86400000)
    : null;

  return (
    <>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid #1E1C18", marginBottom: 28 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 16px", fontSize: 13, fontFamily: "var(--font-inter)",
              color: tab === t ? "#FFFDF8" : "#555250",
              borderBottom: `2px solid ${tab === t ? "#C4973F" : "transparent"}`,
              marginBottom: -1,
              fontWeight: tab === t ? 500 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === "Overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Health score */}
          <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 64, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: healthColour, lineHeight: 1 }}>
                {client.healthScore}
              </p>
              <div>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Health score
                </p>
                <p style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", marginTop: 2 }}>
                  {client.healthScore >= 80 ? "Healthy relationship" : client.healthScore >= 50 ? "Needs attention" : "At risk"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {client.healthSignals.map((signal) => (
                <div key={signal.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: signal.impact > 0 ? "#4CAF50" : "#C0392B",
                  }} />
                  <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", flex: 1 }}>
                    {signal.label}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, fontFamily: "var(--font-inter)",
                    color: signal.impact > 0 ? "#4CAF50" : "#C0392B",
                  }}>
                    {signal.impact > 0 ? `+${signal.impact}` : signal.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              { label: "Total value", value: `£${stats.totalValue.toLocaleString()}` },
              { label: "Months active", value: stats.monthsActive.toString() },
              { label: "Completed", value: stats.completedDeliverables.toString() },
              { label: "Reports sent", value: stats.reportsSent.toString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "14px 16px" }}>
                <p style={{ fontSize: 20, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", marginBottom: 4 }}>
                  {value}
                </p>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          {client.activities.length > 0 && (
            <div>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 12 }}>
                Recent activity
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {client.activities.slice(0, 10).map((a) => (
                  <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#C4973F",
                      marginTop: 5, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{a.title}</span>
                      <span style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", marginLeft: 8 }}>{timeAgo(a.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lead intel panel */}
          {client.lead && (
            <div style={{ background: "#0F0E0B", border: "0.5px solid #C4973F20", borderRadius: 8, padding: "20px 24px" }}>
              <p style={{ fontSize: 10, color: "#C4973F", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 12 }}>
                When you found them
              </p>
              {client.lead.businessBio && (
                <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 12 }}>
                  {client.lead.businessBio}
                </p>
              )}
              {client.lead.googleRating && (
                <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)" }}>
                  Google rating when found: <span style={{ color: "#C4973F" }}>{client.lead.googleRating} ★</span>
                  {client.lead.reviewCount && ` (${client.lead.reviewCount} reviews)`}
                </p>
              )}
              {client.lead.openingLine && (
                <div style={{ marginTop: 12, borderLeft: "2px solid #C4973F", paddingLeft: 12 }}>
                  <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", fontStyle: "italic", marginBottom: 4 }}>Opening line that won them</p>
                  <p style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>{client.lead.openingLine}</p>
                </div>
              )}
              <Link href={`/leads/${client.lead.id}`} style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none", display: "inline-block", marginTop: 12 }}>
                View original lead intelligence →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ─── DELIVERABLES ─── */}
      {tab === "Deliverables" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
              {client.deliverables.length} deliverable{client.deliverables.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setShowAddDeliverable(!showAddDeliverable)}
              style={{ background: "transparent", border: "0.5px solid #1E1C18", borderRadius: 5, padding: "6px 12px", fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", cursor: "pointer" }}
            >
              + Add deliverable
            </button>
          </div>

          {/* Quick add form */}
          {showAddDeliverable && (
            <div style={{ background: "#0F0E0B", border: "0.5px solid #C4973F30", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input
                  style={INPUT_STYLE} placeholder="Deliverable title"
                  value={dForm.title} onChange={(e) => setDForm((f) => ({ ...f, title: e.target.value }))}
                />
                <select style={INPUT_STYLE} value={dForm.category} onChange={(e) => setDForm((f) => ({ ...f, category: e.target.value }))}>
                  {DELIVERABLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input style={INPUT_STYLE} type="date" value={dForm.dueDate} onChange={(e) => setDForm((f) => ({ ...f, dueDate: e.target.value }))} />
                <select style={INPUT_STYLE} value={dForm.priority} onChange={(e) => setDForm((f) => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
                <button
                  onClick={addDeliverable}
                  disabled={dSaving || !dForm.title}
                  style={{
                    background: "#C4973F", color: "#0A0907", border: "none", borderRadius: 5,
                    fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
                    opacity: dSaving || !dForm.title ? 0.6 : 1,
                  }}
                >
                  {dSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sortedDeliverables.length === 0 && (
              <p style={{ fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)", paddingTop: 8 }}>
                No deliverables yet — add the first one above
              </p>
            )}
            {sortedDeliverables.map((d) => {
              const overdue = isOverdue(d.dueDate, d.status);
              const st = overdue ? STATUS_COLOURS.overdue : STATUS_COLOURS[d.status] ?? STATUS_COLOURS.pending;
              return (
                <div key={d.id} style={{
                  background: overdue ? "#1a080820" : "#0F0E0B",
                  border: `0.5px solid ${overdue ? "#C0392B30" : "#1E1C18"}`,
                  borderRadius: 6, padding: "12px 14px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <button
                    onClick={() => toggleDeliverable(d.id, d.status)}
                    style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `1.5px solid ${d.status === "complete" ? "#4CAF50" : "#333"}`,
                      background: d.status === "complete" ? "#4CAF50" : "transparent",
                      cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {d.status === "complete" && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#0A0907" strokeWidth="2">
                        <polyline points="1,5 4,8 9,2" />
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, color: d.status === "complete" ? "#444440" : "#FFFDF8",
                      fontFamily: "var(--font-inter)", textDecoration: d.status === "complete" ? "line-through" : "none",
                    }}>
                      {d.title}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#555250", fontFamily: "var(--font-inter)" }}>{d.category}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                      color: PRIORITY_COLOURS[d.priority], fontFamily: "var(--font-inter)",
                    }}>
                      {d.priority}
                    </span>
                    {d.dueDate && (
                      <span style={{ fontSize: 11, color: overdue ? "#C0392B" : "#555250", fontFamily: "var(--font-inter)" }}>
                        {overdue ? "Overdue" : ""} {new Date(d.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    <span style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 3,
                      color: st.colour, background: st.bg, fontFamily: "var(--font-inter)",
                      textTransform: "uppercase", letterSpacing: "0.04em",
                    }}>
                      {overdue ? "Overdue" : d.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── REPORTS ─── */}
      {tab === "Reports" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
              Client reports
            </p>
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              style={{ background: "#C4973F", color: "#0A0907", border: "none", borderRadius: 5, padding: "7px 14px", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer" }}
            >
              Generate report →
            </button>
          </div>

          {/* Report generation form */}
          {showReportForm && !rUrl && (
            <div style={{ background: "#0F0E0B", border: "0.5px solid #C4973F30", borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", marginBottom: 16 }}>
                Generate monthly report
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" }}>Report period</label>
                  <input style={INPUT_STYLE} value={rForm.period} onChange={(e) => setRForm((f) => ({ ...f, period: e.target.value }))} />
                </div>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Key metrics (optional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input style={INPUT_STYLE} placeholder="Metric name (e.g. Leads)" value={rForm.metric1Key} onChange={(e) => setRForm((f) => ({ ...f, metric1Key: e.target.value }))} />
                  <input style={INPUT_STYLE} placeholder="Value (e.g. 47)" value={rForm.metric1Value} onChange={(e) => setRForm((f) => ({ ...f, metric1Value: e.target.value }))} />
                  <input style={INPUT_STYLE} placeholder="Metric name" value={rForm.metric2Key} onChange={(e) => setRForm((f) => ({ ...f, metric2Key: e.target.value }))} />
                  <input style={INPUT_STYLE} placeholder="Value" value={rForm.metric2Value} onChange={(e) => setRForm((f) => ({ ...f, metric2Value: e.target.value }))} />
                </div>
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Next month priorities</p>
                {[["priority1", "Priority 1"], ["priority2", "Priority 2"], ["priority3", "Priority 3"]].map(([key, placeholder]) => (
                  <input key={key} style={INPUT_STYLE} placeholder={placeholder}
                    value={rForm[key as keyof typeof rForm]} onChange={(e) => setRForm((f) => ({ ...f, [key]: e.target.value }))} />
                ))}
                <button
                  onClick={generateReport}
                  disabled={rSaving}
                  style={{ background: "#C4973F", color: "#0A0907", border: "none", borderRadius: 5, padding: "10px", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: rSaving ? "not-allowed" : "pointer", opacity: rSaving ? 0.6 : 1 }}
                >
                  {rSaving ? "Generating with Claude..." : "Generate report"}
                </button>
              </div>
            </div>
          )}

          {/* Report URL after generation */}
          {rUrl && (
            <div style={{ background: "#0d1a0d", border: "0.5px solid #4CAF5030", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#4CAF50", fontFamily: "var(--font-inter)", marginBottom: 8 }}>Report generated</p>
              <p style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", marginBottom: 10 }}>{rUrl}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => navigator.clipboard.writeText(rUrl)} style={{ fontSize: 11, color: "#C4973F", background: "transparent", border: "0.5px solid #C4973F30", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontFamily: "var(--font-inter)" }}>
                  Copy link
                </button>
                <a href={rUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#888580", background: "transparent", border: "0.5px solid #1E1C18", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
                  Preview
                </a>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {client.reports.length === 0 && (
              <p style={{ fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)" }}>
                No reports generated yet
              </p>
            )}
            {client.reports.map((r) => (
              <div key={r.id} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 2 }}>{r.title}</p>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                    <span>{r.sentAt ? `Sent ${new Date(r.sentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "Draft"}</span>
                    <span>{r.viewCount} view{r.viewCount !== 1 ? "s" : ""}</span>
                    {r.viewedAt && <span style={{ color: "#4CAF50" }}>Viewed</span>}
                    {!r.viewedAt && r.sentAt && <span style={{ color: "#555250" }}>Not yet opened</span>}
                  </div>
                </div>
                <a
                  href={`/reports/${r.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CHECK-INS ─── */}
      {tab === "Check-ins" && (
        <div>
          {/* Days since last check-in */}
          {daysSinceCheckIn !== null && (
            <div style={{
              background: daysSinceCheckIn > 14 ? "#1a080810" : "#0F0E0B",
              border: `0.5px solid ${daysSinceCheckIn > 14 ? "#C0392B30" : "#1E1C18"}`,
              borderRadius: 8, padding: "14px 18px", marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <p style={{ fontSize: 13, fontFamily: "var(--font-inter)", color: daysSinceCheckIn > 14 ? "#C0392B" : "#888580" }}>
                {daysSinceCheckIn === 0 ? "Checked in today" : `${daysSinceCheckIn} days since last check-in`}
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
              Check-in log
            </p>
            <button
              onClick={() => setShowAddCheckIn(!showAddCheckIn)}
              style={{ background: "transparent", border: "0.5px solid #1E1C18", borderRadius: 5, padding: "6px 12px", fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", cursor: "pointer" }}
            >
              + Log check-in
            </button>
          </div>

          {showAddCheckIn && (
            <div style={{ background: "#0F0E0B", border: "0.5px solid #C4973F30", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <select style={INPUT_STYLE} value={cForm.type} onChange={(e) => setCForm((f) => ({ ...f, type: e.target.value }))}>
                  {CHECKIN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select style={INPUT_STYLE} value={cForm.sentiment} onChange={(e) => setCForm((f) => ({ ...f, sentiment: e.target.value }))}>
                  {SENTIMENTS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <textarea
                style={{ ...INPUT_STYLE, minHeight: 72, resize: "vertical", marginBottom: 10 }}
                placeholder="Notes from the check-in..."
                value={cForm.notes}
                onChange={(e) => setCForm((f) => ({ ...f, notes: e.target.value }))}
              />
              <input
                style={{ ...INPUT_STYLE, marginBottom: 10 }}
                placeholder="Next action..."
                value={cForm.nextAction}
                onChange={(e) => setCForm((f) => ({ ...f, nextAction: e.target.value }))}
              />
              <button
                onClick={addCheckIn}
                disabled={cSaving}
                style={{ background: "#C4973F", color: "#0A0907", border: "none", borderRadius: 5, padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: cSaving ? "not-allowed" : "pointer", opacity: cSaving ? 0.6 : 1 }}
              >
                {cSaving ? "Saving..." : "Log check-in"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {client.checkIns.length === 0 && (
              <p style={{ fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)" }}>No check-ins logged yet</p>
            )}
            {client.checkIns.map((c) => (
              <div key={c.id} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: c.notes ? 8 : 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>{c.type}</span>
                  {c.sentiment && (
                    <span style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase",
                      color: SENTIMENT_COLOURS[c.sentiment], fontFamily: "var(--font-inter)", letterSpacing: "0.06em",
                    }}>
                      {c.sentiment}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", marginLeft: "auto" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                {c.notes && <p style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: c.nextAction ? 6 : 0 }}>{c.notes}</p>}
                {c.nextAction && (
                  <p style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)" }}>→ {c.nextAction}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── REVENUE ─── */}
      {tab === "Revenue" && (
        <div>
          <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
            <p style={{ fontSize: 40, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#C4973F", marginBottom: 4 }}>
              £{stats.totalValue.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Total to date — £{mrr.toLocaleString()}/mo × {stats.monthsActive} months
            </p>
          </div>

          {renewalDays !== null && renewalDays <= 60 && renewalDays >= 0 && (
            <div style={{
              background: renewalDays <= 30 ? "#1a080810" : "#1a1808",
              border: `0.5px solid ${renewalDays <= 30 ? "#C0392B30" : "#C4973F30"}`,
              borderRadius: 8, padding: "14px 18px", marginBottom: 20,
            }}>
              <p style={{ fontSize: 13, color: renewalDays <= 30 ? "#C0392B" : "#C4973F", fontFamily: "var(--font-inter)" }}>
                Contract ending in {renewalDays} days — start renewal conversation
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "8px 12px", fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <span>Month</span><span>Amount</span><span>Status</span>
            </div>
            {monthsArr.slice().reverse().map((m) => (
              <div key={m.month} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6, padding: "12px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)" }}>{m.month}</span>
                <span style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", fontWeight: 500 }}>£{m.amount.toLocaleString()}</span>
                <span style={{ fontSize: 10, color: m.status === "paid" ? "#4CAF50" : "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── INTEL ─── */}
      {tab === "Intel" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {client.lead ? (
            <>
              <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 24px" }}>
                <p style={{ fontSize: 10, color: "#C4973F", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
                  Original intelligence
                </p>
                {client.lead.businessBio && (
                  <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.7, marginBottom: 16 }}>{client.lead.businessBio}</p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {client.lead.googleRating && (
                    <div>
                      <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Google rating (then)</p>
                      <p style={{ fontSize: 18, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#C4973F" }}>
                        {client.lead.googleRating} ★
                        <span style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", marginLeft: 6 }}>
                          ({client.lead.reviewCount} reviews)
                        </span>
                      </p>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Client since</p>
                    <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)" }}>
                      {new Date(client.startDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                {client.lead.observations && Array.isArray(client.lead.observations) && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Observations when found</p>
                    {(client.lead.observations as Array<{ label?: string; detail?: string }>).slice(0, 3).map((obs, i) => (
                      <div key={i} style={{ marginBottom: 6 }}>
                        {obs.label && <span style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)" }}>{obs.label}: </span>}
                        {obs.detail && <span style={{ fontSize: 11, color: "#888580", fontFamily: "var(--font-inter)" }}>{obs.detail}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`/leads/${client.lead.id}`} style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none", display: "inline-block", marginTop: 16 }}>
                  View full lead intelligence →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
                No lead connected to this client
              </p>
              <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>
                Connect a lead from the Venn prospecting side to see original intelligence data here.
              </p>
            </div>
          )}

          {/* Lumio placeholder */}
          <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
                Lumio data
              </p>
              <span style={{ fontSize: 9, color: "#555250", background: "#1A1814", border: "0.5px solid #1E1C18", padding: "1px 6px", borderRadius: 3, fontFamily: "var(--font-inter)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Coming soon
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 14 }}>
              If this client is on Lumio, their booking volume, automated responses, and review data will appear here automatically.
            </p>
            <button style={{ background: "transparent", border: "0.5px solid #1E1C18", borderRadius: 5, padding: "7px 14px", fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", cursor: "not-allowed" }}>
              Connect Lumio →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

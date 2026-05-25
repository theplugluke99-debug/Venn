import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientsByUser } from "@/lib/db/queries/clients";
import { calculateClientHealth, getHealthColour } from "@/lib/agency/health";
import { AddClientModal } from "./AddClientModal";

export const metadata = { title: "Clients — Venn" };

function healthBorderColour(score: number) {
  if (score >= 80) return "#4CAF50";
  if (score >= 50) return "#C4973F";
  return "#C0392B";
}

function daysAgo(date: Date | null): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

function deliverablesDueThisWeek(deliverables: Array<{ dueDate: Date | null; status: string }>): number {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 86400000);
  return deliverables.filter(
    (d) => d.status !== "complete" && d.dueDate && new Date(d.dueDate) <= weekEnd && new Date(d.dueDate) >= now
  ).length;
}

export default async function ClientsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const clients = await getClientsByUser(user.id);

  // Refresh health scores in parallel
  await Promise.all(clients.map((c) => calculateClientHealth(c.id).catch(() => null)));

  // Re-fetch with fresh scores
  const freshClients = await getClientsByUser(user.id);

  const activeClients = freshClients.filter((c) => c.status === "active");
  const atRisk = freshClients.filter((c) => c.healthScore < 50 && c.status === "active");
  const mrr = activeClients.reduce((sum, c) => sum + (c.contractValue ?? 0), 0);
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 86400000);
  const deliverablesDue = freshClients.reduce(
    (sum, c) =>
      sum +
      c.deliverables.filter(
        (d) => d.status !== "complete" && d.dueDate && new Date(d.dueDate) <= weekEnd && new Date(d.dueDate) >= now
      ).length,
    0
  );

  if (freshClients.length === 0) {
    return (
      <div className="max-w-2xl">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400 }}>
            Your clients
          </h1>
          <AddClientModal leads={[]} />
        </div>
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: "#C4973F10",
            border: "0.5px solid #C4973F30", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <p style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", marginBottom: 8, fontWeight: 400 }}>
            Your clients appear here once you&apos;ve won them
          </p>
          <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.6, maxWidth: 340, margin: "0 auto 28px" }}>
            The Agency OS tracks health, deliverables, reports and revenue for every client relationship
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", marginBottom: 28 }}>
            {["Health score for every client", "Deliverable tracking across all accounts", "One-click client reports", "Revenue and renewal alerts"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)" }}>
                <span style={{ color: "#C4973F", fontWeight: 600 }}>✓</span> {item}
              </div>
            ))}
          </div>
          <AddClientModal leads={[]} primary />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400 }}>
          Your clients
        </h1>
        <AddClientModal leads={[]} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Active clients", value: activeClients.length.toString(), colour: "#FFFDF8" },
          { label: "Monthly recurring", value: `£${mrr.toLocaleString()}`, colour: "#C4973F" },
          { label: "At risk", value: atRisk.length.toString(), colour: atRisk.length > 0 ? "#C0392B" : "#555250" },
          { label: "Due this week", value: deliverablesDue.toString(), colour: deliverablesDue > 0 ? "#C4973F" : "#555250" },
        ].map(({ label, value, colour }) => (
          <div key={label} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 18px" }}>
            <p style={{ fontSize: 22, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: colour, marginBottom: 4 }}>
              {value}
            </p>
            <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Client grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        {freshClients.map((client) => {
          const healthColour = getHealthColour(client.healthScore);
          const borderColour = healthBorderColour(client.healthScore);
          const lastCheckIn = client.checkIns[0];
          const daysSinceCheckIn = daysAgo(lastCheckIn ? new Date(lastCheckIn.createdAt) : null);
          const dueThisWeek = deliverablesDueThisWeek(client.deliverables);

          // Warning signals
          const warnings: string[] = [];
          const lastReport = client.reports[0];
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          if (!lastReport || (lastReport.sentAt && new Date(lastReport.sentAt) < monthStart)) {
            warnings.push("Report not sent this month");
          }
          if (daysSinceCheckIn !== null && daysSinceCheckIn > 14) {
            warnings.push(`No check-in in ${daysSinceCheckIn} days`);
          }
          if (client.contractEndDate) {
            const daysUntil = Math.floor((new Date(client.contractEndDate).getTime() - now.getTime()) / 86400000);
            if (daysUntil <= 30 && daysUntil >= 0) warnings.push(`Contract ending in ${daysUntil} days`);
          }

          return (
            <div key={client.id} style={{
              background: "#0F0E0B", borderRadius: 8,
              border: "0.5px solid #1E1C18",
              borderLeft: `4px solid ${borderColour}`,
              padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
            }}>
              {/* Client name + health */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: "#1A1814",
                    border: "0.5px solid #1E1C18", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#888580",
                    fontFamily: "var(--font-inter)", flexShrink: 0,
                  }}>
                    {client.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={client.logoUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      client.businessName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                      {client.businessName}
                    </p>
                    <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                      {[client.niche, client.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 18, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: healthColour, lineHeight: 1 }}>
                    {client.healthScore}
                  </p>
                  <p style={{ fontSize: 9, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Health
                  </p>
                </div>
              </div>

              {/* Value */}
              {client.contractValue && (
                <p style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", fontWeight: 500 }}>
                  £{client.contractValue.toLocaleString()}/mo
                </p>
              )}

              {/* Quick stats */}
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                {dueThisWeek > 0 && <span>{dueThisWeek} due this week</span>}
                {daysSinceCheckIn !== null && (
                  <span style={{ color: daysSinceCheckIn > 14 ? "#C0392B" : "#555250" }}>
                    {daysSinceCheckIn === 0 ? "Checked in today" : `${daysSinceCheckIn}d since check-in`}
                  </span>
                )}
                {client.nextBillingDate && (
                  <span>Bills {new Date(client.nextBillingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                )}
              </div>

              {/* Warning */}
              {warnings.length > 0 && (
                <div style={{
                  background: "#1a1808", border: "0.5px solid #C4973F20",
                  borderRadius: 4, padding: "6px 10px",
                  fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)",
                }}>
                  {warnings[0]}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href={`/clients/${client.id}`} style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
                  View client →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

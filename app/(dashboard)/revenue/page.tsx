import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientsByUser } from "@/lib/db/queries/clients";
import { getHealthColour } from "@/lib/agency/health";

export const metadata = { title: "Revenue — Venn" };

export default async function RevenuePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const clients = await getClientsByUser(user.id);
  const active = clients.filter((c) => c.status === "active");
  const now = new Date();

  const mrr = active.reduce((sum, c) => sum + (c.contractValue ?? 0), 0);
  const atRiskMrr = active
    .filter((c) => c.healthScore < 50)
    .reduce((sum, c) => sum + (c.contractValue ?? 0), 0);

  // This month new clients (started this calendar month)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = active
    .filter((c) => new Date(c.startDate) >= monthStart)
    .reduce((sum, c) => sum + (c.contractValue ?? 0), 0);

  // Renewals in 30/60/90 days
  const renewals30 = active.filter((c) => {
    if (!c.contractEndDate) return false;
    const d = Math.floor((new Date(c.contractEndDate).getTime() - now.getTime()) / 86400000);
    return d >= 0 && d <= 30;
  });
  const renewals60 = active.filter((c) => {
    if (!c.contractEndDate) return false;
    const d = Math.floor((new Date(c.contractEndDate).getTime() - now.getTime()) / 86400000);
    return d > 30 && d <= 60;
  });

  if (clients.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400, marginBottom: 24 }}>
          Revenue
        </h1>
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 16, color: "#555250", fontFamily: "var(--font-inter)" }}>
            Add clients to start tracking revenue
          </p>
          <Link href="/clients" style={{ display: "inline-block", marginTop: 16, fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
            Go to clients →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400, marginBottom: 28 }}>
        Revenue
      </h1>

      {/* MRR hero */}
      <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "24px 28px", marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          Monthly recurring revenue
        </p>
        <p style={{ fontSize: 52, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#C4973F", lineHeight: 1 }}>
          £{mrr.toLocaleString()}
        </p>
        <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 8 }}>
          {active.length} active client{active.length !== 1 ? "s" : ""}
          {newThisMonth > 0 && <span style={{ color: "#4CAF50", marginLeft: 12 }}>↑ +£{newThisMonth.toLocaleString()} added this month</span>}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 18px" }}>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            At-risk MRR
          </p>
          <p style={{ fontSize: 24, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: atRiskMrr > 0 ? "#C0392B" : "#555250" }}>
            £{atRiskMrr.toLocaleString()}
          </p>
          {atRiskMrr > 0 && (
            <p style={{ fontSize: 11, color: "#C0392B", fontFamily: "var(--font-inter)", marginTop: 4 }}>
              Health score below 50
            </p>
          )}
        </div>
        <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 18px" }}>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            If at-risk clients leave
          </p>
          <p style={{ fontSize: 24, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: atRiskMrr > 0 ? "#C0392B" : "#555250" }}>
            £{(mrr - atRiskMrr).toLocaleString()}
          </p>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 4 }}>
            Projected MRR without them
          </p>
        </div>
      </div>

      {/* Renewal alerts */}
      {renewals30.length > 0 && (
        <div style={{ background: "#1a0808", border: "0.5px solid #C0392B30", borderRadius: 8, padding: "14px 18px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#C0392B", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 8 }}>
            Contracts ending in 30 days — start renewal conversations now
          </p>
          {renewals30.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{c.businessName}</span>
              <Link href={`/clients/${c.id}`} style={{ fontSize: 11, color: "#C0392B", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
      {renewals60.length > 0 && (
        <div style={{ background: "#1a1808", border: "0.5px solid #C4973F30", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 8 }}>
            Contracts ending in 60 days
          </p>
          {renewals60.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{c.businessName}</span>
              <Link href={`/clients/${c.id}`} style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
                View →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Client revenue table */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: "8px 12px", fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
          <span>Client</span><span>Monthly</span><span>Health</span><span>Status</span>
        </div>
        {active.map((c) => {
          const healthColour = getHealthColour(c.healthScore);
          const renewalDays = c.contractEndDate
            ? Math.floor((new Date(c.contractEndDate).getTime() - now.getTime()) / 86400000)
            : null;
          return (
            <Link key={c.id} href={`/clients/${c.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6,
                padding: "12px", display: "grid", gridTemplateColumns: "1fr auto auto auto",
                gap: 12, alignItems: "center", marginBottom: 6,
              }}>
                <span style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>{c.businessName}</span>
                <span style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", fontWeight: 500 }}>
                  £{(c.contractValue ?? 0).toLocaleString()}
                </span>
                <span style={{ fontSize: 13, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: healthColour }}>
                  {c.healthScore}
                </span>
                <span style={{ fontSize: 10, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {renewalDays !== null && renewalDays <= 30 ? <span style={{ color: "#C0392B" }}>Renews in {renewalDays}d</span> : "Active"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

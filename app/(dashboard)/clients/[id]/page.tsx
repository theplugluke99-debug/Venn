import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientById } from "@/lib/db/queries/clients";
import { calculateClientHealth, getHealthColour } from "@/lib/agency/health";
import { ClientTabs } from "./ClientTabs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id).catch(() => null);
  return { title: `${client?.businessName ?? "Client"} — Venn` };
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const client = await getClientById(id);
  if (!client || client.userId !== user.id) notFound();

  const { score, signals } = await calculateClientHealth(id);

  const totalValue = (client.contractValue ?? 0) *
    Math.max(1, Math.floor((Date.now() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)));

  const monthsActive = Math.max(1, Math.floor(
    (Date.now() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
  ));

  const completedDeliverables = client.deliverables.filter((d) => d.status === "complete");
  const reportsSent = client.reports.filter((r) => r.sentAt).length;

  const healthColour = getHealthColour(score);

  // Serialise for client component
  const serialisedClient = {
    id: client.id,
    businessName: client.businessName,
    ownerName: client.ownerName,
    email: client.email,
    phone: client.phone,
    website: client.website,
    niche: client.niche,
    location: client.location,
    logoUrl: client.logoUrl,
    status: client.status,
    startDate: client.startDate.toISOString(),
    contractValue: client.contractValue,
    billingCycle: client.billingCycle,
    nextBillingDate: client.nextBillingDate?.toISOString() ?? null,
    contractEndDate: client.contractEndDate?.toISOString() ?? null,
    healthScore: score,
    healthSignals: signals,
    notes: client.notes,
    leadId: client.leadId,
    lead: client.lead ? {
      id: client.lead.id,
      businessName: client.lead.businessName,
      googleRating: client.lead.googleRating,
      reviewCount: client.lead.reviewCount,
      observations: client.lead.observations as Record<string, unknown>[] | null,
      instagramData: client.lead.instagramData,
      openingLine: client.lead.openingLine,
      businessBio: client.lead.businessBio,
      niche: client.lead.niche,
      location: client.lead.location,
    } : null,
    deliverables: client.deliverables.map((d) => ({
      id: d.id, title: d.title, description: d.description, category: d.category,
      status: d.status, priority: d.priority,
      dueDate: d.dueDate?.toISOString() ?? null,
      completedAt: d.completedAt?.toISOString() ?? null,
      notes: d.notes,
    })),
    reports: client.reports.map((r) => ({
      id: r.id, slug: r.slug, title: r.title, period: r.period,
      status: r.status, sentAt: r.sentAt?.toISOString() ?? null,
      viewedAt: r.viewedAt?.toISOString() ?? null,
      viewCount: r.viewCount,
      createdAt: r.createdAt.toISOString(),
    })),
    checkIns: client.checkIns.map((c) => ({
      id: c.id, type: c.type, notes: c.notes, sentiment: c.sentiment,
      nextAction: c.nextAction,
      completedAt: c.completedAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
    })),
    activities: client.activities.map((a) => ({
      id: a.id, type: a.type, title: a.title, description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Link href="/clients" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
          ← Clients
        </Link>
        <span style={{ color: "#1E1C18" }}>/</span>
        <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{client.businessName}</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 10, background: "#1A1814",
          border: "0.5px solid #1E1C18", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18, fontWeight: 600, color: "#888580",
          fontFamily: "var(--font-inter)", flexShrink: 0,
        }}>
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover" }} />
          ) : (
            client.businessName.slice(0, 2).toUpperCase()
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400 }}>
              {client.businessName}
            </h1>
            <span style={{
              fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              color: client.status === "active" ? "#4CAF50" : "#C4973F",
              background: client.status === "active" ? "#0d1a0d" : "#1a1808",
              border: `0.5px solid ${client.status === "active" ? "#4CAF5030" : "#C4973F30"}`,
              padding: "2px 8px", borderRadius: 3, fontFamily: "var(--font-inter)",
            }}>
              {client.status}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 20, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: healthColour }}>
                {score}
              </span>
              <span style={{ fontSize: 10, color: "#555250", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Health
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)", flexWrap: "wrap" }}>
            {client.contractValue && (
              <span style={{ color: "#C4973F", fontWeight: 500 }}>£{client.contractValue.toLocaleString()}/mo</span>
            )}
            <span>Since {new Date(client.startDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            {client.niche && <span>{client.niche}</span>}
            {client.location && <span>{client.location}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ClientTabs
        client={serialisedClient}
        stats={{ totalValue, monthsActive, completedDeliverables: completedDeliverables.length, reportsSent }}
      />
    </div>
  );
}

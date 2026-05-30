import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SolopreneurTracker } from "@/components/dashboard/SolopreneurTracker";
import { getGreeting } from "@/lib/utils/greeting";
import { checkAndLogMilestones } from "@/lib/events";
import { computeAgencyIntelligence } from "@/lib/agency/intelligence";

export const metadata = { title: "Dashboard — Venn" };

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const now = Date.now();

  const sub = await db.subscription.findUnique({ where: { userId: user.id } });
  const isSolopreneur = sub?.isSolopreneur && sub?.solopreneurApproved;

  // Log milestones (non-blocking)
  checkAndLogMilestones(user.id).catch(() => null);

  const [totalLeads, highIntentLeads, cardsSent] = await Promise.all([
    db.lead.count({ where: { userId: user.id } }),
    db.lead.count({ where: { userId: user.id, intentScore: "high", status: "complete" } }),
    db.card.count({ where: { userId: user.id } }),
  ]);

  // Solopreneur tracker data
  let solopreneurData: {
    searchCount: number;
    cardCount: number;
    sequenceStepsSent: number;
    hasSequence: boolean;
  } | null = null;

  if (isSolopreneur) {
    const [searchCount, cardCount, sequenceStepsSentCount, sequenceExists] = await Promise.all([
      db.lead.count({ where: { userId: user.id } }),
      db.card.count({ where: { userId: user.id } }),
      db.sequenceStep.count({
        where: { sequence: { userId: user.id }, status: "sent" },
      }),
      db.sequence.count({ where: { userId: user.id } }),
    ]);
    solopreneurData = {
      searchCount,
      cardCount,
      sequenceStepsSent: sequenceStepsSentCount,
      hasSequence: sequenceExists > 0,
    };
  }

  const recentLeads = await db.lead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { card: { select: { id: true, slug: true } } },
  });

  const recentCards = await db.card.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { lead: { select: { businessName: true, id: true } } },
  });

  // ── Build activity feed ────────────────────────────────────────────────────
  type ActivityItem = {
    type: string;
    message: string;
    timestamp: string;
    leadId: string | null;
    isHot: boolean;
    annotation?: string;
    _sort: number;
  };
  const activity: ActivityItem[] = [];

  for (const lead of recentLeads) {
    if (lead.status === "complete") {
      activity.push({
        type: "lead_ready",
        message: `New lead ready: ${lead.businessName}`,
        timestamp: lead.updatedAt.toISOString(),
        leadId: lead.id,
        isHot: false,
        _sort: lead.updatedAt.getTime(),
      });
    }
  }

  for (const card of recentCards) {
    const isHot = card.lastViewed ? now - card.lastViewed.getTime() < 86_400_000 : false;
    activity.push({
      type: "card_generated",
      message: `Card generated for ${card.lead?.businessName ?? "prospect"}`,
      timestamp: card.createdAt.toISOString(),
      leadId: card.lead ? card.leadId : null,
      isHot: false,
      _sort: card.createdAt.getTime(),
    });
    if (card.lastViewed && card.viewCount > 0) {
      // Add annotation if viewed multiple times today
      let annotation: string | undefined;
      if (card.viewCount > 2 && isHot) {
        annotation = `Viewed ${card.viewCount} times. This is warm — consider reaching out.`;
      }
      activity.push({
        type: "card_viewed",
        message: `Card viewed: ${card.lead?.businessName ?? "prospect"}`,
        timestamp: card.lastViewed.toISOString(),
        leadId: card.lead ? card.leadId : null,
        isHot,
        annotation,
        _sort: card.lastViewed.getTime(),
      });
    }
  }

  // Add proposal view activity with annotations
  const recentProposals = await db.proposal.findMany({
    where: {
      userId: user.id,
      lastViewedAt: { gte: new Date(now - 7 * 86_400_000) },
    },
    include: { lead: { select: { id: true, businessName: true } } },
    orderBy: { lastViewedAt: "desc" },
    take: 5,
  });

  for (const p of recentProposals) {
    if (!p.lastViewedAt) continue;
    const isHot = now - p.lastViewedAt.getTime() < 2 * 3_600_000;
    let annotation: string | undefined;
    if (p.viewCount > 2) {
      annotation = `Viewed ${p.viewCount} times. This is warm — consider reaching out.`;
    } else if (isHot) {
      annotation = "Viewed recently — this is a good time to follow up.";
    }
    activity.push({
      type: "proposal_viewed",
      message: `Proposal viewed: ${p.lead?.businessName ?? "prospect"}`,
      timestamp: p.lastViewedAt.toISOString(),
      leadId: p.lead?.id ?? null,
      isHot,
      annotation,
      _sort: p.lastViewedAt.getTime(),
    });
  }

  // Add contract approaching events
  const approachingContracts = await db.client.findMany({
    where: {
      userId: user.id,
      status: "active",
      contractEndDate: {
        gte: new Date(),
        lte: new Date(now + 30 * 86_400_000),
      },
    },
    select: { id: true, businessName: true, contractEndDate: true },
    take: 3,
  });

  for (const c of approachingContracts) {
    if (!c.contractEndDate) continue;
    const daysUntil = Math.floor((c.contractEndDate.getTime() - now) / 86_400_000);
    activity.push({
      type: "contract_approaching",
      message: `Contract renewal in ${daysUntil} days — ${c.businessName}`,
      timestamp: new Date().toISOString(),
      leadId: null,
      isHot: false,
      annotation: "Start the renewal conversation now — not in " + daysUntil + " days.",
      _sort: now - daysUntil * 60_000, // sort near-top
    });
  }

  activity.sort((a, b) => b._sort - a._sort);

  // ── Agency OS stats (for Full mode panel) ────────────────────────────────
  const agencyStats = await (async () => {
    const clientCount = await db.client.count({ where: { userId: user.id, status: "active" } });
    if (clientCount === 0) return null;
    const nowDate = new Date();
    const weekEnd = new Date(nowDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
    const [atRisk, deliverablesThisWeek, unreportedClients] = await Promise.all([
      db.client.count({ where: { userId: user.id, status: "active", healthScore: { lt: 50 } } }),
      db.deliverable.count({
        where: {
          userId: user.id,
          status: { not: "complete" },
          dueDate: { gte: nowDate, lte: weekEnd },
        },
      }),
      db.client.count({
        where: {
          userId: user.id,
          status: "active",
          reports: { none: { sentAt: { gte: monthStart } } },
        },
      }),
    ]);
    return { clientCount, atRisk, deliverablesThisWeek, unreportedClients };
  })();

  // ── Agency intelligence (for Focus/Today modes) ────────────────────────
  const agencyIntelligence = await computeAgencyIntelligence(user.id);

  const stats = { totalLeads, highIntentLeads, cardsSent, replyRate: 0 };

  const serialisedLeads = recentLeads.map((l) => ({
    id: l.id,
    businessName: l.businessName,
    niche: l.niche,
    location: l.location,
    intentScore: l.intentScore,
    status: l.status,
    googleRating: l.googleRating,
    reviewCount: l.reviewCount,
    openingLine: l.openingLine,
    card: l.card ? { slug: l.card.slug } : null,
    createdAt: l.createdAt,
  }));

  const recentActivity = activity.slice(0, 10).map(({ _sort: _s, ...rest }) => rest);

  // Greeting context
  const hotCard = recentCards.find(
    (c) => c.lastViewed && now - c.lastViewed.getTime() < 86_400_000
  );
  const memberDays = Math.floor((now - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const lastWeekStart = new Date();
  lastWeekStart.setDate(lastWeekStart.getDate() - 14);

  const [weekCards, lastWeekCards] = await Promise.all([
    db.card.count({ where: { userId: user.id, createdAt: { gte: weekStart } } }),
    db.card.count({ where: { userId: user.id, createdAt: { gte: lastWeekStart, lt: weekStart } } }),
  ]);

  // Close discovery nudges — sessions sent 48h+ ago with no completion
  const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000);
  const staleCloseSessions = await db.closeSession.findMany({
    where: {
      userId: user.id,
      status: "sent",
      createdAt: { lte: fortyEightHoursAgo },
    },
    include: { lead: { select: { id: true, businessName: true } } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const now2 = new Date();
  const greeting = getGreeting({
    name: user.name ?? user.email,
    hasHotLead: !!hotCard,
    hotLeadName: hotCard?.lead?.businessName,
    daysSinceLastLogin: 0,
    dealJustClosed: sub?.dealClosed ?? false,
    solopreneurDaysLeft: sub?.solopreneurExpiry
      ? Math.max(0, Math.ceil((sub.solopreneurExpiry.getTime() - now) / (1000 * 60 * 60 * 24)))
      : undefined,
    dayOfWeek: now2.getDay(),
    hour: now2.getHours(),
    weeklyCardCount: weekCards,
    weeklyCardCountLastWeek: lastWeekCards,
    memberDays,
  });

  // Stuck detection
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const [replyCount, lastCard] = await Promise.all([
    db.sequenceStep.count({ where: { sequence: { userId: user.id }, status: "replied" } }),
    db.card.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);
  const isStuck =
    cardsSent >= 5 &&
    replyCount === 0 &&
    !!lastCard &&
    lastCard.createdAt < sevenDaysAgo;

  // Extract first name for briefing
  const firstName = (user.name ?? user.email).split(" ")[0] ?? "there";

  return (
    <>
      {staleCloseSessions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {staleCloseSessions.map((session) => (
            <div
              key={session.id}
              style={{
                background: "#0F0E0B",
                border: "0.5px solid #C4973F30",
                borderRadius: 8,
                padding: "14px 18px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4973F", display: "inline-block", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#9C9690", fontFamily: "var(--font-inter)", lineHeight: 1.4 }}>
                  <span style={{ color: "#FFFDF8" }}>{session.lead.businessName}</span>
                  {" "}hasn&apos;t completed their discovery yet. Send a nudge?
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <Link
                  href={`/leads/${session.lead.id}#arsenal`}
                  style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Send voice note →
                </Link>
                <Link
                  href={`/leads/${session.lead.id}#arsenal`}
                  style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Send email →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSolopreneur && solopreneurData && (
        <SolopreneurTracker
          searchCount={solopreneurData.searchCount}
          cardCount={solopreneurData.cardCount}
          sequenceStepsSent={solopreneurData.sequenceStepsSent}
          hasSequence={solopreneurData.hasSequence}
          dealClosed={sub?.dealClosed ?? false}
          dealClientName={sub?.dealClientName}
          solopreneurExpiry={sub?.solopreneurExpiry ?? null}
        />
      )}

      <DashboardContent
        leads={serialisedLeads}
        totalLeads={totalLeads}
        totalCards={cardsSent}
        stats={stats}
        recentActivity={recentActivity}
        greeting={greeting}
        isStuck={isStuck}
        agencyIntelligence={agencyIntelligence}
        agencyStats={agencyStats}
        firstName={firstName}
      />
    </>
  );
}

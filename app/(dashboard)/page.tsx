import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = { title: "Dashboard — Venn" };

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const now = Date.now();

  const [totalLeads, highIntentLeads, cardsSent] = await Promise.all([
    db.lead.count({ where: { userId: user.id } }),
    db.lead.count({ where: { userId: user.id, intentScore: "high", status: "complete" } }),
    db.card.count({ where: { userId: user.id } }),
  ]);

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

  type ActivityItem = {
    type: string;
    message: string;
    timestamp: string;
    leadId: string | null;
    isHot: boolean;
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
    const hot = card.lastViewed ? now - card.lastViewed.getTime() < 86_400_000 : false;
    activity.push({
      type: "card_generated",
      message: `Card generated for ${card.lead?.businessName ?? "prospect"}`,
      timestamp: card.createdAt.toISOString(),
      leadId: card.lead ? card.leadId : null,
      isHot: false,
      _sort: card.createdAt.getTime(),
    });
    if (card.lastViewed && card.viewCount > 0) {
      activity.push({
        type: "card_viewed",
        message: `Card viewed: ${card.lead?.businessName ?? "prospect"}`,
        timestamp: card.lastViewed.toISOString(),
        leadId: card.lead ? card.leadId : null,
        isHot: hot,
        _sort: card.lastViewed.getTime(),
      });
    }
  }

  activity.sort((a, b) => b._sort - a._sort);

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

  return (
    <DashboardContent
      leads={serialisedLeads}
      totalLeads={totalLeads}
      totalCards={cardsSent}
      stats={stats}
      recentActivity={recentActivity}
    />
  );
}

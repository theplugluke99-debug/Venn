import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";

export async function GET(_request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const user = await getUserByClerkId(clerkId);
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  const [totalLeads, highIntentLeads, cardsSent, recentLeads, recentCards] =
    await Promise.all([
      db.lead.count({ where: { userId: user.id } }),
      db.lead.count({ where: { userId: user.id, intentScore: "high", status: "complete" } }),
      db.card.count({ where: { userId: user.id } }),
      db.lead.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { card: { select: { id: true, slug: true } } },
      }),
      db.card.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { lead: { select: { businessName: true, id: true } } },
      }),
    ]);

  // Build activity feed from real events
  type ActivityItem = {
    type: string;
    message: string;
    timestamp: string;
    leadId: string | null;
    isHot: boolean;
  };
  const now = Date.now();
  const activity: (ActivityItem & { sortDate: number })[] = [];

  for (const lead of recentLeads) {
    if (lead.status === "complete") {
      activity.push({
        type: "lead_ready",
        message: `New lead ready: ${lead.businessName}`,
        timestamp: lead.updatedAt.toISOString(),
        leadId: lead.id,
        isHot: false,
        sortDate: lead.updatedAt.getTime(),
      });
    }
  }

  for (const card of recentCards) {
    const hot = card.lastViewed
      ? now - card.lastViewed.getTime() < 86_400_000
      : false;

    activity.push({
      type: "card_generated",
      message: `Card generated for ${card.lead?.businessName ?? "prospect"}`,
      timestamp: card.createdAt.toISOString(),
      leadId: card.lead ? card.leadId : null,
      isHot: false,
      sortDate: card.createdAt.getTime(),
    });

    if (card.lastViewed && card.viewCount > 0) {
      activity.push({
        type: "card_viewed",
        message: `Card viewed: ${card.lead?.businessName ?? "prospect"}`,
        timestamp: card.lastViewed.toISOString(),
        leadId: card.lead ? card.leadId : null,
        isHot: hot,
        sortDate: card.lastViewed.getTime(),
      });
    }
  }

  activity.sort((a, b) => b.sortDate - a.sortDate);

  return Response.json({
    stats: {
      totalLeads,
      highIntentLeads,
      cardsSent,
      replyRate: 0,
    },
    recentLeads: recentLeads.map((l) => ({
      id: l.id,
      businessName: l.businessName,
      location: l.location,
      intentScore: l.intentScore,
      openingLine: l.openingLine,
      status: l.status,
      card: l.card ? { id: l.card.id, slug: l.card.slug } : null,
    })),
    recentActivity: activity.slice(0, 10).map(({ sortDate: _, ...rest }) => rest),
  });
}

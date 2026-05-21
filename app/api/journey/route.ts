import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { checkAndLogMilestones } from "@/lib/events";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  // Check and log any newly achieved milestones
  await checkAndLogMilestones(user.id).catch(() => null);

  const [events, totalSearches, totalLeads, totalCards, totalViews] = await Promise.all([
    db.userEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
    db.lead.count({ where: { userId: user.id } }),
    db.lead.count({ where: { userId: user.id, status: "complete" } }),
    db.card.count({ where: { userId: user.id } }),
    db.card.aggregate({ where: { userId: user.id }, _sum: { viewCount: true } }),
  ]);

  const memberSince = user.createdAt;
  const memberDays = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24));

  return Response.json({
    events,
    stats: {
      totalSearches,
      totalLeads,
      totalCards,
      totalViews: totalViews._sum.viewCount ?? 0,
      memberSince,
      memberDays,
    },
  });
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { checkAndLogMilestones } from "@/lib/events";
import { JourneyClient } from "./JourneyClient";

export const metadata = { title: "Your Journey — Venn" };

export default async function JourneyPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  await checkAndLogMilestones(user.id).catch(() => null);

  const [events, totalSearches, totalLeads, totalCards, viewsAgg] = await Promise.all([
    db.userEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
    db.lead.count({ where: { userId: user.id } }),
    db.lead.count({ where: { userId: user.id, status: "complete" } }),
    db.card.count({ where: { userId: user.id } }),
    db.card.aggregate({ where: { userId: user.id }, _sum: { viewCount: true } }),
  ]);

  const memberDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <JourneyClient
      events={events.map((e) => ({
        id: e.id,
        type: e.type,
        title: e.title,
        description: e.description,
        createdAt: e.createdAt.toISOString(),
      }))}
      stats={{
        totalSearches,
        totalLeads,
        totalCards,
        totalViews: viewsAgg._sum.viewCount ?? 0,
        memberSince: user.createdAt.toISOString(),
        memberDays,
      }}
    />
  );
}

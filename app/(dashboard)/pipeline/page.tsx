import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

export const metadata = { title: "Pipeline — Venn" };

export default async function PipelinePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const leads = await db.lead.findMany({
    where: { userId: user.id, status: "complete" },
    include: {
      card: { select: { slug: true, viewCount: true, lastViewed: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialised = leads.map((l) => ({
    id: l.id,
    businessName: l.businessName,
    location: l.location,
    niche: l.niche,
    intentScore: l.intentScore,
    recommendedChannel: l.recommendedChannel ?? "email",
    openingLine: l.openingLine,
    pipelineStage: l.pipelineStage,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    card: l.card
      ? {
          slug: l.card.slug,
          viewCount: l.card.viewCount,
          lastViewed: l.card.lastViewed?.toISOString() ?? null,
        }
      : null,
  }));

  return <PipelineBoard initialLeads={serialised} />;
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { getCardsByUser } from "@/lib/db/queries/cards";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = { title: "Dashboard — Venn" };

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [leads, totalLeads, cards] = await Promise.all([
    getLeadsByUser(user.id, { limit: 100 }),
    getLeadCountByUser(user.id),
    getCardsByUser(user.id),
  ]);

  const serialisedLeads = leads.map((l) => ({
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

  return (
    <DashboardContent
      leads={serialisedLeads}
      totalLeads={totalLeads}
      totalCards={cards.length}
    />
  );
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";
import { OutreachView } from "@/components/outreach/OutreachView";

export const metadata = { title: "Outreach — Venn" };

export default async function OutreachPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [leads, sequenceSteps] = await Promise.all([
    db.lead.findMany({
      where: { userId: user.id, status: "complete" },
      include: {
        card: { select: { slug: true, viewCount: true, lastViewed: true } },
        arsenal: { select: { id: true } },
        sequence: {
          include: { steps: { orderBy: { stepNumber: "asc" } } },
        },
      },
      orderBy: [{ intentScore: "asc" }, { createdAt: "desc" }],
    }),
    db.sequenceStep.findMany({
      where: {
        scheduledAt: { lte: new Date() },
        status: "pending",
        sequence: { userId: user.id },
      },
      include: {
        sequence: {
          include: {
            lead: { select: { id: true, businessName: true, intentScore: true, location: true } },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  // Sort leads: high → medium → low
  const INTENT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...leads].sort(
    (a, b) => (INTENT_ORDER[a.intentScore] ?? 2) - (INTENT_ORDER[b.intentScore] ?? 2)
  );

  // Stats
  const stats = {
    total: leads.length,
    high: leads.filter((l) => l.intentScore === "high").length,
    cardsSent: leads.filter((l) => l.card).length,
    hotLeads: leads.filter(
      (l) => l.card?.lastViewed && Date.now() - new Date(l.card.lastViewed).getTime() < 86_400_000
    ).length,
  };

  const serialised = sorted.map((l) => ({
    id: l.id,
    businessName: l.businessName,
    location: l.location,
    niche: l.niche,
    intentScore: l.intentScore,
    recommendedChannel: l.recommendedChannel ?? "email",
    openingLine: l.openingLine,
    phone: l.phone,
    email: l.email,
    instagramHandle: l.instagramHandle,
    card: l.card
      ? {
          slug: l.card.slug,
          viewCount: l.card.viewCount,
          lastViewed: l.card.lastViewed?.toISOString() ?? null,
        }
      : null,
    arsenalReady: !!l.arsenal,
    sequence: l.sequence
      ? {
          id: l.sequence.id,
          status: l.sequence.status,
          currentStep: l.sequence.currentStep,
          steps: l.sequence.steps.map((s) => ({
            id: s.id,
            stepNumber: s.stepNumber,
            channel: s.channel,
            subject: s.subject,
            message: s.message,
            angle: s.angle,
            status: s.status,
            scheduledAt: s.scheduledAt.toISOString(),
            sentAt: s.sentAt?.toISOString() ?? null,
          })),
        }
      : null,
  }));

  const dueToday = sequenceSteps.map((s) => ({
    id: s.id,
    stepNumber: s.stepNumber,
    channel: s.channel,
    message: s.message,
    subject: s.subject,
    status: s.status,
    scheduledAt: s.scheduledAt.toISOString(),
    lead: {
      id: s.sequence.lead.id,
      businessName: s.sequence.lead.businessName,
      intentScore: s.sequence.lead.intentScore,
      location: s.sequence.lead.location,
    },
  }));

  return (
    <OutreachView leads={serialised} stats={stats} dueToday={dueToday} />
  );
}

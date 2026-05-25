import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getProposalBySlug(slug: string) {
  return db.proposal.findUnique({
    where: { slug },
    include: {
      lead: true,
      questions: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getProposalById(id: string) {
  return db.proposal.findUnique({
    where: { id },
    include: {
      lead: true,
      questions: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getProposalsByUser(userId: string) {
  return db.proposal.findMany({
    where: { userId },
    include: {
      lead: { select: { businessName: true, niche: true, location: true, intentScore: true } },
      questions: { select: { id: true, answer: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProposal(data: {
  slug: string;
  leadId: string;
  userId: string;
  title: string;
  threadSection?: string;
  currentState?: string;
  visionSection?: string;
  planSection?: Prisma.InputJsonValue;
  beforeAfter?: Prisma.InputJsonValue;
  investmentContext?: string;
  closingSection?: string;
  depositAmount?: number;
}) {
  return db.proposal.create({ data, include: { lead: true } });
}

export async function updateProposalStatus(
  id: string,
  status: string,
  extra?: { stripeSessionId?: string; acceptedAt?: Date; paidAt?: Date }
) {
  return db.proposal.update({ where: { id }, data: { status, ...extra } });
}

export async function recordProposalView(slug: string) {
  const proposal = await db.proposal.findUnique({ where: { slug } });
  if (!proposal) return;
  await db.proposal.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
      firstViewedAt: proposal.firstViewedAt ?? new Date(),
      status: proposal.status === "draft" ? "sent" : proposal.status === "sent" ? "viewed" : proposal.status,
    },
  });
}

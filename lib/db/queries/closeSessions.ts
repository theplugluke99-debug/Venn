import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getCloseSessionBySlug(slug: string) {
  return db.closeSession.findUnique({
    where: { slug },
    include: {
      lead: true,
      discoveryAnswers: { orderBy: { questionIndex: "asc" } },
    },
  });
}

export async function getCloseSessionById(id: string) {
  return db.closeSession.findUnique({
    where: { id },
    include: {
      lead: true,
      discoveryAnswers: { orderBy: { questionIndex: "asc" } },
    },
  });
}

export async function getCloseSessionsByUser(userId: string) {
  return db.closeSession.findMany({
    where: { userId },
    include: {
      lead: { select: { businessName: true, niche: true, intentScore: true } },
      discoveryAnswers: { select: { id: true, questionIndex: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCloseSession(data: {
  slug: string;
  leadId: string;
  userId: string;
  questions: Prisma.InputJsonValue;
  sentMessage?: string;
  sentChannel?: string;
  responseTime?: string;
}) {
  return db.closeSession.create({
    data: {
      slug: data.slug,
      leadId: data.leadId,
      userId: data.userId,
      questions: data.questions,
      sentMessage: data.sentMessage,
      sentChannel: data.sentChannel,
      sentAt: new Date(),
    },
    include: { lead: true },
  });
}

export async function recordCloseSessionView(slug: string) {
  const session = await db.closeSession.findUnique({ where: { slug } });
  if (!session) return null;
  return db.closeSession.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 },
      lastViewed: new Date(),
      discoveryViewedAt: session.discoveryViewedAt ?? new Date(),
      status: session.status === "sent" ? "viewed" : session.status,
    },
  });
}

export async function upsertDiscoveryAnswer(
  closeSessionId: string,
  questionIndex: number,
  questionText: string,
  answer: string
) {
  const existing = await db.discoveryAnswer.findFirst({
    where: { closeSessionId, questionIndex },
  });

  if (existing) {
    return db.discoveryAnswer.update({
      where: { id: existing.id },
      data: { answer, answeredAt: new Date() },
    });
  }

  return db.discoveryAnswer.create({
    data: { closeSessionId, questionIndex, questionText, answer },
  });
}

export async function completeCloseSession(slug: string) {
  const session = await db.closeSession.findUnique({
    where: { slug },
    include: { discoveryAnswers: true },
  });
  if (!session) return null;

  const questions = session.questions as Array<{ text: string }>;
  const totalQ = Array.isArray(questions) ? questions.length : 0;
  const answered = session.discoveryAnswers.length;
  const completionRate = totalQ > 0 ? (answered / totalQ) * 100 : 0;

  // Build answers snapshot JSON
  const answersMap: Record<string, string> = {};
  session.discoveryAnswers.forEach((a) => {
    answersMap[a.questionIndex] = a.answer;
  });

  return db.closeSession.update({
    where: { slug },
    data: {
      discoveryCompletedAt: new Date(),
      completionRate,
      answers: answersMap,
      status: "discovery_complete",
    },
    include: { lead: true, discoveryAnswers: { orderBy: { questionIndex: "asc" } } },
  });
}

export async function linkCloseSessionToProposal(id: string, proposalId: string) {
  return db.closeSession.update({
    where: { id },
    data: { proposalId, proposalGeneratedAt: new Date(), status: "proposal_generated" },
  });
}

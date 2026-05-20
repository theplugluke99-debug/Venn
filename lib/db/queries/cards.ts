import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function createCard(data: {
  slug: string;
  leadId: string;
  userId: string;
  headline?: string;
  observations?: Prisma.InputJsonValue;
  revenueLoss?: string;
  ctaText?: string;
  ctaValue?: string;
  brandColour?: string;
  logoUrl?: string;
  agencyName?: string;
}) {
  return db.card.create({ data });
}

export async function getCardBySlug(slug: string) {
  return db.card.findUnique({
    where: { slug },
    include: {
      lead: {
        select: {
          businessName: true,
          ownerName: true,
          location: true,
          niche: true,
          googleRating: true,
          reviewCount: true,
          businessBio: true,
          intentScore: true,
          observations: true,
          openingLine: true,
        },
      },
    },
  });
}

export async function getCardByLeadId(leadId: string) {
  return db.card.findUnique({ where: { leadId } });
}

export async function getCardsByUser(userId: string) {
  return db.card.findMany({
    where: { userId },
    include: {
      lead: { select: { businessName: true, niche: true, location: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function incrementCardViewCount(slug: string) {
  return db.card.update({
    where: { slug },
    data: { viewCount: { increment: 1 }, lastViewed: new Date() },
  });
}

export async function updateCard(
  id: string,
  data: Prisma.CardUpdateInput
) {
  return db.card.update({ where: { id }, data });
}

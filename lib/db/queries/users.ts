import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId },
    include: { cardIdentity: true, subscription: true },
  });
}

export async function upsertUser(data: {
  clerkId: string;
  email: string;
  name?: string;
}) {
  return db.user.upsert({
    where: { clerkId: data.clerkId },
    create: {
      clerkId: data.clerkId,
      email: data.email,
      name: data.name,
      subscription: {
        create: { plan: "starter", status: "active" },
      },
    },
    update: {
      email: data.email,
      name: data.name,
    },
    include: { cardIdentity: true, subscription: true },
  });
}

export async function getCardIdentity(userId: string) {
  return db.cardIdentity.findUnique({ where: { userId } });
}

export async function upsertCardIdentity(
  userId: string,
  data: {
    brandColour?: string;
    accentColour?: string;
    logoUrl?: string;
    agencyName?: string;
    agencyTagline?: string;
    agencyOwnerName?: string;
    agencyOwnerPhoto?: string;
    writingStyle?: string;
    defaultAngle?: string;
    ctaType?: string;
    ctaValue?: string;
    cardStyle?: string;
    socialProof?: Prisma.InputJsonValue;
    defaultResponseTime?: string;
    closeIntroText?: string;
  }
) {
  return db.cardIdentity.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}

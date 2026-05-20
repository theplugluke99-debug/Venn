import { db } from "@/lib/db";
import type { LeadStatus } from "@/types";

export async function createLead(data: {
  userId: string;
  businessName: string;
  location: string;
  niche: string;
  website?: string;
  jobId?: string;
}) {
  return db.lead.create({ data });
}

export async function getLeadById(id: string, userId: string) {
  return db.lead.findFirst({
    where: { id, userId },
    include: { card: true },
  });
}

export async function getLeadsByUser(
  userId: string,
  options?: { status?: LeadStatus; limit?: number; offset?: number }
) {
  return db.lead.findMany({
    where: {
      userId,
      ...(options?.status ? { status: options.status } : {}),
    },
    include: { card: { select: { id: true, slug: true, headline: true, viewCount: true, lastViewed: true } } },
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return db.lead.update({ where: { id }, data: { status } });
}

export async function updateLeadData(
  id: string,
  data: Record<string, unknown>
) {
  return db.lead.update({ where: { id }, data });
}

export async function deleteLead(id: string, userId: string) {
  return db.lead.deleteMany({ where: { id, userId } });
}

export async function getLeadCountByUser(userId: string) {
  return db.lead.count({ where: { userId } });
}

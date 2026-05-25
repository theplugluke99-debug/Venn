import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getClientsByUser(userId: string) {
  return db.client.findMany({
    where: { userId },
    include: {
      deliverables: { select: { id: true, status: true, dueDate: true } },
      checkIns: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
      reports: { orderBy: { sentAt: "desc" }, take: 1, select: { sentAt: true, createdAt: true } },
      lead: { select: { id: true, businessName: true, intentScore: true } },
    },
    orderBy: { healthScore: "asc" },
  });
}

export async function getClientById(id: string) {
  return db.client.findUnique({
    where: { id },
    include: {
      deliverables: { orderBy: { createdAt: "desc" } },
      reports: { orderBy: { createdAt: "desc" } },
      checkIns: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
      lead: true,
    },
  });
}

export async function createClient(data: {
  userId: string;
  businessName: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  website?: string;
  niche?: string;
  location?: string;
  logoUrl?: string;
  contractValue?: number;
  billingCycle?: string;
  startDate?: Date;
  nextBillingDate?: Date;
  contractEndDate?: Date;
  notes?: string;
  leadId?: string;
  proposalId?: string;
}) {
  return db.client.create({ data });
}

export async function updateClient(
  id: string,
  data: Prisma.ClientUpdateInput
) {
  return db.client.update({ where: { id }, data });
}

export async function deleteClient(id: string) {
  return db.client.delete({ where: { id } });
}

export async function logClientActivity(data: {
  clientId: string;
  userId: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return db.clientActivity.create({ data });
}

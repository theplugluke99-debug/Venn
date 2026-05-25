import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getDeliverablesByUser(userId: string) {
  return db.deliverable.findMany({
    where: { userId },
    include: {
      client: { select: { id: true, businessName: true, healthScore: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getDeliverablesByClient(clientId: string) {
  return db.deliverable.findMany({
    where: { clientId },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function createDeliverable(data: {
  clientId: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  notes?: string;
}) {
  return db.deliverable.create({ data });
}

export async function updateDeliverable(
  id: string,
  data: Prisma.DeliverableUpdateInput
) {
  return db.deliverable.update({ where: { id }, data });
}

export async function deleteDeliverable(id: string) {
  return db.deliverable.delete({ where: { id } });
}

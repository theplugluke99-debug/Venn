import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getServicePackagesByUser(userId: string) {
  return db.servicePackage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createServicePackage(data: {
  userId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  features?: Prisma.InputJsonValue;
  isDefault?: boolean;
}) {
  return db.servicePackage.create({ data });
}

export async function deleteServicePackage(id: string, userId: string) {
  return db.servicePackage.deleteMany({ where: { id, userId } });
}

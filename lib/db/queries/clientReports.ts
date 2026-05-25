import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getReportsByUser(userId: string) {
  return db.clientReport.findMany({
    where: { userId },
    include: { client: { select: { id: true, businessName: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReportBySlug(slug: string) {
  return db.clientReport.findUnique({
    where: { slug },
    include: { client: true },
  });
}

export async function createClientReport(data: {
  clientId: string;
  userId: string;
  slug: string;
  title: string;
  period: string;
  content: Prisma.InputJsonValue;
  status?: string;
}) {
  return db.clientReport.create({ data });
}

export async function updateClientReport(
  id: string,
  data: Prisma.ClientReportUpdateInput
) {
  return db.clientReport.update({ where: { id }, data });
}

export async function recordReportView(slug: string) {
  return db.clientReport.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 },
      viewedAt: new Date(),
    },
  });
}

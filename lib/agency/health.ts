import { db } from "@/lib/db";
export { getHealthColour, getHealthBorderColour } from "./colours";

export interface HealthSignal {
  key: string;
  label: string;
  impact: number; // negative = deduction, positive = bonus
  active: boolean;
}

export async function calculateClientHealth(clientId: string): Promise<{
  score: number;
  signals: HealthSignal[];
}> {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today.getTime() + 7 * oneDay);
  const weekAgo = new Date(now.getTime() - 7 * oneDay);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * oneDay);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * oneDay);
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * oneDay);

  const client = await db.client.findUnique({
    where: { id: clientId },
    include: {
      deliverables: true,
      checkIns: { orderBy: { createdAt: "desc" }, take: 1 },
      reports: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!client) return { score: 100, signals: [] };

  const signals: HealthSignal[] = [];

  // Overdue deliverables
  const overdueCount = client.deliverables.filter(
    (d) => d.status !== "complete" && d.dueDate && d.dueDate < now
  ).length;
  if (overdueCount > 0) {
    signals.push({
      key: "overdue_deliverables",
      label: `${overdueCount} overdue deliverable${overdueCount > 1 ? "s" : ""}`,
      impact: -15 * Math.min(overdueCount, 3),
      active: true,
    });
  }

  // Check-in recency
  const lastCheckIn = client.checkIns[0];
  const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn.createdAt) : null;

  if (!lastCheckInDate || lastCheckInDate < thirtyDaysAgo) {
    signals.push({
      key: "no_checkin_30d",
      label: "No check-in in 30+ days",
      impact: -20,
      active: true,
    });
  } else if (lastCheckInDate < fourteenDaysAgo) {
    signals.push({
      key: "no_checkin_14d",
      label: "No check-in in 14+ days",
      impact: -10,
      active: true,
    });
  } else if (lastCheckInDate >= weekAgo) {
    signals.push({
      key: "recent_checkin",
      label: "Check-in done this week",
      impact: 5,
      active: true,
    });
  }

  // Report not sent this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastReport = client.reports[0];
  if (!lastReport || (lastReport.sentAt && new Date(lastReport.sentAt) < monthStart)) {
    signals.push({
      key: "report_overdue",
      label: "No report sent this month",
      impact: -10,
      active: true,
    });
  }

  // Contract ending soon
  if (client.contractEndDate) {
    const daysUntilEnd = Math.floor(
      (new Date(client.contractEndDate).getTime() - now.getTime()) / oneDay
    );
    if (daysUntilEnd <= 30 && daysUntilEnd >= 0) {
      signals.push({
        key: "contract_ending",
        label: `Contract ending in ${daysUntilEnd} days`,
        impact: -15,
        active: true,
      });
    }
  }

  // All deliverables on time this week
  const weekDeliverables = client.deliverables.filter(
    (d) => d.dueDate && new Date(d.dueDate) >= today && new Date(d.dueDate) <= weekEnd
  );
  const allOnTime =
    weekDeliverables.length > 0 &&
    weekDeliverables.every((d) => d.status === "complete" || new Date(d.dueDate!) >= now);
  if (allOnTime && overdueCount === 0) {
    signals.push({
      key: "all_on_time",
      label: "All deliverables on track",
      impact: 5,
      active: true,
    });
  }

  const baseScore = 100;
  const totalImpact = signals.reduce((sum, s) => sum + s.impact, 0);
  const score = Math.max(0, Math.min(100, baseScore + totalImpact));

  // Persist health score
  await db.client.update({
    where: { id: clientId },
    data: {
      healthScore: score,
      healthSignals: signals as unknown as import("@prisma/client").Prisma.InputJsonValue,
      lastHealthCheck: now,
    },
  });

  return { score, signals };
}


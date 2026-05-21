import { db } from "@/lib/db";

export type GatedFeature = "search" | "cards" | "sequences" | "proposals" | "reporting";

const PLAN_ORDER: Record<string, number> = {
  starter: 0,
  growth: 1,
  pro: 2,
  enterprise: 3,
};

// Minimum plan order required for each feature
const FEATURE_MIN_ORDER: Record<GatedFeature, number> = {
  search: 0,      // all plans
  cards: 1,       // growth+
  sequences: 1,   // growth+
  proposals: 2,   // pro+
  reporting: 2,   // pro+
};

export async function canUseFeature(userId: string, feature: GatedFeature): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub || sub.status !== "active") return false;
  const planOrder = PLAN_ORDER[sub.plan] ?? 0;
  return planOrder >= FEATURE_MIN_ORDER[feature];
}

export async function getMonthlyLeadCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  return db.lead.count({ where: { userId, createdAt: { gte: startOfMonth } } });
}

export async function getMonthlyLeadLimit(userId: string): Promise<number> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  const plan = sub?.plan ?? "starter";
  const limits: Record<string, number> = {
    starter: 100,
    growth: 250,
    pro: 500,
    enterprise: 999999,
  };
  return limits[plan] ?? 100;
}

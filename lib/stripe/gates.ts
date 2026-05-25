import { db } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/stripe/plans";

export type GatedFeature = "search" | "cards" | "sequences" | "proposals" | "close_session" | "reporting";

const PLAN_ORDER: Record<string, number> = {
  solopreneur: 0,
  starter: 1,
  growth: 2,
  pro: 3,
  enterprise: 4,
};

// Per-plan feature access
const PLAN_FEATURES: Record<string, Record<GatedFeature, boolean>> = {
  solopreneur: { search: true, cards: false, sequences: true,  proposals: false, close_session: false, reporting: false },
  starter:     { search: true, cards: true,  sequences: false, proposals: false, close_session: false, reporting: false },
  growth:      { search: true, cards: true,  sequences: true,  proposals: false, close_session: true,  reporting: false },
  pro:         { search: true, cards: true,  sequences: true,  proposals: true,  close_session: true,  reporting: true  },
  enterprise:  { search: true, cards: true,  sequences: true,  proposals: true,  close_session: true,  reporting: true  },
};

export async function canUseFeature(userId: string, feature: GatedFeature): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub || (sub.status !== "active" && sub.status !== "trialing")) return false;
  return PLAN_FEATURES[sub.plan]?.[feature] ?? false;
}

export async function getMonthlyLeadCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  return db.lead.count({ where: { userId, createdAt: { gte: startOfMonth } } });
}

export async function getMonthlyLeadLimit(userId: string): Promise<number> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  const plan = (sub?.plan ?? "starter") as keyof typeof PLAN_LIMITS;
  return PLAN_LIMITS[plan]?.leadsPerMonth ?? 150;
}

export async function getMonthlyCardCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  return db.card.count({ where: { userId, createdAt: { gte: startOfMonth } } });
}

export async function getMonthlyCardLimit(userId: string): Promise<number> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  const plan = (sub?.plan ?? "starter") as keyof typeof PLAN_LIMITS;
  return PLAN_LIMITS[plan]?.cardsPerMonth ?? 10;
}

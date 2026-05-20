import type { Plan } from "@/types";

export const PLANS: Record<
  Plan,
  { name: string; monthlyLeads: number; cards: boolean; priceId: string | null }
> = {
  starter: {
    name: "Starter",
    monthlyLeads: 20,
    cards: true,
    priceId: null,
  },
  growth: {
    name: "Growth",
    monthlyLeads: 100,
    cards: true,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? null,
  },
  pro: {
    name: "Pro",
    monthlyLeads: 500,
    cards: true,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
  },
};

export function getPlanLimits(plan: Plan) {
  return PLANS[plan] ?? PLANS.starter;
}

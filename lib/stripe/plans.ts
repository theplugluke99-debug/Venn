export type { Plan } from "@/types";
import type { Plan } from "@/types";

export const PLANS: Record<
  Plan,
  {
    name: string;
    price: number;
    leads: number;
    seats?: number;
    apiAccess?: boolean;
    whiteLabel?: boolean;
    priceId: string | null;
  }
> = {
  starter: {
    name: "Starter",
    price: 79,
    leads: 100,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? null,
  },
  growth: {
    name: "Growth",
    price: 149,
    leads: 250,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? null,
  },
  pro: {
    name: "Pro",
    price: 249,
    leads: 500,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
  },
  enterprise: {
    name: "Enterprise",
    price: 799,
    leads: 9999,
    seats: 10,
    apiAccess: true,
    whiteLabel: true,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
  },
};

export function getPlanLimits(plan: Plan) {
  return PLANS[plan] ?? PLANS.starter;
}

export function getPlanOrder(plan: Plan): number {
  const order: Record<Plan, number> = { starter: 0, growth: 1, pro: 2, enterprise: 3 };
  return order[plan] ?? 0;
}

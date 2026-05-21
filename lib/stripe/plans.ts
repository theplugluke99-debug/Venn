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
  solopreneur: {
    name: "Solopreneur",
    price: 0,
    leads: 100,
    priceId: null,
  },
  starter: {
    name: "Starter",
    price: 149,
    leads: 150,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? null,
  },
  growth: {
    name: "Growth",
    price: 299,
    leads: 400,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? null,
  },
  pro: {
    name: "Pro",
    price: 499,
    leads: 999,
    seats: 5,
    whiteLabel: true,
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

export const PLAN_LIMITS = {
  starter: {
    leadsPerMonth: 150,
    cardsPerMonth: 10,
    sequences: false,
    proposals: false,
    reporting: false,
    whiteLabel: false,
  },
  growth: {
    leadsPerMonth: 400,
    cardsPerMonth: 999,
    sequences: true,
    proposals: false,
    reporting: false,
    whiteLabel: false,
  },
  pro: {
    leadsPerMonth: 999,
    cardsPerMonth: 999,
    sequences: true,
    proposals: true,
    reporting: true,
    whiteLabel: true,
  },
  solopreneur: {
    leadsPerMonth: 100,
    cardsPerMonth: 20,
    sequences: true,
    proposals: false,
    reporting: false,
    whiteLabel: false,
  },
  enterprise: {
    leadsPerMonth: 9999,
    cardsPerMonth: 9999,
    sequences: true,
    proposals: true,
    reporting: true,
    whiteLabel: true,
  },
} as const;

export function getPlanLimits(plan: Plan) {
  return PLANS[plan] ?? PLANS.starter;
}

export function getPlanOrder(plan: Plan): number {
  const order: Record<Plan, number> = { solopreneur: 0, starter: 1, growth: 2, pro: 3, enterprise: 4 };
  return order[plan] ?? 0;
}

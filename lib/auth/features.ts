// Client-safe feature access checks (no DB imports)
// Server-side DB checks are in featureAccess.ts

export type Feature =
  | "prospect_cards"
  | "api_access"
  | "white_label"
  | "team_seats"
  | "advanced_reporting";

const PLAN_ORDER: Record<string, number> = {
  starter: 0,
  growth: 1,
  pro: 2,
  enterprise: 3,
};

const FEATURE_MINIMUM_PLAN: Record<Feature, string> = {
  prospect_cards: "growth",
  api_access: "enterprise",
  white_label: "enterprise",
  team_seats: "enterprise",
  advanced_reporting: "pro",
};

export function hasFeatureAccess(userPlan: string, feature: Feature): boolean {
  const userOrder = PLAN_ORDER[userPlan] ?? 0;
  const requiredOrder = PLAN_ORDER[FEATURE_MINIMUM_PLAN[feature]] ?? 0;
  return userOrder >= requiredOrder;
}

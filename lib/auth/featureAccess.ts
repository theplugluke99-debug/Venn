import { db } from "@/lib/db";
import { getPlanOrder } from "@/lib/stripe/plans";
import type { Plan } from "@/types";

export type Feature =
  | "prospect_cards"
  | "api_access"
  | "white_label"
  | "team_seats"
  | "advanced_reporting";

const FEATURE_REQUIREMENTS: Record<Feature, Plan> = {
  prospect_cards: "growth",
  api_access: "enterprise",
  white_label: "enterprise",
  team_seats: "enterprise",
  advanced_reporting: "pro",
};

export async function checkFeatureAccess(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) return false;

  const userPlan = (user.subscription?.plan ?? "starter") as Plan;
  const requiredPlan = FEATURE_REQUIREMENTS[feature];

  return getPlanOrder(userPlan) >= getPlanOrder(requiredPlan);
}

export function checkFeatureAccessSync(userPlan: string, feature: Feature): boolean {
  const requiredPlan = FEATURE_REQUIREMENTS[feature];
  return getPlanOrder(userPlan as Plan) >= getPlanOrder(requiredPlan);
}

// API key validation — uses raw query until Prisma is regenerated with ApiKey model
export async function validateApiKey(
  key: string
): Promise<{ userId: string; plan: string } | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = db as any;
    if (!client.apiKey) return null;

    const apiKey = await client.apiKey.findUnique({
      where: { key },
      include: {
        user: { include: { subscription: true } },
      },
    });

    if (!apiKey) return null;

    await client.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
    });

    return {
      userId: apiKey.userId,
      plan: apiKey.user.subscription?.plan ?? "starter",
    };
  } catch {
    return null;
  }
}

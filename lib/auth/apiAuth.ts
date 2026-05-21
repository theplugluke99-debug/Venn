import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { validateApiKey } from "./featureAccess";

export interface AuthResult {
  userId: string;
  plan: string;
  method: "clerk" | "api_key";
}

export async function authenticateRequest(
  req: NextRequest
): Promise<AuthResult | null> {
  // Check X-API-Key header first (enterprise API access)
  const apiKeyHeader = req.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (result) {
      return {
        userId: result.userId,
        plan: result.plan,
        method: "api_key",
      };
    }
    return null;
  }

  // Fall back to Clerk session auth
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);
  if (!user) return null;

  return {
    userId: user.id,
    plan: user.subscription?.plan ?? "starter",
    method: "clerk",
  };
}

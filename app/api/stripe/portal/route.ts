import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { createBillingPortalSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const user = await getUserByClerkId(clerkId);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const customerId = user.subscription?.stripeCustomerId;
  if (!customerId) return Response.json({ error: "No billing account found" }, { status: 400 });

  const origin = request.headers.get("origin") ?? "https://app.venn.so";

  const session = await createBillingPortalSession(customerId, `${origin}/settings`);
  return Response.json({ url: session.url });
}

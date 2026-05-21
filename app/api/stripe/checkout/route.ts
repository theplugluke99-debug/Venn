import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const [clerkUser, user] = await Promise.all([
    currentUser(),
    getUserByClerkId(clerkId),
  ]);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { priceId } = await request.json();
  if (!priceId) return Response.json({ error: "priceId is required" }, { status: 400 });

  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? user.email;
  const origin = request.headers.get("origin") ?? "https://app.venn.so";

  const session = await createCheckoutSession({
    userId: user.id,
    email,
    priceId,
    successUrl: `${origin}/settings?upgraded=1`,
    cancelUrl: `${origin}/subscribe`,
  });

  return Response.json({ url: session.url });
}

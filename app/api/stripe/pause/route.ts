import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(_request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const sub = user.subscription;
    if (!sub?.stripeSubId) {
      return Response.json({ error: "No active subscription found" }, { status: 400 });
    }

    // Pause Stripe billing — void invoices for the pause period
    await stripe.subscriptions.update(sub.stripeSubId, {
      pause_collection: { behavior: "void" },
    });

    // Mark subscription as paused in DB
    await db.subscription.update({
      where: { userId: user.id },
      data: { status: "paused" },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/stripe/pause]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

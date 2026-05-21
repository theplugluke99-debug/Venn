import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { type Stripe as StripeType } from "stripe";

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
  [process.env.STRIPE_GROWTH_PRICE_ID ?? ""]: "growth",
  [process.env.STRIPE_PRO_PRICE_ID ?? ""]: "pro",
  [process.env.STRIPE_ENTERPRISE_PRICE_ID ?? ""]: "enterprise",
};

function planFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return "starter";
  return PRICE_TO_PLAN[priceId] ?? "starter";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event: StripeType.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe webhook] Invalid signature", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as StripeType.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubId: subscription.id,
            stripePriceId: priceId,
            plan,
            status: "active",
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubId: subscription.id,
            stripePriceId: priceId,
            status: "active",
            plan,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as StripeType.Subscription;
        const priceId = sub.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);

        // Try metadata first, then fall back to DB lookup by stripeSubId
        const userId = sub.metadata?.userId;
        if (userId) {
          await db.subscription.updateMany({
            where: { userId },
            data: {
              status: sub.status === "active" ? "active" : "inactive",
              stripePriceId: priceId,
              plan,
            },
          });
        } else {
          await db.subscription.updateMany({
            where: { stripeSubId: sub.id },
            data: {
              status: sub.status === "active" ? "active" : "inactive",
              stripePriceId: priceId,
              plan,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as StripeType.Subscription;
        await db.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { status: "cancelled" },
        });
        break;
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("[Stripe webhook] Handler error", err);
    return Response.json({ error: "Handler error" }, { status: 500 });
  }
}

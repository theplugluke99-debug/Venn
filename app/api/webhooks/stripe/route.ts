import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { type Stripe as StripeType } from "stripe";

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

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            plan: "growth",
            status: "active",
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: "active",
            plan: "growth",
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as StripeType.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await db.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: {
            status: sub.status === "active" ? "active" : "inactive",
            stripePriceId: sub.items.data[0]?.price.id,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as StripeType.Subscription;
        await db.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { status: "cancelled", plan: "starter" },
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

import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { config } from "@/lib/config";
import { addEmailJob } from "@/lib/queue";
import { sendWelcomeEmail } from "@/lib/email/templates/welcome";
import { type Stripe as StripeType } from "stripe";

const PRICE_TO_PLAN: Record<string, string> = {
  [config.stripe.prices.starter]: "starter",
  [config.stripe.prices.growth]: "growth",
  [config.stripe.prices.pro]: "pro",
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
    event = stripe.webhooks.constructEvent(body, sig, config.stripe.webhookSecret);
  } catch (err) {
    console.error("[Stripe webhook] Invalid signature", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as StripeType.Checkout.Session;

        // userId in metadata is the Prisma user ID (set by checkout API)
        const userId = session.metadata?.userId;
        if (!userId) break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubId: subscription.id,
            stripePriceId: priceId,
            plan,
            status: "active",
          },
          update: {
            stripeCustomerId: customerId,
            stripeSubId: subscription.id,
            stripePriceId: priceId,
            status: "active",
            plan,
          },
        });

        // Log payment event
        await db.userEvent.create({
          data: {
            userId,
            type: "payment_completed",
            title: `Started ${plan} plan`,
            description: `Subscribed to Venn ${plan} plan`,
          },
        }).catch(() => null);

        // Resolve user email + name for welcome sequence
        const user = await db.user.findUnique({ where: { id: userId } });
        const email = user?.email ?? null;
        const fullName = user?.name ?? "";
        const firstName = fullName.split(" ")[0] || "there";

        if (email) {
          // Send welcome email immediately
          await sendWelcomeEmail({ email, firstName, plan }).catch((err) =>
            console.error("[stripe/webhook] welcome email failed:", err)
          );

          // Queue 30-minute follow-up
          await addEmailJob(
            "thirty_minute_followup",
            { email, firstName, userId },
            30 * 60 * 1000
          ).catch(() => null);

          // Queue day-three check-in
          await addEmailJob(
            "day_three_checkin",
            { email, firstName, userId },
            72 * 60 * 60 * 1000
          ).catch(() => null);
        }

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as StripeType.Subscription;
        const priceId = sub.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);
        const status = sub.status === "active" ? "active" : "inactive";

        const userId = sub.metadata?.userId;
        if (userId) {
          await db.subscription.updateMany({
            where: { userId },
            data: { status, stripePriceId: priceId, plan },
          });
        } else {
          await db.subscription.updateMany({
            where: { stripeSubId: sub.id },
            data: { status, stripePriceId: priceId, plan },
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

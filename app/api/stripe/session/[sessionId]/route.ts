import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { config } from "@/lib/config";
import { type Stripe as StripeType } from "stripe";

const PRICE_TO_PLAN: Record<string, string> = {
  [config.stripe.prices.starter]: "starter",
  [config.stripe.prices.growth]: "growth",
  [config.stripe.prices.pro]: "pro",
  [process.env.STRIPE_ENTERPRISE_PRICE_ID ?? ""]: "enterprise",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const { sessionId } = await params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });

    const customer = session.customer as StripeType.Customer | null;
    const fullName = customer?.name ?? "";
    const firstName = fullName.split(" ")[0] || "there";

    let plan = "starter";
    if (session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = sub.items.data[0]?.price.id ?? "";
      plan = PRICE_TO_PLAN[priceId] ?? "starter";
    }

    return Response.json({ plan, firstName, email: customer?.email ?? "" });
  } catch (err) {
    console.error("[GET /api/stripe/session]", err);
    return Response.json({ plan: "starter", firstName: "there", email: "" });
  }
}

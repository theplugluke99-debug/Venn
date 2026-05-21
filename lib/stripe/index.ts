import Stripe from "stripe";
import { config } from "@/lib/config";

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2026-04-22.dahlia",
});

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: params.email,
    mode: "subscription",
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { userId: params.userId },
    subscription_data: { metadata: { userId: params.userId } },
  });
  return session;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getSubscription(stripeSubId: string) {
  return stripe.subscriptions.retrieve(stripeSubId);
}

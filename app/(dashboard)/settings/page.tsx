import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, getCardIdentity } from "@/lib/db/queries/users";
import { stripe } from "@/lib/stripe";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings — Venn" };

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const identity = await getCardIdentity(user.id);
  const plan = user.subscription?.plan ?? "starter";
  const hasStripeCustomer = !!user.subscription?.stripeCustomerId;

  // Fetch renewal date from Stripe if the user has a subscription
  let renewalDate: string | null = null;
  if (user.subscription?.stripeSubId) {
    try {
      const sub = await stripe.subscriptions.retrieve(user.subscription.stripeSubId);
      const ts = (sub as { current_period_end?: number }).current_period_end;
      if (typeof ts === "number") {
        renewalDate = new Date(ts * 1000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {
      // not critical
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1
          className="mb-2"
          style={{
            fontSize: 28,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#555250",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          Card identity shapes how your prospect cards are written. Claude uses this to match your voice.
        </p>
      </div>
      <SettingsForm
        initialData={identity}
        plan={plan}
        renewalDate={renewalDate}
        hasStripeCustomer={hasStripeCustomer}
      />
    </div>
  );
}

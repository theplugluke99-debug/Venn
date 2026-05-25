import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, getCardIdentity } from "@/lib/db/queries/users";
import { getServicePackagesByUser } from "@/lib/db/queries/servicePackages";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
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

  const servicePackages = await getServicePackagesByUser(user.id);

  // Warm leads and hot lead for cancellation modal
  const [warmLeadCount, hotCard] = await Promise.all([
    db.lead.count({ where: { id: user.id, status: "complete" } }),
    db.card.findFirst({
      where: { userId: user.id, lastViewed: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      orderBy: { viewCount: "desc" },
      include: { lead: { select: { businessName: true } } },
    }),
  ]);

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
        warmLeadCount={warmLeadCount}
        hotLeadName={hotCard?.lead?.businessName}
        initialPackages={servicePackages.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? "",
          price: p.price,
          currency: p.currency,
        }))}
      />
    </div>
  );
}

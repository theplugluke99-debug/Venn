import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const proposal = await db.proposal.findUnique({
      where: { slug },
      include: { lead: true },
    });

    if (!proposal) return Response.json({ error: "Not found" }, { status: 404 });
    if (!proposal.depositAmount) {
      return Response.json({ error: "No deposit amount set" }, { status: 400 });
    }

    const owner = await db.user.findUnique({ where: { id: proposal.userId } });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Deposit — ${proposal.title}`,
              description: `Proposal for ${proposal.lead.businessName}`,
            },
            unit_amount: Math.round(proposal.depositAmount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: owner?.email,
      success_url: `${BASE_URL}/proposal/${slug}?paid=true`,
      cancel_url: `${BASE_URL}/proposal/${slug}`,
      metadata: { proposalId: proposal.id, proposalSlug: slug },
    });

    await db.proposal.update({
      where: { slug },
      data: { stripeSessionId: session.id },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/proposals/[slug]/pay]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

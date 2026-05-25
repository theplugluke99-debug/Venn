import { NextRequest } from "next/server";
import { getProposalBySlug, recordProposalView } from "@/lib/db/queries/proposals";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { proposalViewedHtml } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const proposal = await getProposalBySlug(slug);
    if (!proposal) return Response.json({ error: "Not found" }, { status: 404 });

    const wasFirst = !proposal.firstViewedAt;
    await recordProposalView(slug);

    if (wasFirst) {
      const owner = await db.user.findUnique({
        where: { id: proposal.userId },
        include: { cardIdentity: true },
      });
      if (owner?.email) {
        const agencyOwnerName =
          owner.cardIdentity?.agencyOwnerName ?? owner.name ?? "there";
        const resend = getResend();
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: owner.email,
          subject: `${proposal.lead.businessName} just opened your proposal`,
          html: proposalViewedHtml({
            agencyOwnerName,
            businessName: proposal.lead.businessName,
            proposalUrl: `${BASE_URL}/proposals/${proposal.id}`,
          }),
        }).catch(console.error);
      }
    }

    return Response.json({ proposal });
  } catch (err) {
    console.error("[GET /api/proposals/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

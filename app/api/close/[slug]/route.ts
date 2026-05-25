import { NextRequest } from "next/server";
import { getCloseSessionBySlug, recordCloseSessionView } from "@/lib/db/queries/closeSessions";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { closeViewedHtml } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getCloseSessionBySlug(slug);
    if (!session) return Response.json({ error: "Not found" }, { status: 404 });

    const wasFirst = !session.discoveryViewedAt;
    await recordCloseSessionView(slug);

    if (wasFirst) {
      const owner = await db.user.findUnique({
        where: { id: session.userId },
        include: { cardIdentity: true },
      });
      if (owner?.email) {
        const agencyOwnerName = owner.cardIdentity?.agencyOwnerName ?? owner.name ?? "there";
        const resend = getResend();
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: owner.email,
          subject: `${session.lead.businessName} opened their Venn Close`,
          html: closeViewedHtml({
            agencyOwnerName,
            businessName: session.lead.businessName,
            sessionUrl: `${BASE_URL}/close/${session.id}`,
          }),
        }).catch(console.error);
      }
    }

    return Response.json({ session });
  } catch (err) {
    console.error("[GET /api/close/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

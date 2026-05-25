import { NextRequest } from "next/server";
import { completeCloseSession } from "@/lib/db/queries/closeSessions";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { closeDiscoveryCompletedHtml } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await completeCloseSession(slug);
    if (!session) return Response.json({ error: "Not found" }, { status: 404 });

    const owner = await db.user.findUnique({
      where: { id: session.userId },
      include: { cardIdentity: true },
    });

    if (owner?.email) {
      const agencyOwnerName = owner.cardIdentity?.agencyOwnerName ?? owner.name ?? "there";
      const questions = session.questions as Array<{ text: string }>;
      const answersMap: Record<string, string> = {};
      session.discoveryAnswers.forEach((a) => {
        answersMap[String(a.questionIndex)] = a.answer;
      });

      const resend = getResend();
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: owner.email,
        subject: `${session.lead.businessName} completed their discovery — generate proposal now`,
        html: closeDiscoveryCompletedHtml({
          agencyOwnerName,
          businessName: session.lead.businessName,
          questions,
          answers: answersMap,
          sessionUrl: `${BASE_URL}/close/${session.id}`,
          generateUrl: `${BASE_URL}/proposals?leadId=${session.leadId}&closeSessionId=${session.id}`,
        }),
      }).catch(console.error);
    }

    return Response.json({ ok: true, session });
  } catch (err) {
    console.error("[PATCH /api/close/[slug]/complete]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

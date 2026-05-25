import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { proposalQuestionNotificationHtml } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const proposal = await db.proposal.findUnique({
      where: { slug },
      include: { lead: true },
    });
    if (!proposal) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const { visitorName, question } = body as { visitorName: string; question: string };

    if (!visitorName?.trim() || !question?.trim()) {
      return Response.json({ error: "Name and question are required" }, { status: 400 });
    }

    const record = await db.proposalQuestion.create({
      data: { proposalId: proposal.id, visitorName: visitorName.trim(), question: question.trim() },
    });

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
        subject: `New question from ${visitorName} on your ${proposal.lead.businessName} proposal`,
        html: proposalQuestionNotificationHtml({
          agencyOwnerName,
          businessName: proposal.lead.businessName,
          visitorName,
          question: question.trim(),
          answerUrl: `${BASE_URL}/proposals/${proposal.id}`,
        }),
      }).catch(console.error);
    }

    return Response.json({ question: record }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/proposals/[slug]/questions]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

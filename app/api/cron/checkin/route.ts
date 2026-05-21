/**
 * Biweekly check-in emails for solopreneur users.
 * Vercel cron: every 14 days (0 8 1,15 * *)
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { checkinEmailHtml } from "@/lib/email/templates";

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ skipped: true, reason: "RESEND_API_KEY not configured" });
  }

  const solopreneurs = await db.subscription.findMany({
    where: {
      isSolopreneur: true,
      solopreneurApproved: true,
      status: "active",
      dealClosed: false,
      solopreneurExpiry: { gt: new Date() },
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const resend = getResend();
  let sent = 0;

  for (const sub of solopreneurs) {
    const user = sub.user;
    if (!user?.email) continue;

    const userId = user.id;

    const [searchCount, cardCount, sequences, hotCard] = await Promise.all([
      db.lead.count({ where: { userId } }),
      db.card.count({ where: { userId } }),
      db.sequence.findMany({
        where: { userId },
        include: {
          steps: { where: { status: "sent" }, select: { id: true } },
        },
      }),
      db.card.findFirst({
        where: {
          userId,
          lastViewed: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { viewCount: "desc" },
        include: { lead: { select: { businessName: true, openingLine: true } } },
      }),
    ]);

    const sequenceCount = sequences.filter((s) => s.steps.length > 0).length;

    const days = sub.solopreneurExpiry
      ? Math.max(0, Math.ceil((sub.solopreneurExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : undefined;

    const html = checkinEmailHtml({
      name: user.name ?? user.email.split("@")[0],
      hotLeadName: hotCard?.lead?.businessName,
      hotLeadOpeningLine: hotCard?.lead?.openingLine ?? undefined,
      searchCount,
      cardCount,
      sequenceCount,
      solopreneurDaysLeft: days,
    });

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      subject: "Checking in — how's the pipeline?",
      html,
    }).catch((err) => console.error(`[checkin] email to ${user.email} failed:`, err));

    sent++;
  }

  return Response.json({ success: true, sent });
}

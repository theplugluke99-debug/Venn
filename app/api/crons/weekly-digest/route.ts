/**
 * Weekly digest email — runs every Monday at 8am UTC.
 * Personal, data-driven, not corporate.
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { weeklyDigestHtml } from "@/lib/email/templates";

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return Response.json({ error: "Unauthorised" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) return Response.json({ skipped: true });

  const resend = getResend();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  let sent = 0;
  const weekNum = Math.ceil(new Date().getDate() / 7);

  const users = await db.user.findMany({
    where: {
      subscription: { status: { in: ["active", "trialing"] } },
      createdAt: { lt: weekAgo },
    },
  });

  for (const user of users) {
    if (!user.email) continue;

    const [weekSearches, weekCards, prevWeekCards, weekViews, hotCard, topLead] = await Promise.all([
      db.lead.count({ where: { userId: user.id, createdAt: { gte: weekAgo } } }),
      db.card.count({ where: { userId: user.id, createdAt: { gte: weekAgo } } }),
      db.card.count({ where: { userId: user.id, createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      db.card.aggregate({
        where: { userId: user.id },
        _sum: { viewCount: true },
      }),
      db.card.findFirst({
        where: {
          userId: user.id,
          lastViewed: { gt: weekAgo },
        },
        orderBy: { viewCount: "desc" },
        include: { lead: { select: { businessName: true, openingLine: true } } },
      }),
      db.lead.findFirst({
        where: {
          userId: user.id,
          status: "complete",
          intentScore: "high",
          card: null,
        },
        orderBy: { createdAt: "desc" },
        select: { businessName: true, location: true, openingLine: true },
      }),
    ]);

    const subjects = [
      `Your week ahead, ${(user.name ?? user.email).split(" ")[0]}`,
      `${weekCards} leads worth your attention this week`,
      hotCard ? `${hotCard.lead?.businessName} is still warm — here's what to do` : `Your week ahead, ${(user.name ?? user.email).split(" ")[0]}`,
      `How your pipeline looks this week`,
    ];

    const subject = subjects[(weekNum - 1) % 4];

    const html = weeklyDigestHtml({
      name: user.name ?? user.email.split("@")[0],
      hotLeadName: hotCard?.lead?.businessName,
      hotLeadViewCount: hotCard?.viewCount,
      hotLeadOpeningLine: hotCard?.lead?.openingLine ?? undefined,
      highestPriorityLead: topLead ?? undefined,
      weekSearches,
      weekCards,
      weekOpens: weekViews._sum.viewCount ?? 0,
      weekReplies: 0,
      prevWeekCards,
      weekNumber: weekNum,
    });

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      subject,
      html,
    }).catch(() => null);
    sent++;
  }

  return Response.json({ success: true, sent });
}

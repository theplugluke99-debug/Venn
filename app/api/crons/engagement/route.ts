/**
 * Re-engagement cron — runs daily at 9am UTC.
 * Detects users who haven't logged in for 7 or 14 days and sends personal check-ins.
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return Response.json({ error: "Unauthorised" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) return Response.json({ skipped: true });

  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  let sent = 0;

  const activeUsers = await db.user.findMany({
    where: { subscription: { status: { in: ["active", "trialing"] } } },
    include: {
      subscription: true,
      leads: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
      _count: { select: { leads: true } },
    },
  });

  for (const user of activeUsers) {
    if (!user.email) continue;

    // Use last lead creation as proxy for last activity
    const lastActivity = user.leads[0]?.createdAt ?? user.createdAt;
    const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    const firstName = (user.name ?? user.email).split(" ")[0];

    if (daysSince === 7) {
      // Find hot lead
      const hotCard = await db.card.findFirst({
        where: {
          userId: user.id,
          lastViewed: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { viewCount: "desc" },
        include: { lead: { select: { businessName: true } } },
      });

      const hotSection = hotCard
        ? `<p>While you were away, <strong>${hotCard.lead?.businessName}</strong> opened your card ${hotCard.viewCount} time${hotCard.viewCount !== 1 ? "s" : ""}. They're still thinking about it.</p>`
        : `<p>Your pipeline has ${user._count.leads} leads still in progress.</p>`;

      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: "Your pipeline while you were away",
        html: `<!DOCTYPE html><html><body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
          <p>${firstName} —</p>
          <p>You haven't been in for a week. Life happens.</p>
          ${hotSection}
          <p>Worth five minutes today?</p>
          <p style="margin:24px 0;"><a href="${appUrl}" style="background:#C4973F;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-family:system-ui,sans-serif;font-size:14px;">See what's waiting →</a></p>
          <p style="margin-top:32px;">— Luke</p>
        </body></html>`,
      }).catch(() => null);
      sent++;
    }

    if (daysSince === 14) {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: "Before you disappear",
        html: `<!DOCTYPE html><html><body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
          <p>${firstName} —</p>
          <p>You've been away for two weeks. I wanted to reach out personally.</p>
          <p>If Venn isn't working — tell me why. I read every reply and I want to know what we got wrong.</p>
          <p>If life just got busy — your pipeline is preserved. ${user._count.leads} leads are still there when you come back.</p>
          <p>No pressure either way. But I'd rather you told me than just disappeared.</p>
          <p style="margin-top:32px;">— Luke</p>
        </body></html>`,
      }).catch(() => null);
      sent++;
    }
  }

  return Response.json({ success: true, sent });
}

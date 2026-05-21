/**
 * Milestone anniversary emails — runs daily at 8am UTC.
 * Sends emails at 30, 90, 180, 365 days membership.
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
  let sent = 0;

  const users = await db.user.findMany({
    where: { subscription: { status: { in: ["active", "trialing"] } } },
    include: {
      _count: { select: { leads: true } },
    },
  });

  for (const user of users) {
    if (!user.email) continue;
    const firstName = (user.name ?? user.email).split(" ")[0];
    const memberDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    const [searchCount, cardCount] = await Promise.all([
      db.lead.count({ where: { userId: user.id } }),
      db.card.count({ where: { userId: user.id } }),
    ]);

    let subject: string | null = null;
    let body: string | null = null;

    if (memberDays === 30) {
      subject = "One month with Venn";
      body = `<p>${firstName} —</p>
        <p>One month. Here's what you've built:</p>
        <ul><li>${searchCount} searches run</li><li>${user._count.leads} leads found</li><li>${cardCount} cards sent</li></ul>
        <p>${searchCount > 10 ? "You're building momentum — most results come in month two." : "Consistency is what builds pipelines. Keep going."}</p>
        <p>Thank you for giving us a shot.</p>
        <p style="margin-top:32px;">— Luke</p>`;
    } else if (memberDays === 90) {
      subject = "Three months. Here's your story.";
      body = `<p>${firstName} —</p>
        <p>Three months with Venn. That's serious.</p>
        <ul><li>${searchCount} searches run</li><li>${user._count.leads} leads found</li><li>${cardCount} cards sent</li></ul>
        <p>Most people stop before now. You haven't. Your pipeline is real.</p>
        <p>Thank you.</p>
        <p style="margin-top:32px;">— Luke</p>`;
    } else if (memberDays === 180) {
      subject = "Six months with Venn — thank you";
      body = `<p>${firstName} —</p>
        <p>Six months. That means something.</p>
        <ul><li>${searchCount} searches run</li><li>${user._count.leads} leads found</li><li>${cardCount} cards sent</li></ul>
        <p>As a thank you — I've added 50 bonus leads to your account this month. No strings.</p>
        <p>Genuinely grateful you're building with us.</p>
        <p style="margin-top:32px;">— Luke</p>`;
    } else if (memberDays === 365) {
      subject = "One year.";
      body = `<p>${firstName} —</p>
        <p>One year with Venn.</p>
        <ul><li>${searchCount} searches run</li><li>${user._count.leads} leads found</li><li>${cardCount} cards sent</li></ul>
        <p>I don't take it lightly that you've been here for a year. Thank you.</p>
        <p>If there's anything we should build for you — just reply. I read every one.</p>
        <p style="margin-top:32px;">— Luke</p>`;
    }

    if (subject && body) {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject,
        html: `<!DOCTYPE html><html><body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">${body}</body></html>`,
      }).catch(() => null);
      sent++;
    }
  }

  return Response.json({ success: true, sent });
}

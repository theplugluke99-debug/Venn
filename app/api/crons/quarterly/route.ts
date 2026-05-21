/**
 * Quarterly progress story email — runs 1st of each quarter.
 * Compares this quarter vs last quarter for active users.
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function quarterStart(offset = 0): Date {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + offset;
  const year = now.getFullYear() + Math.floor(quarter / 4);
  const month = ((quarter % 4) * 3 + 12) % 12;
  return new Date(year, month, 1);
}

function quarterNumber(): number {
  return Math.floor(new Date().getMonth() / 3) + 1;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return Response.json({ error: "Unauthorised" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) return Response.json({ skipped: true });

  const resend = getResend();
  const thisQ = quarterStart(0);
  const lastQ = quarterStart(-1);
  let sent = 0;

  const users = await db.user.findMany({
    where: {
      subscription: { status: { in: ["active", "trialing"] } },
      createdAt: { lt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    },
  });

  for (const user of users) {
    if (!user.email) continue;
    const firstName = (user.name ?? user.email).split(" ")[0];
    const qNum = quarterNumber();

    const [thisSearches, lastSearches, thisCards, lastCards] = await Promise.all([
      db.lead.count({ where: { userId: user.id, createdAt: { gte: thisQ } } }),
      db.lead.count({ where: { userId: user.id, createdAt: { gte: lastQ, lt: thisQ } } }),
      db.card.count({ where: { userId: user.id, createdAt: { gte: thisQ } } }),
      db.card.count({ where: { userId: user.id, createdAt: { gte: lastQ, lt: thisQ } } }),
    ]);

    let storyLine: string;
    if (thisCards > lastCards && lastCards > 0) {
      const pct = Math.round(((thisCards - lastCards) / lastCards) * 100);
      storyLine = `That's ${pct}% more cards than last quarter. You're building something real.`;
    } else if (Math.abs(thisCards - lastCards) <= 2) {
      storyLine = `Consistency is underrated. Most people stop. You haven't.`;
    } else if (lastCards === 0) {
      storyLine = `Every pipeline starts somewhere. This is yours.`;
    } else {
      const warmLeads = await db.lead.count({ where: { userId: user.id, status: "complete" } });
      storyLine = `Quieter quarter than your last one. That's okay. Your pipeline still has ${warmLeads} warm leads.`;
    }

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      subject: `Your Q${qNum} story, ${firstName}`,
      html: `<!DOCTYPE html><html><body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
        <p>${firstName} —</p>
        <p>This quarter you ran <strong>${thisSearches} searches</strong> and sent <strong>${thisCards} cards</strong>.</p>
        <p>${storyLine}</p>
        <p>Reply if you need anything.</p>
        <p style="margin-top:32px;">Luke at Venn</p>
      </body></html>`,
    }).catch(() => null);
    sent++;
  }

  return Response.json({ success: true, sent });
}

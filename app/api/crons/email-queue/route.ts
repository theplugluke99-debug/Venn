/**
 * Serverless email queue processor — called by Vercel cron every 5 minutes.
 * Creates a short-lived BullMQ Worker that processes any ready email jobs
 * (jobs whose delay has elapsed) then gracefully closes.
 *
 * For local/VPS use, run: npm run email-worker instead.
 */
import { NextRequest } from "next/server";
import { Worker } from "bullmq";
import { redis } from "@/lib/queue";
import {
  sendThirtyMinuteFollowUp,
  sendDayThreeCheckIn,
} from "@/lib/email/templates/welcome";
import { db } from "@/lib/db";

function isAuthorised(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  let processed = 0;
  let errors = 0;

  const worker = new Worker(
    "emails",
    async (job) => {
      const { type, email, firstName, userId } = job.data as {
        type: string;
        email: string;
        firstName: string;
        userId: string;
      };

      if (type === "thirty_minute_followup") {
        await sendThirtyMinuteFollowUp({ email, firstName });
        processed++;
        return;
      }

      if (type === "day_three_checkin") {
        const [searchCount, cardCount] = await Promise.all([
          db.lead.count({ where: { userId } }),
          db.card.count({ where: { userId } }),
        ]);
        await sendDayThreeCheckIn({ email, firstName, searchCount, cardCount });
        processed++;
        return;
      }
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("failed", () => { errors++; });

  // Run for up to 8 seconds to process any ready jobs
  await new Promise<void>((resolve) => setTimeout(resolve, 8000));
  await worker.close();

  return Response.json({ processed, errors });
}

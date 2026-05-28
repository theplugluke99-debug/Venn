import { Worker, Job } from "bullmq";
import { redis } from "@/lib/queue";
import {
  sendThirtyMinuteFollowUp,
  sendDayThreeCheckIn,
} from "@/lib/email/templates/welcome";
import { db } from "@/lib/db";

async function processEmailJob(job: Job) {
  const { type, email, firstName, userId } = job.data as {
    type: string;
    email: string;
    firstName: string;
    userId: string;
  };

  if (type === "thirty_minute_followup") {
    await sendThirtyMinuteFollowUp({ email, firstName });
    return;
  }

  if (type === "day_three_checkin") {
    const [searchCount, cardCount] = await Promise.all([
      db.lead.count({ where: { userId } }),
      db.card.count({ where: { userId } }),
    ]);
    await sendDayThreeCheckIn({ email, firstName, searchCount, cardCount });
    return;
  }

  console.warn(`[email-worker] Unknown job type: ${type}`);
}

export const emailWorker = new Worker("emails", processEmailJob, {
  connection: redis,
  concurrency: 5,
});

emailWorker.on("failed", (job, err) => {
  console.error(`[email-worker] Job ${job?.id} (${job?.data?.type}) failed:`, err.message);
});

emailWorker.on("completed", (job) => {
  console.log(`[email-worker] Job ${job.id} (${job.data?.type}) completed`);
});

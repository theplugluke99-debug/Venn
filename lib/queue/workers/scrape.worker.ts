import { Worker, Job } from "bullmq";
import { redis } from "@/lib/queue";
import { processLeadJob } from "@/lib/queue/processor";
import { db } from "@/lib/db";

export const scrapeWorker = new Worker(
  "scrape",
  async (job: Job) => {
    return processLeadJob(job.data, (pct) => job.updateProgress(pct));
  },
  { connection: redis, concurrency: 3 }
);

scrapeWorker.on("failed", async (job, err) => {
  if (job) {
    await db.lead
      .update({ where: { id: job.data.leadId }, data: { status: "failed" } })
      .catch(() => null);
  }
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

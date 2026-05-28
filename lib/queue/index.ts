import { Queue } from "bullmq";
import IORedis from "ioredis";
import { config } from "@/lib/config";

export const redis = new IORedis(config.redis.url, {
  maxRetriesPerRequest: null,
});

export const scrapeQueue = new Queue("scrape", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const emailQueue = new Queue("emails", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 200,
    removeOnFail: 100,
  },
});

export async function addEmailJob(
  type: string,
  data: { email: string; firstName: string; userId: string; plan?: string },
  delayMs = 0
) {
  return emailQueue.add(type, { type, ...data }, { delay: delayMs });
}

export async function addScrapeJob(data: {
  leadId: string;
  businessName: string;
  location: string;
  niche: string;
  website?: string;
  userId: string;
  placeId?: string;
}) {
  const job = await scrapeQueue.add("scrape-lead", data, {
    jobId: `scrape-${data.leadId}`,
  });
  return job;
}

export async function getJobStatus(jobId: string) {
  const job = await scrapeQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  const progress = job.progress as number ?? 0;

  return { jobId, state, progress, data: job.data, returnvalue: job.returnvalue };
}

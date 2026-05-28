/**
 * Serverless enrichment queue processor — called by Vercel cron every 5 minutes.
 * Creates a short-lived BullMQ Worker that processes any ready enrichment jobs
 * then gracefully closes after 25 seconds.
 *
 * Enrichment uses Playwright internally — on Vercel this gracefully fails per-module;
 * Companies House (fetch only) and pattern-based detection still run normally.
 * For full Playwright enrichment, run the persistent worker on a VPS.
 */
import { NextRequest } from "next/server";
import { Worker } from "bullmq";
import { redis } from "@/lib/queue";
import { enrichLead } from "@/lib/enrichment";

function isAuthorised(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  let processed = 0;
  let errors = 0;

  const worker = new Worker(
    "enrichment",
    async (job) => {
      const { leadId } = job.data as { leadId: string };
      await enrichLead(leadId);
      processed++;
    },
    { connection: redis, concurrency: 2 }
  );

  worker.on("failed", () => { errors++; });

  // Run for 25 seconds — enrichment takes longer than email jobs
  await new Promise<void>((resolve) => setTimeout(resolve, 25000));
  await worker.close();

  return Response.json({ processed, errors });
}

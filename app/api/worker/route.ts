/**
 * Serverless worker endpoint — called by Vercel cron every minute.
 * Picks up the next pending lead and processes it using the shared processor.
 *
 * On Vercel, Playwright-based website auditing fails gracefully (caught internally).
 * Google Places + Claude AI intelligence generation work normally.
 *
 * For full website auditing support, run the persistent worker on a VPS:
 *   npm run worker
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { processLeadJob } from "@/lib/queue/processor";
import { scrapeQueue } from "@/lib/queue";

// Vercel cron passes a secret header to prevent public invocation
function isAuthorised(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // no secret configured — allow (dev)
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Try to get a specific jobId from the body, or find the next pending lead
  let specificLeadId: string | null = null;
  try {
    const body = await request.json();
    specificLeadId = body.leadId ?? null;
  } catch {
    // empty body is fine — cron fires with no body
  }

  // Find the lead to process
  const lead = specificLeadId
    ? await db.lead.findFirst({ where: { id: specificLeadId, status: "pending" } })
    : await db.lead.findFirst({ where: { status: "pending" }, orderBy: { createdAt: "asc" } });

  if (!lead) {
    return Response.json({ success: true, message: "no pending leads" });
  }

  // Also look up the BullMQ job to get placeId and other enriched data if available
  let placeId: string | undefined;
  if (lead.jobId) {
    try {
      const job = await scrapeQueue.getJob(lead.jobId);
      placeId = job?.data?.placeId;
    } catch {
      // BullMQ job lookup is non-critical
    }
  }

  try {
    const result = await processLeadJob({
      leadId: lead.id,
      businessName: lead.businessName,
      location: lead.location,
      niche: lead.niche,
      website: lead.website ?? undefined,
      userId: lead.userId,
      placeId: lead.googlePlaceId ?? placeId,
    });

    return Response.json({ success: true, leadId: result.leadId });
  } catch (err) {
    console.error("[/api/worker] Processing failed:", err);
    await db.lead
      .update({ where: { id: lead.id }, data: { status: "failed" } })
      .catch(() => null);

    return Response.json(
      { success: false, leadId: lead.id, error: String(err) },
      { status: 500 }
    );
  }
}

// GET endpoint so the cron request works (Vercel crons send GET by default)
export async function GET(request: NextRequest) {
  return POST(request);
}

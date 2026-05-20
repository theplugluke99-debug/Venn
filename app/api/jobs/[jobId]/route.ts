import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getJobStatus } from "@/lib/queue";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { jobId } = await params;
    const status = await getJobStatus(jobId);

    if (!status) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const leadStatus =
      status.state === "completed"
        ? "complete"
        : status.state === "failed"
        ? "failed"
        : status.state === "active"
        ? status.progress > 35
          ? "enriching"
          : "scraping"
        : "pending";

    return Response.json({
      jobId,
      status: leadStatus,
      progress: status.progress,
      leadId: status.returnvalue?.leadId,
    });
  } catch (err) {
    console.error("[GET /api/jobs/[jobId]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

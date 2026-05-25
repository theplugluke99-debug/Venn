import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getReportBySlug, updateClientReport, recordReportView } from "@/lib/db/queries/clientReports";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const report = await getReportBySlug(slug);
    if (!report) return Response.json({ error: "Not found" }, { status: 404 });

    // Public read — record view
    await recordReportView(slug).catch(console.error);
    return Response.json({ report });
  } catch (err) {
    console.error("[GET /api/reports/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const report = await getReportBySlug(slug);
    if (!report || report.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json() as { status?: string; sentAt?: string };
    const update: Record<string, unknown> = {};
    if (body.status) update.status = body.status;
    if (body.status === "sent" && !report.sentAt) update.sentAt = new Date();

    const updated = await updateClientReport(report.id, update);
    return Response.json({ report: updated });
  } catch (err) {
    console.error("[PATCH /api/reports/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

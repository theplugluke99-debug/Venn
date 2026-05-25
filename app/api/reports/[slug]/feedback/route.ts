import { NextRequest } from "next/server";
import { getReportBySlug } from "@/lib/db/queries/clientReports";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const report = await getReportBySlug(slug);
    if (!report) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await request.json() as { rating: number; comment?: string };
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return Response.json({ error: "rating 1-5 required" }, { status: 400 });
    }

    await db.clientCheckIn.create({
      data: {
        clientId: report.clientId,
        userId: report.userId,
        type: "report_feedback",
        notes: body.comment ?? null,
        sentiment:
          body.rating >= 4 ? "positive" : body.rating === 3 ? "neutral" : "concerned",
        completedAt: new Date(),
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/reports/[slug]/feedback]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

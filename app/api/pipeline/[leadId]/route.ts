import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";

const VALID_STAGES = ["new", "contacted", "replied", "meeting", "won"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { leadId } = await params;
    const body = await request.json();
    const { pipelineStage } = body as { pipelineStage: string };

    if (!VALID_STAGES.includes(pipelineStage)) {
      return Response.json({ error: "Invalid pipeline stage" }, { status: 400 });
    }

    const lead = await db.lead.findFirst({
      where: { id: leadId, userId: user.id },
    });
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const updated = await db.lead.update({
      where: { id: leadId },
      data: { pipelineStage },
    });

    return Response.json({ lead: updated });
  } catch (err) {
    console.error("[PUT /api/pipeline/[leadId]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const { slug } = await params;
    const proposal = await db.proposal.findUnique({ where: { slug } });

    if (!proposal || proposal.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const { questionId, answer } = body as { questionId: string; answer: string };

    if (!questionId || !answer?.trim()) {
      return Response.json({ error: "questionId and answer are required" }, { status: 400 });
    }

    const updated = await db.proposalQuestion.update({
      where: { id: questionId },
      data: { answer: answer.trim(), answeredAt: new Date() },
    });

    return Response.json({ question: updated });
  } catch (err) {
    console.error("[POST /api/proposals/[slug]/answer]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

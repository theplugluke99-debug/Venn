import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { upsertDiscoveryAnswer } from "@/lib/db/queries/closeSessions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await db.closeSession.findUnique({ where: { slug } });
    if (!session) return Response.json({ error: "Not found" }, { status: 404 });

    if (session.discoveryCompletedAt) {
      return Response.json({ error: "Session already completed" }, { status: 400 });
    }

    const body = await request.json();
    const { questionIndex, questionText, answer } = body as {
      questionIndex: number;
      questionText: string;
      answer: string;
    };

    if (typeof questionIndex !== "number" || !answer?.trim()) {
      return Response.json({ error: "questionIndex and answer required" }, { status: 400 });
    }

    const record = await upsertDiscoveryAnswer(
      session.id,
      questionIndex,
      questionText ?? "",
      answer.trim()
    );

    return Response.json({ answer: record });
  } catch (err) {
    console.error("[POST /api/close/[slug]/answer]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

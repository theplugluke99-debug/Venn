import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await getUserByClerkId(clerkId);
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const step = await db.sequenceStep.findUnique({
    where: { id },
    include: { sequence: { select: { userId: true } } },
  });

  if (!step || step.sequence.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.sequenceStep.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });

  return NextResponse.json({ step: updated });
}

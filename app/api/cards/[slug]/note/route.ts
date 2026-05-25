import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const { slug } = await params;
    const body = await request.json();
    const { personalNote } = body;

    const card = await db.card.findUnique({ where: { slug } });
    if (!card || card.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await db.card.update({ where: { slug }, data: { personalNote: personalNote ?? null } });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/cards/[slug]/note]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

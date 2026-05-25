import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const proposal = await db.proposal.findUnique({ where: { slug } });
    if (!proposal) return Response.json({ error: "Not found" }, { status: 404 });

    await db.proposal.update({
      where: { slug },
      data: { status: "accepted", acceptedAt: new Date() },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/proposals/[slug]/accept]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { getCardBySlug, incrementCardViewCount } from "@/lib/db/queries/cards";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const card = await getCardBySlug(slug);

    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    await incrementCardViewCount(slug);

    return Response.json({ card });
  } catch (err) {
    console.error("[GET /api/cards/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

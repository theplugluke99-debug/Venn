import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCardsByUser } from "@/lib/db/queries/cards";
import { buildCard } from "@/lib/cards";
import { canUseFeature } from "@/lib/stripe/gates";

export async function GET(_request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const cards = await getCardsByUser(user.id);
    return Response.json({ cards });
  } catch (err) {
    console.error("[GET /api/cards]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { leadId } = body;
    if (!leadId) {
      return Response.json({ error: "leadId is required" }, { status: 400 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const allowed = await canUseFeature(user.id, "cards");
    if (!allowed) {
      return Response.json(
        { error: "upgrade_required", feature: "cards" },
        { status: 403 }
      );
    }

    const card = await buildCard(leadId, user.id);
    return Response.json({ card }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/cards]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

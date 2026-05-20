import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, upsertCardIdentity, getCardIdentity } from "@/lib/db/queries/users";

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

    const identity = await getCardIdentity(user.id);
    return Response.json({ identity });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const identity = await upsertCardIdentity(user.id, body);

    return Response.json({ identity });
  } catch (err) {
    console.error("[POST /api/settings]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

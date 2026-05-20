import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadById, deleteLead } from "@/lib/db/queries/leads";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const lead = await getLeadById(id, user.id);
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    return Response.json({ lead });
  } catch (err) {
    console.error("[GET /api/leads/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await deleteLead(id, user.id);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/leads/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

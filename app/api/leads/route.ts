import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const status = searchParams.get("status") as string | null;

    const leads = await getLeadsByUser(user.id, {
      status: status as Parameters<typeof getLeadsByUser>[1] extends { status?: infer S } ? S : never,
      limit,
      offset,
    });
    const total = await getLeadCountByUser(user.id);

    return Response.json({ leads, total, limit, offset });
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

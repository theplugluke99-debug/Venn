import { NextRequest } from "next/server";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { authenticateRequest } from "@/lib/auth/apiAuth";
import type { LeadStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const status = searchParams.get("status") as LeadStatus | null;

    const leads = await getLeadsByUser(authResult.userId, {
      status: status ?? undefined,
      limit,
      offset,
    });
    const total = await getLeadCountByUser(authResult.userId);

    return Response.json({ leads, total, limit, offset });
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

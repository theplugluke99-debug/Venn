import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { deleteServicePackage } from "@/lib/db/queries/servicePackages";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    const { id } = await params;
    await deleteServicePackage(id, user.id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/service-packages/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

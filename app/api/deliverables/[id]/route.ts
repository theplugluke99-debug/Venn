import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { updateDeliverable, deleteDeliverable } from "@/lib/db/queries/deliverables";
import { logClientActivity } from "@/lib/db/queries/clients";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const existing = await db.deliverable.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json() as {
      title?: string;
      status?: string;
      priority?: string;
      dueDate?: string | null;
      completedAt?: string | null;
      notes?: string;
      category?: string;
    };

    // Auto-set completedAt when marking complete
    const updateData: Record<string, unknown> = { ...body };
    if (body.status === "complete" && !existing.completedAt) {
      updateData.completedAt = new Date();
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    const deliverable = await updateDeliverable(id, updateData);

    if (body.status === "complete") {
      await logClientActivity({
        clientId: existing.clientId,
        userId: user.id,
        type: "deliverable_complete",
        title: `Deliverable completed: ${existing.title}`,
      }).catch(console.error);
    }

    return Response.json({ deliverable });
  } catch (err) {
    console.error("[PATCH /api/deliverables/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const existing = await db.deliverable.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await deleteDeliverable(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/deliverables/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getDeliverablesByUser, createDeliverable } from "@/lib/db/queries/deliverables";
import { logClientActivity } from "@/lib/db/queries/clients";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const deliverables = await getDeliverablesByUser(user.id);
    return Response.json({ deliverables });
  } catch (err) {
    console.error("[GET /api/deliverables]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const body = await request.json() as {
      clientId: string;
      title: string;
      description?: string;
      category: string;
      status?: string;
      priority?: string;
      dueDate?: string;
      notes?: string;
    };

    if (!body.clientId || !body.title || !body.category) {
      return Response.json({ error: "clientId, title, category required" }, { status: 400 });
    }

    const deliverable = await createDeliverable({
      clientId: body.clientId,
      userId: user.id,
      title: body.title,
      description: body.description,
      category: body.category,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      notes: body.notes,
    });

    await logClientActivity({
      clientId: body.clientId,
      userId: user.id,
      type: "deliverable_added",
      title: `Deliverable added: ${body.title}`,
    }).catch(console.error);

    return Response.json({ deliverable }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/deliverables]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

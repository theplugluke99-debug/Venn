import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { logClientActivity } from "@/lib/db/queries/clients";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const body = await request.json() as {
      clientId: string;
      type: string;
      notes?: string;
      sentiment?: string;
      nextAction?: string;
    };

    if (!body.clientId || !body.type) {
      return Response.json({ error: "clientId and type required" }, { status: 400 });
    }

    const client = await db.client.findUnique({ where: { id: body.clientId } });
    if (!client || client.userId !== user.id) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    const checkIn = await db.clientCheckIn.create({
      data: {
        clientId: body.clientId,
        userId: user.id,
        type: body.type,
        notes: body.notes,
        sentiment: body.sentiment,
        nextAction: body.nextAction,
        completedAt: new Date(),
      },
    });

    await logClientActivity({
      clientId: body.clientId,
      userId: user.id,
      type: "checkin",
      title: `Check-in logged (${body.type})`,
      description: body.notes,
    }).catch(console.error);

    return Response.json({ checkIn }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/checkins]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

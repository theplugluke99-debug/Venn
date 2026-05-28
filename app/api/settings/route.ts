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

    const raw = await request.json() as Record<string, unknown>;

    // Coerce string-encoded booleans and numbers from the form
    const body = {
      ...raw,
      reportAutoSend: raw.reportAutoSend === "true" || raw.reportAutoSend === true,
      healthAlertThreshold: raw.healthAlertThreshold ? parseInt(String(raw.healthAlertThreshold), 10) : undefined,
      deliverableReminderDays: raw.deliverableReminderDays ? parseInt(String(raw.deliverableReminderDays), 10) : undefined,
      useColdCall: raw.useColdCall === "true" || raw.useColdCall === true,
      useVideoMessage: raw.useVideoMessage === "true" || raw.useVideoMessage === true,
    };

    const identity = await upsertCardIdentity(user.id, body);

    return Response.json({ identity });
  } catch (err) {
    console.error("[POST /api/settings]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

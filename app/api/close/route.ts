import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCloseSessionsByUser, createCloseSession } from "@/lib/db/queries/closeSessions";
import { canUseFeature } from "@/lib/stripe/gates";
import { generateCloseQuestions } from "@/lib/intelligence";
import { db } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    const sessions = await getCloseSessionsByUser(user.id);
    return Response.json({ sessions });
  } catch (err) {
    console.error("[GET /api/close]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    if (!await canUseFeature(user.id, "close_session")) {
      return Response.json({ error: "Venn Close requires a Growth plan or above" }, { status: 403 });
    }

    const body = await request.json();
    const { leadId, sentChannel } = body as { leadId: string; sentChannel?: string };
    if (!leadId) return Response.json({ error: "leadId required" }, { status: 400 });

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.userId !== user.id) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const cardIdentity = user.cardIdentity;
    const result = await generateCloseQuestions(lead, cardIdentity);

    const slug = nanoid(8);
    const session = await createCloseSession({
      slug,
      leadId,
      userId: user.id,
      questions: result.questions as unknown as import("@prisma/client").Prisma.InputJsonValue,
      sentMessage: result.sentMessage,
      sentChannel: sentChannel ?? "whatsapp",
    });

    const closeUrl = `${BASE_URL}/close/${slug}`;
    return Response.json({
      session,
      slug,
      closeUrl,
      sentMessage: result.sentMessage,
      responseTime: result.responseTime,
      questions: result.questions,
    }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/close]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { generateArsenal } from "@/lib/intelligence";
import { config } from "@/lib/config";
import { Prisma } from "@prisma/client";

function canUseArsenal(plan: string) {
  return plan === "growth" || plan === "pro" || plan === "enterprise" || plan === "solopreneur";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const { leadId } = await params;
  const user = await getUserByClerkId(clerkId);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const arsenal = await db.outreachArsenal.findUnique({ where: { leadId } });
  if (!arsenal) return Response.json({ error: "Not found" }, { status: 404 });
  if (arsenal.userId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

  return Response.json(arsenal);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const { leadId } = await params;
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const plan = user.subscription?.plan ?? "starter";
    if (!canUseArsenal(plan)) {
      return Response.json({ error: "Arsenal is available on Growth plan and above" }, { status: 403 });
    }

    const lead = await db.lead.findFirst({
      where: { id: leadId, userId: user.id },
      include: { card: true },
    });
    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });

    const cardIdentity = user.cardIdentity;
    const cardUrl = lead.card?.slug
      ? `${config.app.url}/card/${lead.card.slug}`
      : `${config.app.url}/search`;

    const arsenalData = await generateArsenal(lead, cardIdentity ?? {}, cardUrl);

    const record = await db.outreachArsenal.upsert({
      where: { leadId },
      create: {
        leadId,
        userId: user.id,
        voiceNoteScript: arsenalData.voiceNoteScript,
        coldCallScript: arsenalData.coldCallScript as unknown as Prisma.InputJsonValue,
        linkedinNote: arsenalData.linkedinNote,
        linkedinFollowUp1: arsenalData.linkedinFollowUp1,
        linkedinFollowUp2: arsenalData.linkedinFollowUp2,
        emailSubject1: arsenalData.emailSubject1,
        emailBody1: arsenalData.emailBody1,
        emailSubject2: arsenalData.emailSubject2,
        emailBody2: arsenalData.emailBody2,
        emailSubject3: arsenalData.emailSubject3,
        emailBody3: arsenalData.emailBody3,
        videoScript: arsenalData.videoScript as unknown as Prisma.InputJsonValue,
        channelStatus: {} as Prisma.InputJsonValue,
      },
      update: {
        voiceNoteScript: arsenalData.voiceNoteScript,
        coldCallScript: arsenalData.coldCallScript as unknown as Prisma.InputJsonValue,
        linkedinNote: arsenalData.linkedinNote,
        linkedinFollowUp1: arsenalData.linkedinFollowUp1,
        linkedinFollowUp2: arsenalData.linkedinFollowUp2,
        emailSubject1: arsenalData.emailSubject1,
        emailBody1: arsenalData.emailBody1,
        emailSubject2: arsenalData.emailSubject2,
        emailBody2: arsenalData.emailBody2,
        emailSubject3: arsenalData.emailSubject3,
        emailBody3: arsenalData.emailBody3,
        videoScript: arsenalData.videoScript as unknown as Prisma.InputJsonValue,
      },
    });

    return Response.json(record);
  } catch (err) {
    console.error("[POST /api/arsenal]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const { leadId } = await params;
  const user = await getUserByClerkId(clerkId);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const body = await request.json() as { channelStatus: Record<string, unknown> };

  const record = await db.outreachArsenal.update({
    where: { leadId },
    data: { channelStatus: body.channelStatus as Prisma.InputJsonValue },
  });

  return Response.json(record);
}

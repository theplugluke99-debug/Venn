import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getProposalsByUser, createProposal } from "@/lib/db/queries/proposals";
import { getServicePackagesByUser } from "@/lib/db/queries/servicePackages";
import { db } from "@/lib/db";
import { generateProposalContent } from "@/lib/intelligence";
import { canUseFeature, type GatedFeature } from "@/lib/stripe/gates";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const proposals = await getProposalsByUser(user.id);
    return Response.json({ proposals });
  } catch (err) {
    console.error("[GET /api/proposals]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    if (!await canUseFeature(user.id, "proposals" as GatedFeature)) {
      return Response.json({ error: "Proposals require a Pro plan" }, { status: 403 });
    }

    const body = await request.json();
    const { leadId, depositAmount } = body as { leadId: string; depositAmount?: number };

    if (!leadId) return Response.json({ error: "leadId required" }, { status: 400 });

    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: { card: true },
    });

    if (!lead || lead.userId !== user.id) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const cardIdentity = user.cardIdentity;
    const packages = await getServicePackagesByUser(user.id);

    const content = await generateProposalContent(lead, cardIdentity, packages);

    const slug = nanoid(10);
    const proposal = await createProposal({
      slug,
      leadId,
      userId: user.id,
      title: content.title,
      threadSection: content.threadSection,
      currentState: content.currentState,
      visionSection: content.visionSection,
      planSection: content.planSection as unknown as import("@prisma/client").Prisma.InputJsonValue,
      beforeAfter: content.beforeAfter as unknown as import("@prisma/client").Prisma.InputJsonValue,
      investmentContext: content.investmentContext,
      closingSection: content.closingSection,
      depositAmount: depositAmount ?? undefined,
    });

    return Response.json({ proposal }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/proposals]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

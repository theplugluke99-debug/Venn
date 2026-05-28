import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { db } from "@/lib/db";
import { addEnrichmentJob } from "@/lib/queue";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const { leadId } = await params;
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const lead = await db.lead.findFirst({
      where: { id: leadId, userId: user.id },
      select: {
        ownerEmail: true,
        ownerEmailConfidence: true,
        ownerEmailSource: true,
        ownerEmailVerified: true,
        linkedInUrl: true,
        linkedInConfidence: true,
        ownerName: true,
        ownerNameSource: true,
        instagramHandle: true,
        instagramFollowers: true,
        instagramPostCount: true,
        instagramLastPost: true,
        instagramBio: true,
        companiesHouseNumber: true,
        companyStatus: true,
        sicCode: true,
        incorporationDate: true,
        directorName: true,
        bookingPlatform: true,
        emailPlatform: true,
        chatPlatform: true,
        reviewPlatform: true,
        hasLiveChat: true,
        hasCookieBanner: true,
        hasPrivacyPolicy: true,
        techStack: true,
        enrichmentRunAt: true,
        enrichmentSources: true,
        enrichmentScore: true,
      },
    });

    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });
    return Response.json(lead);
  } catch (err) {
    console.error("[GET /api/enrichment]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
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

    const lead = await db.lead.findFirst({ where: { id: leadId, userId: user.id } });
    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });

    await addEnrichmentJob(leadId);
    return Response.json({ status: "queued", leadId });
  } catch (err) {
    console.error("[POST /api/enrichment]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

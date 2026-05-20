import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { createLead } from "@/lib/db/queries/leads";
import { addScrapeJob } from "@/lib/queue";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { niche, location, businessName } = body;

    if (!niche || !location || !businessName) {
      return Response.json(
        { error: "niche, location, and businessName are required" },
        { status: 400 }
      );
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const lead = await createLead({
      userId: user.id,
      businessName: businessName.trim(),
      location: location.trim(),
      niche: niche.trim(),
      website: body.website?.trim(),
    });

    const job = await addScrapeJob({
      leadId: lead.id,
      businessName: lead.businessName,
      location: lead.location,
      niche: lead.niche,
      website: lead.website ?? undefined,
      userId: user.id,
    });

    await db.lead.update({
      where: { id: lead.id },
      data: { jobId: job.id },
    });

    return Response.json({ leadId: lead.id, jobId: job.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/search]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

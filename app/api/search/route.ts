import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createLead } from "@/lib/db/queries/leads";
import { addScrapeJob } from "@/lib/queue";
import { authenticateRequest } from "@/lib/auth/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult) {
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

    const lead = await createLead({
      userId: authResult.userId,
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
      userId: authResult.userId,
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

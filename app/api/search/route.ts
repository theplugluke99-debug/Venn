import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { createLead } from "@/lib/db/queries/leads";
import { addScrapeJob } from "@/lib/queue";
import { searchBusinessesByNiche } from "@/lib/scraper/google";
import { getMonthlyLeadCount, getMonthlyLeadLimit } from "@/lib/stripe/gates";

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

    const body = await request.json();
    const { niche, location, limit = 10 } = body as {
      niche: string;
      location: string;
      limit?: number;
    };

    if (!niche?.trim() || !location?.trim()) {
      return Response.json(
        { error: "niche and location are required" },
        { status: 400 }
      );
    }

    const clampedLimit = Math.min(Math.max(Number(limit) || 10, 1), 20);

    // Monthly lead limit check
    const [used, monthLimit] = await Promise.all([
      getMonthlyLeadCount(user.id),
      getMonthlyLeadLimit(user.id),
    ]);
    if (used >= monthLimit) {
      return Response.json(
        { error: "upgrade_required", feature: "search", used, limit: monthLimit },
        { status: 403 }
      );
    }

    // Discover businesses via Google Places text search
    const businesses = await searchBusinessesByNiche(
      niche.trim(),
      location.trim(),
      clampedLimit
    );

    if (businesses.length === 0) {
      return Response.json(
        { error: "No businesses found for that niche and location. Try a broader search." },
        { status: 404 }
      );
    }

    // Create a lead + queue a scrape job for each business
    const results = await Promise.all(
      businesses.map(async (biz) => {
        const lead = await createLead({
          userId: user.id,
          businessName: biz.businessName,
          location: biz.address,
          niche: niche.trim(),
        });

        // Pre-fill basic Google data so UI can show something immediately
        if (biz.rating || biz.reviewCount) {
          await db.lead.update({
            where: { id: lead.id },
            data: {
              googlePlaceId: biz.placeId,
              googleRating: biz.rating ?? null,
              reviewCount: biz.reviewCount ?? null,
            },
          });
        }

        const job = await addScrapeJob({
          leadId: lead.id,
          businessName: biz.businessName,
          location: biz.address,
          niche: niche.trim(),
          userId: user.id,
          placeId: biz.placeId,
        });

        await db.lead.update({
          where: { id: lead.id },
          data: { jobId: job.id },
        });

        return {
          leadId: lead.id,
          jobId: job.id!,
          businessName: biz.businessName,
          address: biz.address,
        };
      })
    );

    return Response.json(
      {
        jobIds: results.map((r) => r.jobId),
        leadIds: results.map((r) => r.leadId),
        businesses: results.map((r) => ({
          leadId: r.leadId,
          jobId: r.jobId,
          businessName: r.businessName,
          address: r.address,
        })),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/search]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { Worker, Job } from "bullmq";
import { redis } from "@/lib/queue";
import { scrapeGoogleBusiness } from "@/lib/scraper/google";
import { scrapeWebsite } from "@/lib/scraper/website";
import { generateIntelligence } from "@/lib/intelligence";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const scrapeWorker = new Worker(
  "scrape",
  async (job: Job) => {
    const { leadId, businessName, location, niche, website, userId } = job.data;

    await db.lead.update({ where: { id: leadId }, data: { status: "scraping" } });
    await job.updateProgress(10);

    const googleData = await scrapeGoogleBusiness(businessName, location).catch(() => null);
    await job.updateProgress(35);

    const websiteUrl = website || googleData?.website;
    const websiteAudit = websiteUrl
      ? await scrapeWebsite(websiteUrl).catch(() => null)
      : null;
    await job.updateProgress(60);

    await db.lead.update({
      where: { id: leadId },
      data: {
        status: "enriching",
        googlePlaceId: googleData?.googlePlaceId,
        googleRating: googleData?.googleRating,
        reviewCount: googleData?.reviewCount,
        reviewSummary: googleData?.reviewSummary
          ? (googleData.reviewSummary as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        website: websiteUrl,
        phone: googleData?.phone,
        websiteAudit: websiteAudit
          ? (websiteAudit as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { cardIdentity: true },
    });

    const intelligence = await generateIntelligence(
      { businessName, niche, location, googleData, websiteAudit },
      user?.cardIdentity
    );

    await db.lead.update({
      where: { id: leadId },
      data: {
        status: "complete",
        intentScore: intelligence.intentScore,
        intentSignals: intelligence.intentSignals as Prisma.InputJsonValue,
        businessBio: intelligence.businessBio,
        observations: intelligence.observations as unknown as Prisma.InputJsonValue,
        openingLine: intelligence.openingLine,
        recommendedChannel: intelligence.recommendedChannel,
        suggestedAngle: intelligence.suggestedAngle,
      },
    });

    await job.updateProgress(100);
    return { leadId, status: "complete" };
  },
  { connection: redis, concurrency: 3 }
);

scrapeWorker.on("failed", async (job, err) => {
  if (job) {
    await db.lead
      .update({ where: { id: job.data.leadId }, data: { status: "failed" } })
      .catch(() => null);
  }
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

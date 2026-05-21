import { Worker, Job } from "bullmq";
import { redis } from "@/lib/queue";
import { scrapeGoogleBusiness } from "@/lib/scraper/google";
import { scrapeWebsite } from "@/lib/scraper/website";
import { findEmail } from "@/lib/scraper/email";
import { generateIntelligence } from "@/lib/intelligence";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

function parseDayOffset(scheduledAt: string): Date {
  const match = scheduledAt.match(/day\s+(\d+)/i);
  const days = match ? parseInt(match[1], 10) : 0;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export const scrapeWorker = new Worker(
  "scrape",
  async (job: Job) => {
    const { leadId, businessName, location, niche, website, userId, placeId } = job.data;

    await db.lead.update({ where: { id: leadId }, data: { status: "scraping" } });
    await job.updateProgress(10);

    const googleData = await scrapeGoogleBusiness(businessName, location, placeId).catch(() => null);
    await job.updateProgress(35);

    const websiteUrl = website || googleData?.website;
    const [websiteAudit, emailFound] = await Promise.all([
      websiteUrl ? scrapeWebsite(websiteUrl).catch(() => null) : null,
      websiteUrl ? findEmail(websiteUrl).catch(() => null) : null,
    ]);
    await job.updateProgress(55);

    // Save partial data immediately so it's preserved even if intelligence fails
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
        email: emailFound ?? undefined,
        websiteAudit: websiteAudit
          ? (websiteAudit as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    await job.updateProgress(60);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { cardIdentity: true },
    });

    const intelligence = await generateIntelligence(
      { businessName, niche, location, googleData, websiteAudit },
      user?.cardIdentity
    );

    await job.updateProgress(80);

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

    // Save sequence if generated
    if (intelligence.sequence && intelligence.sequence.length > 0) {
      try {
        await db.sequence.create({
          data: {
            leadId,
            userId,
            nextActionAt: parseDayOffset(intelligence.sequence[0]?.scheduledAt ?? "day 0"),
            steps: {
              create: intelligence.sequence.map((step) => ({
                stepNumber: step.stepNumber,
                channel: step.channel,
                subject: step.subject ?? null,
                message: step.message,
                angle: step.angle,
                scheduledAt: parseDayOffset(step.scheduledAt),
              })),
            },
          },
        });
      } catch (err) {
        console.error(`[Worker] Sequence save failed for ${leadId}:`, err);
      }
    }

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

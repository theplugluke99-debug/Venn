/**
 * Core job processing logic — shared between the persistent BullMQ worker
 * (local / VPS) and the Vercel-compatible /api/worker serverless route.
 */
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

interface JobData {
  leadId: string;
  businessName: string;
  location: string;
  niche: string;
  website?: string;
  userId: string;
  placeId?: string;
}

type ProgressFn = (pct: number) => Promise<void>;

const noop: ProgressFn = async () => {};

export async function processLeadJob(
  data: JobData,
  updateProgress: ProgressFn = noop
): Promise<{ leadId: string; status: string }> {
  const { leadId, businessName, location, niche, website, userId, placeId } = data;

  await db.lead.update({ where: { id: leadId }, data: { status: "scraping" } });
  await updateProgress(10);

  const googleData = await scrapeGoogleBusiness(businessName, location, placeId).catch(() => null);
  await updateProgress(35);

  const websiteUrl = website || googleData?.website;

  // Website scraping and email finding use Playwright — gracefully skipped on Vercel
  const [websiteAudit, emailFound] = await Promise.all([
    websiteUrl ? scrapeWebsite(websiteUrl).catch(() => null) : null,
    websiteUrl ? findEmail(websiteUrl).catch(() => null) : null,
  ]);
  await updateProgress(55);

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

  await updateProgress(60);

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { cardIdentity: true },
  });

  const intelligence = await generateIntelligence(
    { businessName, niche, location, googleData, websiteAudit },
    user?.cardIdentity
  );

  await updateProgress(80);

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
      console.error(`[Processor] Sequence save failed for ${leadId}:`, err);
    }
  }

  await updateProgress(100);
  return { leadId, status: "complete" };
}

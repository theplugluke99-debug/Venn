import { db } from "@/lib/db";
import { findOwnerEmail } from "./email";
import { findLinkedInProfile } from "./linkedin";
import { scrapeInstagram } from "./instagram";
import { lookupCompaniesHouse } from "./companies-house";
import { extendedTechScan } from "./technographics";
import { Prisma } from "@prisma/client";

function calculateEnrichmentScore(data: Record<string, unknown>): number {
  let score = 0;
  if (data.ownerEmail) score += 25;
  if (data.ownerEmailVerified) score += 10;
  if (data.linkedInUrl) score += 20;
  if (data.instagramHandle) score += 15;
  if (data.companiesHouseNumber) score += 15;
  if (data.ownerName) score += 10;
  if (data.bookingPlatform) score += 5;
  return Math.min(score, 100);
}

export async function enrichLead(leadId: string): Promise<void> {
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.website) return;

  const [emailResult, linkedInResult, instagramResult, companiesHouseResult, techResult] =
    await Promise.allSettled([
      findOwnerEmail(lead),
      findLinkedInProfile(lead),
      scrapeInstagram(lead),
      lookupCompaniesHouse(lead),
      extendedTechScan(lead),
    ]);

  const enrichmentData: Record<string, unknown> = {
    enrichmentRunAt: new Date(),
    enrichmentSources: [] as string[],
  };

  if (emailResult.status === "fulfilled" && emailResult.value) {
    Object.assign(enrichmentData, emailResult.value);
    (enrichmentData.enrichmentSources as string[]).push("email");
  }

  if (linkedInResult.status === "fulfilled" && linkedInResult.value) {
    Object.assign(enrichmentData, linkedInResult.value);
    (enrichmentData.enrichmentSources as string[]).push("linkedin");
  }

  if (instagramResult.status === "fulfilled" && instagramResult.value) {
    Object.assign(enrichmentData, instagramResult.value);
    (enrichmentData.enrichmentSources as string[]).push("instagram");
  }

  if (companiesHouseResult.status === "fulfilled" && companiesHouseResult.value) {
    Object.assign(enrichmentData, companiesHouseResult.value);
    (enrichmentData.enrichmentSources as string[]).push("companies_house");
  }

  if (techResult.status === "fulfilled" && techResult.value) {
    const tech = techResult.value;
    Object.assign(enrichmentData, {
      bookingPlatform: tech.bookingPlatform,
      emailPlatform: tech.emailPlatform,
      chatPlatform: tech.chatPlatform,
      reviewPlatform: tech.reviewPlatform,
      hasLiveChat: tech.hasLiveChat,
      hasCookieBanner: tech.hasCookieBanner,
      hasPrivacyPolicy: tech.hasPrivacyPolicy,
      techStack: tech.techStack as Prisma.InputJsonValue,
    });
    (enrichmentData.enrichmentSources as string[]).push("technographics");
  }

  enrichmentData.enrichmentScore = calculateEnrichmentScore(enrichmentData);
  enrichmentData.enrichmentSources = enrichmentData.enrichmentSources as Prisma.InputJsonValue;

  if (enrichmentData.emailPatternsTried) {
    enrichmentData.emailPatternsTried = enrichmentData.emailPatternsTried as Prisma.InputJsonValue;
  }

  await db.lead.update({
    where: { id: leadId },
    data: enrichmentData as Parameters<typeof db.lead.update>[0]["data"],
  });
}

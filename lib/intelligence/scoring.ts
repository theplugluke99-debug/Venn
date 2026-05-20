import type { IntentScore, WebsiteAudit, ReviewSummary } from "@/types";

interface ScoringInput {
  googleRating?: number | null;
  reviewCount?: number | null;
  reviewSummary?: ReviewSummary | null;
  websiteAudit?: WebsiteAudit | null;
  instagramEngagement?: number | null;
}

export function computeIntentScore(data: ScoringInput): IntentScore {
  let negativeSignals = 0;
  let positiveSignals = 0;

  if (data.googleRating != null) {
    if (data.googleRating < 3.5) negativeSignals += 2;
    else if (data.googleRating < 4.2) negativeSignals += 1;
    else positiveSignals += 1;
  }

  if (data.reviewSummary) {
    if (data.reviewSummary.negativeThemes.length >= 2) negativeSignals += 2;
    else if (data.reviewSummary.negativeThemes.length === 1) negativeSignals += 1;
    if (data.reviewSummary.responseRate < 0.3) negativeSignals += 1;
  }

  if (data.websiteAudit) {
    const audit = data.websiteAudit;
    if (audit.qualityScore < 40) negativeSignals += 2;
    else if (audit.qualityScore < 60) negativeSignals += 1;
    else positiveSignals += 1;

    if (!audit.hasBookingLink) negativeSignals += 1;
    if (!audit.hasContactForm) negativeSignals += 1;
    if (audit.loadSpeed === "slow") negativeSignals += 1;
    if (audit.brokenElements.length > 0) negativeSignals += 1;
  }

  if (data.instagramEngagement != null) {
    if (data.instagramEngagement < 1) negativeSignals += 1;
    else if (data.instagramEngagement > 5) positiveSignals += 1;
  }

  if (negativeSignals >= 3) return "high";
  if (negativeSignals >= 1 || positiveSignals === 0) return "medium";
  return "low";
}

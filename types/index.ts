export type IntentScore = "high" | "medium" | "low";
export type DefaultAngle = "pain" | "opportunity" | "compliment";
export type CTAType = "reply" | "calendly" | "video" | "link";
export type Plan = "starter" | "growth" | "pro" | "enterprise";
export type LeadStatus =
  | "pending"
  | "scraping"
  | "enriching"
  | "complete"
  | "failed";

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  positiveThemes: string[];
  negativeThemes: string[];
  responseRate: number;
  lastReviewDate: string | null;
}

export interface InstagramData {
  handle: string;
  followerCount: number | null;
  engagementRate: number | null;
  postFrequency: string | null;
  lastPostDate: string | null;
  repliesComments: boolean;
}

export interface WebsiteAudit {
  hasSSL: boolean;
  hasMobileOptimisation: boolean;
  hasBookingLink: boolean;
  hasContactForm: boolean;
  loadSpeed: string | null;
  brokenElements: string[];
  qualityScore: number;
}

export interface Observation {
  title: string;
  detail: string;
  signal: string;
}

export interface CardObservation {
  title: string;
  detail: string;
}

export interface SocialProofItem {
  result: string;
  niche: string;
  context: string;
}

export interface IntelligenceProfile {
  businessBio: string;
  observations: Observation[];
  openingLine: string;
  recommendedChannel: string;
  suggestedAngle: string;
  intentScore: IntentScore;
  intentSignals: string[];
}

export interface SearchParams {
  niche: string;
  location: string;
  limit?: number;
}

export interface JobStatus {
  jobId: string;
  status: LeadStatus;
  progress: number;
  leadId?: string;
}

export interface CardData {
  headline: string;
  subheadline: string;
  observations: CardObservation[];
  revenueLoss: string;
  ctaText: string;
}

export interface LeadWithCard {
  id: string;
  businessName: string;
  ownerName: string | null;
  location: string;
  niche: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  googleRating: number | null;
  reviewCount: number | null;
  reviewSummary: ReviewSummary | null;
  instagramData: InstagramData | null;
  websiteAudit: WebsiteAudit | null;
  intentScore: IntentScore;
  intentSignals: string[] | null;
  businessBio: string | null;
  observations: Observation[] | null;
  openingLine: string | null;
  recommendedChannel: string | null;
  suggestedAngle: string | null;
  status: LeadStatus;
  jobId: string | null;
  card: {
    id: string;
    slug: string;
    headline: string | null;
    viewCount: number;
    lastViewed: Date | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

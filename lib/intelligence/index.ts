import Anthropic from "@anthropic-ai/sdk";
import { SCORING_PROMPT, DELIVERY_PROMPT, PROPOSAL_PROMPT, CLOSE_QUESTIONS_PROMPT, CLIENT_REPORT_PROMPT, ARSENAL_PROMPT } from "./prompts";
import type { IntelligenceProfile } from "@/types";
import { config } from "@/lib/config";

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

interface ScrapeData {
  businessName: string;
  niche: string;
  location: string;
  googleData: unknown;
  websiteAudit: unknown;
}

interface CardIdentityData {
  agencyName?: string | null;
  defaultAngle?: string | null;
  writingStyle?: string | null;
}

const DEFAULT_PROFILE = (data: ScrapeData): IntelligenceProfile => ({
  intentScore: "medium",
  intentSignals: ["Insufficient data for full analysis"],
  businessBio: `${data.businessName} is a ${data.niche} business based in ${data.location}.`,
  observations: [],
  openingLine: `Hi, I noticed ${data.businessName} and thought we should connect about how we could help.`,
  recommendedChannel: "email",
  suggestedAngle: "opportunity",
});

export async function generateIntelligence(
  data: ScrapeData,
  cardIdentity: CardIdentityData | null | undefined
): Promise<IntelligenceProfile> {
  const prompt = SCORING_PROMPT(data, cardIdentity);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") throw new Error("Non-text response");

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");

      const parsed = JSON.parse(jsonMatch[0]) as IntelligenceProfile;

      return {
        intentScore: parsed.intentScore || "medium",
        intentSignals: Array.isArray(parsed.intentSignals) ? parsed.intentSignals : [],
        businessBio: parsed.businessBio || "",
        observations: Array.isArray(parsed.observations) ? parsed.observations : [],
        openingLine: parsed.openingLine || "",
        recommendedChannel: parsed.recommendedChannel || "email",
        suggestedAngle: parsed.suggestedAngle || "pain",
      };
    } catch (err) {
      if (attempt === 1) {
        console.error(`[Intelligence] Both attempts failed for ${data.businessName}:`, err);
        return DEFAULT_PROFILE(data);
      }
    }
  }

  return DEFAULT_PROFILE(data);
}

export interface CardObservationFull {
  title: string;
  detail: string;
  reviewQuote?: string;
  frequency?: string;
  impact?: "high" | "medium" | "low";
}

export interface RevenueBreakdownItem {
  icon: "clock" | "phone" | "star" | "chart";
  description: string;
  amount: number;
}

export interface ApproachMove {
  title: string;
  body: string;
}

export interface CardCopyResult {
  headline: string;
  subheadline: string;
  observations: CardObservationFull[];
  revenueLoss: string;
  revenueBreakdown: RevenueBreakdownItem[];
  approachMoves: ApproachMove[];
  minutesAnalysing: number;
  signalBanner: string;
  ctaText: string;
}

export interface DeliveryMessages {
  whatsapp: string;
  instagramStep1: string;
  instagramStep2: string;
  emailSubject: string;
  emailBody: string;
  linkedinNote: string;
  linkedinDm: string;
}

export async function generateCardCopy(
  lead: unknown,
  cardIdentity: unknown
): Promise<CardCopyResult> {
  const { CARD_PROMPT } = await import("./prompts");
  const prompt = CARD_PROMPT(lead, cardIdentity);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in card response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<CardCopyResult>;
  return {
    headline: parsed.headline ?? "",
    subheadline: parsed.subheadline ?? "",
    observations: Array.isArray(parsed.observations) ? parsed.observations : [],
    revenueLoss: parsed.revenueLoss ?? "£0/month",
    revenueBreakdown: Array.isArray(parsed.revenueBreakdown) ? parsed.revenueBreakdown : [],
    approachMoves: Array.isArray(parsed.approachMoves) ? parsed.approachMoves : [],
    minutesAnalysing: typeof parsed.minutesAnalysing === "number" ? parsed.minutesAnalysing : 14,
    signalBanner: parsed.signalBanner ?? "",
    ctaText: parsed.ctaText ?? "Let's talk",
  };
}

export interface ProposalPhase {
  phase: string;
  title: string;
  duration: string;
  bullets: string[];
}

export interface ProposalBeforeAfter {
  before: string;
  after: string;
}

export interface ProposalContent {
  title: string;
  threadSection: string;
  currentState: string;
  visionSection: string;
  planSection: ProposalPhase[];
  beforeAfter: ProposalBeforeAfter[];
  investmentContext: string;
  closingSection: string;
}

export async function generateProposalContent(
  lead: unknown,
  cardIdentity: unknown,
  packages: unknown,
  discoveryContext?: Array<{ question: string; answer: string }>
): Promise<ProposalContent> {
  const prompt = PROPOSAL_PROMPT(lead, cardIdentity, packages, discoveryContext);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in proposal response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<ProposalContent>;
  return {
    title: parsed.title ?? "A Growth Plan",
    threadSection: parsed.threadSection ?? "",
    currentState: parsed.currentState ?? "",
    visionSection: parsed.visionSection ?? "",
    planSection: Array.isArray(parsed.planSection) ? parsed.planSection : [],
    beforeAfter: Array.isArray(parsed.beforeAfter) ? parsed.beforeAfter : [],
    investmentContext: parsed.investmentContext ?? "",
    closingSection: parsed.closingSection ?? "",
  };
}

export interface DiscoveryQuestion {
  text: string;
  context?: string;
  placeholder?: string;
}

export interface CloseQuestionsResult {
  questions: DiscoveryQuestion[];
  responseTime: string;
  sentMessage: string;
}

export async function generateCloseQuestions(
  lead: unknown,
  cardIdentity: unknown
): Promise<CloseQuestionsResult> {
  const prompt = CLOSE_QUESTIONS_PROMPT(lead, cardIdentity);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in close questions response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<CloseQuestionsResult>;
  return {
    questions: Array.isArray(parsed.questions) ? parsed.questions.slice(0, 4) : [],
    responseTime: parsed.responseTime ?? "24 hours",
    sentMessage: parsed.sentMessage ?? "Put something together before your proposal",
  };
}

export interface ClientReportContent {
  thisMonth: string;
  completions: string[];
  theNumbers: string;
  howYoureLooking: string;
  nextMonth: string[];
  personalNote: string;
}

export async function generateClientReport(data: Parameters<typeof CLIENT_REPORT_PROMPT>[0]): Promise<ClientReportContent> {
  const prompt = CLIENT_REPORT_PROMPT(data);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in report response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<ClientReportContent>;
  return {
    thisMonth: parsed.thisMonth ?? "",
    completions: Array.isArray(parsed.completions) ? parsed.completions : [],
    theNumbers: parsed.theNumbers ?? "",
    howYoureLooking: parsed.howYoureLooking ?? "",
    nextMonth: Array.isArray(parsed.nextMonth) ? parsed.nextMonth : [],
    personalNote: parsed.personalNote ?? "",
  };
}

export interface ColdCallScript {
  opener: string;
  permission: string;
  observation: string;
  pivot: string;
  close: string;
  ifTheyAreInterested: string;
  ifTheyAreNotInterested: string;
  ifVoicemail: string;
}

export interface VideoScript {
  intro: string;
  whatToShow: string[];
  whatToSay: string;
  close: string;
}

export interface ArsenalData {
  voiceNoteScript: string;
  coldCallScript: ColdCallScript;
  linkedinNote: string;
  linkedinFollowUp1: string;
  linkedinFollowUp2: string;
  emailSubject1: string;
  emailBody1: string;
  emailSubject2: string;
  emailBody2: string;
  emailSubject3: string;
  emailBody3: string;
  videoScript: VideoScript;
}

export async function generateArsenal(
  lead: unknown,
  cardIdentity: {
    agencyName?: string | null;
    agencyOwnerName?: string | null;
    writingStyle?: string | null;
    defaultAngle?: string | null;
  },
  cardUrl: string
): Promise<ArsenalData> {
  const prompt = ARSENAL_PROMPT(lead, cardIdentity, cardUrl);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in arsenal response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<ArsenalData>;
  const blankCall: ColdCallScript = {
    opener: "", permission: "", observation: "", pivot: "", close: "",
    ifTheyAreInterested: "", ifTheyAreNotInterested: "", ifVoicemail: "",
  };
  const blankVideo: VideoScript = { intro: "", whatToShow: [], whatToSay: "", close: "" };

  return {
    voiceNoteScript: parsed.voiceNoteScript ?? "",
    coldCallScript: (parsed.coldCallScript as ColdCallScript) ?? blankCall,
    linkedinNote: parsed.linkedinNote ?? "",
    linkedinFollowUp1: parsed.linkedinFollowUp1 ?? "",
    linkedinFollowUp2: parsed.linkedinFollowUp2 ?? "",
    emailSubject1: parsed.emailSubject1 ?? "",
    emailBody1: parsed.emailBody1 ?? "",
    emailSubject2: parsed.emailSubject2 ?? "",
    emailBody2: parsed.emailBody2 ?? "",
    emailSubject3: parsed.emailSubject3 ?? "",
    emailBody3: parsed.emailBody3 ?? "",
    videoScript: (parsed.videoScript as VideoScript) ?? blankVideo,
  };
}

export async function generateDeliveryMessages(
  lead: unknown,
  cardIdentity: unknown,
  cardUrl: string
): Promise<DeliveryMessages> {
  const prompt = DELIVERY_PROMPT(lead, cardIdentity, cardUrl);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in delivery response");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<DeliveryMessages>;
  const businessName = (lead as Record<string, unknown>)?.businessName ?? "your prospect";
  return {
    whatsapp: parsed.whatsapp ?? `Put something together specifically for you — ${cardUrl}`,
    instagramStep1: parsed.instagramStep1 ?? `Noticed something about ${businessName} worth sharing.`,
    instagramStep2: parsed.instagramStep2 ?? `Here's what I found: ${cardUrl}`,
    emailSubject: parsed.emailSubject ?? `Something specific to ${businessName}`,
    emailBody: parsed.emailBody ?? `I spent 14 minutes looking at ${businessName}. Here's what I found: ${cardUrl}`,
    linkedinNote: parsed.linkedinNote ?? `I noticed something specific about ${businessName} — put together a short analysis.`,
    linkedinDm: parsed.linkedinDm ?? `Following up — I put together a short analysis for ${businessName}: ${cardUrl}`,
  };
}

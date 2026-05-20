import Anthropic from "@anthropic-ai/sdk";
import { SCORING_PROMPT } from "./prompts";
import type { IntelligenceProfile } from "@/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export async function generateIntelligence(
  data: ScrapeData,
  cardIdentity: CardIdentityData | null | undefined
): Promise<IntelligenceProfile> {
  const prompt = SCORING_PROMPT(data, cardIdentity);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Claude response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as IntelligenceProfile;

  return {
    intentScore: parsed.intentScore || "medium",
    intentSignals: parsed.intentSignals || [],
    businessBio: parsed.businessBio || "",
    observations: parsed.observations || [],
    openingLine: parsed.openingLine || "",
    recommendedChannel: parsed.recommendedChannel || "email",
    suggestedAngle: parsed.suggestedAngle || "pain",
  };
}

export async function generateCardCopy(
  lead: unknown,
  cardIdentity: unknown
): Promise<{
  headline: string;
  subheadline: string;
  observations: Array<{ title: string; detail: string }>;
  revenueLoss: string;
  ctaText: string;
}> {
  const { CARD_PROMPT } = await import("./prompts");
  const prompt = CARD_PROMPT(lead, cardIdentity);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in card response");

  return JSON.parse(jsonMatch[0]);
}

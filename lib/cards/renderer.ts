import { db } from "@/lib/db";
import { generateCardCopy, generateDeliveryMessages } from "@/lib/intelligence";
import { generateSlug } from "./generator";
import type { Prisma } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export async function buildCard(leadId: string, userId: string) {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: { user: { include: { cardIdentity: true } } },
  });

  if (!lead) throw new Error("Lead not found");

  const existingCard = await db.card.findUnique({ where: { leadId } });
  if (existingCard) return existingCard;

  const cardIdentity = lead.user.cardIdentity;

  const cardCopy = await generateCardCopy(lead, cardIdentity);

  const slug = generateSlug(lead.businessName);
  const cardUrl = `${BASE_URL}/card/${slug}`;

  // Generate delivery messages in parallel with card creation
  let deliveryMessages = null;
  try {
    deliveryMessages = await generateDeliveryMessages(lead, cardIdentity, cardUrl);
  } catch (err) {
    console.error("[buildCard] Delivery messages failed:", err);
  }

  const card = await db.card.create({
    data: {
      slug,
      leadId,
      userId,
      headline: cardCopy.headline,
      observations: cardCopy.observations as unknown as Prisma.InputJsonValue,
      revenueLoss: cardCopy.revenueLoss,
      revenueBreakdown: cardCopy.revenueBreakdown as unknown as Prisma.InputJsonValue,
      approachMoves: cardCopy.approachMoves as unknown as Prisma.InputJsonValue,
      minutesAnalysing: cardCopy.minutesAnalysing,
      signalBanner: cardCopy.signalBanner || null,
      deliveryMessages: deliveryMessages as unknown as Prisma.InputJsonValue,
      ctaText: cardCopy.ctaText,
      ctaValue: cardIdentity?.ctaValue ?? null,
      brandColour: cardIdentity?.brandColour ?? "#C4973F",
      logoUrl: cardIdentity?.logoUrl ?? null,
      agencyName: cardIdentity?.agencyName ?? null,
    },
  });

  return card;
}

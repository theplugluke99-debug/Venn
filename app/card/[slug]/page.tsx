import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCardBySlug, incrementCardViewCount } from "@/lib/db/queries/cards";
import { ProspectCard } from "@/components/card/ProspectCard";
import type { CardObservation } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card) return { title: "Not Found" };

  const cardUser = await db.user.findUnique({
    where: { id: card.userId },
    include: { cardIdentity: true },
  });
  const agencyName = card.agencyName ?? cardUser?.cardIdentity?.agencyName ?? null;

  return {
    title: `${card.lead.businessName} — something put together for you`,
    description: agencyName
      ? `A personalised intelligence briefing from ${agencyName}`
      : `A personalised intelligence briefing for ${card.lead.businessName}`,
    robots: { index: false, follow: false },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    openGraph: {
      title: `${card.lead.businessName} — something put together for you`,
      description: agencyName
        ? `A personalised intelligence briefing from ${agencyName}`
        : `A personalised prospect briefing`,
      type: "website",
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card) notFound();

  await incrementCardViewCount(slug);

  const cardUser = await db.user.findUnique({
    where: { id: card.userId },
    include: { cardIdentity: true },
  });

  const cardIdentity = {
    ctaType: cardUser?.cardIdentity?.ctaType ?? "reply",
    ctaValue: card.ctaValue ?? cardUser?.cardIdentity?.ctaValue ?? null,
    brandColour: card.brandColour ?? cardUser?.cardIdentity?.brandColour ?? "#C4973F",
    logoUrl: card.logoUrl ?? cardUser?.cardIdentity?.logoUrl ?? null,
    agencyName: card.agencyName ?? cardUser?.cardIdentity?.agencyName ?? null,
  };

  return (
    <ProspectCard
      businessName={card.lead.businessName}
      headline={card.headline ?? `Here's what we found about ${card.lead.businessName}`}
      observations={(card.observations as unknown as CardObservation[]) ?? []}
      revenueLoss={card.revenueLoss ?? null}
      ctaText={card.ctaText ?? "Let's talk"}
      ctaType={cardIdentity.ctaType}
      ctaValue={cardIdentity.ctaValue}
      brandColour={cardIdentity.brandColour}
      logoUrl={cardIdentity.logoUrl}
      agencyName={cardIdentity.agencyName}
      niche={card.lead.niche}
      location={card.lead.location}
    />
  );
}

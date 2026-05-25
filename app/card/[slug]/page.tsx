import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCardBySlug, incrementCardViewCount } from "@/lib/db/queries/cards";
import { ProspectCard } from "@/components/card/ProspectCard";
import type { CardObservationFull, RevenueBreakdownItem, ApproachMove } from "@/components/card/ProspectCard";

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
  const mins = card.minutesAnalysing ?? 14;

  return {
    title: `Something prepared for ${card.lead.businessName}`,
    description: `We spent ${mins} minutes analysing ${card.lead.businessName}. Here's what we found.`,
    robots: { index: false, follow: false },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    openGraph: {
      title: `Something prepared for ${card.lead.businessName}`,
      description: agencyName
        ? `We spent ${mins} minutes analysing ${card.lead.businessName}. Prepared by ${agencyName}.`
        : `We spent ${mins} minutes analysing ${card.lead.businessName}. Here's what we found.`,
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

  const identity = cardUser?.cardIdentity;

  return (
    <ProspectCard
      businessName={card.lead.businessName}
      headline={card.headline ?? `Here's what we found about ${card.lead.businessName}`}
      subheadline={undefined}
      niche={card.lead.niche}
      location={card.lead.location}
      googleRating={card.lead.googleRating}
      reviewCount={card.lead.reviewCount}
      observations={(card.observations as unknown as CardObservationFull[]) ?? []}
      revenueLoss={card.revenueLoss ?? null}
      revenueBreakdown={(card.revenueBreakdown as unknown as RevenueBreakdownItem[]) ?? []}
      approachMoves={(card.approachMoves as unknown as ApproachMove[]) ?? []}
      minutesAnalysing={card.minutesAnalysing}
      signalBanner={card.signalBanner}
      brandColour={card.brandColour ?? identity?.brandColour ?? "#C4973F"}
      logoUrl={card.logoUrl ?? identity?.logoUrl ?? null}
      agencyName={card.agencyName ?? identity?.agencyName ?? null}
      agencyOwnerName={identity?.agencyOwnerName ?? null}
      agencyOwnerPhoto={identity?.agencyOwnerPhoto ?? null}
      ctaType={identity?.ctaType ?? "reply"}
      ctaValue={card.ctaValue ?? identity?.ctaValue ?? null}
      ctaText={card.ctaText ?? "Let's talk"}
      lastViewed={card.lastViewed}
    />
  );
}

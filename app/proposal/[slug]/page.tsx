import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getProposalBySlug, recordProposalView } from "@/lib/db/queries/proposals";
import { ProposalPage } from "@/components/proposal/ProposalPage";
import type { ProposalPhase, ProposalBeforeAfter } from "@/lib/intelligence";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return { title: "Not Found" };
  return {
    title: proposal.title,
    description: `A personalised proposal for ${proposal.lead.businessName}.`,
    robots: { index: false, follow: false },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    openGraph: {
      title: proposal.title,
      description: `Prepared for ${proposal.lead.businessName}.`,
      type: "website",
    },
  };
}

export default async function ProposalPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { slug } = await params;
  const { paid: paidParam } = await searchParams;

  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  await recordProposalView(slug);

  const owner = await db.user.findUnique({
    where: { id: proposal.userId },
    include: { cardIdentity: true },
  });

  const identity = owner?.cardIdentity;

  return (
    <ProposalPage
      slug={slug}
      title={proposal.title}
      businessName={proposal.lead.businessName}
      niche={proposal.lead.niche}
      location={proposal.lead.location}
      threadSection={proposal.threadSection}
      currentState={proposal.currentState}
      visionSection={proposal.visionSection}
      planSection={(proposal.planSection as unknown as ProposalPhase[]) ?? null}
      beforeAfter={(proposal.beforeAfter as unknown as ProposalBeforeAfter[]) ?? null}
      investmentContext={proposal.investmentContext}
      closingSection={proposal.closingSection}
      depositAmount={proposal.depositAmount}
      status={proposal.status}
      questions={proposal.questions.map((q) => ({
        ...q,
        answeredAt: q.answeredAt?.toISOString() ?? null,
        createdAt: q.createdAt.toISOString(),
        isPublic: q.isPublic,
      }))}
      agencyName={identity?.agencyName ?? null}
      agencyOwnerName={identity?.agencyOwnerName ?? null}
      agencyOwnerPhoto={identity?.agencyOwnerPhoto ?? null}
      logoUrl={identity?.logoUrl ?? null}
      brandColour={identity?.brandColour ?? "#C4973F"}
      isPaid={paidParam === "true" || proposal.status === "paid"}
    />
  );
}

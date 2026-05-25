import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCloseSessionBySlug } from "@/lib/db/queries/closeSessions";
import { db } from "@/lib/db";
import { DiscoveryPage } from "@/components/close/DiscoveryPage";
import type { DiscoveryQuestion } from "@/lib/intelligence";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await getCloseSessionBySlug(slug);
  if (!session) return { title: "Not Found" };
  return {
    title: `Discovery — ${session.lead.businessName}`,
    description: "A few questions before your proposal is built.",
    robots: { index: false, follow: false },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  };
}

export default async function CloseDiscoveryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getCloseSessionBySlug(slug);
  if (!session) notFound();

  const owner = await db.user.findUnique({
    where: { id: session.userId },
    include: { cardIdentity: true },
  });

  const identity = owner?.cardIdentity;

  // Build existing answers map
  const existingAnswers: Record<string, string> = {};
  session.discoveryAnswers.forEach((a) => {
    existingAnswers[String(a.questionIndex)] = a.answer;
  });

  // Also hydrate from the answers JSON snapshot if available
  if (session.answers && typeof session.answers === "object") {
    const snap = session.answers as Record<string, string>;
    Object.entries(snap).forEach(([k, v]) => {
      if (!existingAnswers[k]) existingAnswers[k] = v;
    });
  }

  const questions = (session.questions as unknown as DiscoveryQuestion[]) ?? [];

  return (
    <DiscoveryPage
      slug={slug}
      businessName={session.lead.businessName}
      agencyOwnerName={identity?.agencyOwnerName ?? null}
      agencyOwnerPhoto={identity?.agencyOwnerPhoto ?? null}
      agencyName={identity?.agencyName ?? null}
      logoUrl={identity?.logoUrl ?? null}
      brandColour={identity?.brandColour ?? "#C4973F"}
      questions={questions}
      responseTime={identity?.defaultResponseTime ?? "24 hours"}
      closeIntroText={identity?.closeIntroText ?? null}
      existingAnswers={existingAnswers}
    />
  );
}

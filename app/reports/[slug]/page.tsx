import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ReportPage } from "@/components/reports/ReportPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await db.clientReport.findUnique({ where: { slug }, include: { client: true } }).catch(() => null);
  if (!report) return { title: "Report — Venn" };
  return { title: report.title };
}

export default async function PublicReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const report = await db.clientReport.findUnique({
    where: { slug },
    include: { client: { include: { user: { include: { cardIdentity: true } } } } },
  });

  if (!report) notFound();

  // Record view (non-blocking)
  db.clientReport.update({
    where: { slug },
    data: { viewCount: { increment: 1 }, viewedAt: report.viewedAt ?? new Date() },
  }).catch(console.error);

  const cardIdentity = report.client.user.cardIdentity;

  return (
    <ReportPage
      slug={slug}
      title={report.title}
      period={report.period}
      content={report.content as Record<string, unknown>}
      client={{
        businessName: report.client.businessName,
        ownerName: report.client.ownerName,
      }}
      agency={{
        name: cardIdentity?.agencyName ?? null,
        ownerName: cardIdentity?.agencyOwnerName ?? null,
        logoUrl: cardIdentity?.logoUrl ?? null,
        brandColour: cardIdentity?.brandColour ?? "#C4973F",
      }}
    />
  );
}

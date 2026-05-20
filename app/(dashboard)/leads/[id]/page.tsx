import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadById } from "@/lib/db/queries/leads";
import { IntelligenceProfile } from "@/components/leads/IntelligenceProfile";
import { Button } from "@/components/ui/Button";
import { GenerateCardButton } from "./GenerateCardButton";
import type { IntentScore, Observation, WebsiteAudit, ReviewSummary } from "@/types";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const lead = await getLeadById(id, user.id);
  if (!lead) notFound();

  const isProcessing =
    lead.status === "pending" ||
    lead.status === "scraping" ||
    lead.status === "enriching";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-8 text-xs text-[#555]">
        <Link href="/leads" className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span className="text-[#888]">{lead.businessName}</span>
      </div>

      {isProcessing ? (
        <ProcessingState status={lead.status} jobId={lead.jobId} leadId={id} />
      ) : lead.status === "failed" ? (
        <FailedState businessName={lead.businessName} />
      ) : (
        <>
          <IntelligenceProfile
            businessName={lead.businessName}
            businessBio={lead.businessBio}
            intentScore={lead.intentScore as IntentScore}
            intentSignals={lead.intentSignals as string[] | null}
            observations={lead.observations as Observation[] | null}
            openingLine={lead.openingLine}
            recommendedChannel={lead.recommendedChannel}
            suggestedAngle={lead.suggestedAngle}
            googleRating={lead.googleRating}
            reviewCount={lead.reviewCount}
            reviewSummary={lead.reviewSummary as ReviewSummary | null}
            websiteAudit={lead.websiteAudit as WebsiteAudit | null}
            website={lead.website}
          />

          <div className="mt-8 pt-8 border-t border-[#1A1814] flex items-center gap-3">
            {lead.card ? (
              <Link href={`/card/${lead.card.slug}`} target="_blank">
                <Button variant="secondary">View Prospect Card</Button>
              </Link>
            ) : (
              <GenerateCardButton leadId={id} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProcessingState({ status, jobId, leadId }: { status: string; jobId: string | null; leadId: string }) {
  const labels: Record<string, string> = {
    pending: "Queued for research",
    scraping: "Pulling business data…",
    enriching: "Running AI analysis…",
  };

  return (
    <div className="py-20 text-center">
      <div className="w-10 h-10 border-[3px] border-[#2A2720] border-t-[#C4973F] rounded-full animate-spin mx-auto mb-6" />
      <h2 className="text-[#FFFDF8] font-medium mb-2">
        {labels[status] ?? "Processing"}
      </h2>
      <p className="text-[#555] text-sm mb-6">
        This takes about 30–60 seconds. The page will update automatically.
      </p>
      {jobId ? (
        <PollingRefresh jobId={jobId} leadId={leadId} />
      ) : null}
    </div>
  );
}

function PollingRefresh({ jobId, leadId }: { jobId: string; leadId: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var interval = setInterval(async function() {
              try {
                var r = await fetch('/api/jobs/${jobId}');
                var d = await r.json();
                if (d.status === 'complete' || d.status === 'failed') {
                  clearInterval(interval);
                  window.location.reload();
                }
              } catch(e) {}
            }, 2500);
          })();
        `,
      }}
    />
  );
}

function FailedState({ businessName }: { businessName: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-red-400 text-sm mb-2">Enrichment failed for {businessName}</p>
      <p className="text-[#555] text-sm mb-6">
        We couldn&apos;t scrape enough data. Try again or check the business name.
      </p>
      <Link href="/search">
        <Button>Try Another Search</Button>
      </Link>
    </div>
  );
}

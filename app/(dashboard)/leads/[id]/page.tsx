import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadById } from "@/lib/db/queries/leads";
import { GenerateCardButton } from "./GenerateCardButton";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/Button";
import type {
  IntentScore,
  Observation,
  WebsiteAudit,
  ReviewSummary,
  InstagramData,
} from "@/types";

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

  if (isProcessing) {
    return <ProcessingView status={lead.status} jobId={lead.jobId} leadId={id} businessName={lead.businessName} />;
  }

  if (lead.status === "failed") {
    return <FailedView businessName={lead.businessName} />;
  }

  const observations = lead.observations as Observation[] | null;
  const websiteAudit = lead.websiteAudit as WebsiteAudit | null;
  const reviewSummary = lead.reviewSummary as ReviewSummary | null;
  const intentSignals = lead.intentSignals as string[] | null;
  const intentScore = lead.intentScore as IntentScore;
  const instagramData = lead.instagramData as InstagramData | null;

  const intentConfig = {
    high: { label: "High Intent", className: "bg-[#C4973F]/10 text-[#E8B44B] border-[#C4973F]/20" },
    medium: { label: "Medium Intent", className: "bg-[#888]/10 text-[#888] border-[#888]/20" },
    low: { label: "Low Intent", className: "bg-[#444]/10 text-[#666] border-[#444]/20" },
  };
  const intent = intentConfig[intentScore] ?? intentConfig.low;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-8 text-[11px] text-[#444]">
        <Link href="/leads" className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span className="text-[#666]">{lead.businessName}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-[2rem] leading-tight font-serif text-[#FFFDF8]">
          {lead.businessName}
        </h1>
        <span
          className={`shrink-0 mt-1.5 px-2.5 py-1 rounded text-[11px] font-medium border ${intent.className}`}
        >
          {intent.label}
        </span>
      </div>

      <p className="text-xs text-[#555] mb-6">
        {lead.niche} · {lead.location}
        {lead.website ? (
          <>
            {" "}·{" "}
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] hover:text-[#C4973F] transition-colors"
            >
              {lead.website.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          </>
        ) : null}
        {lead.phone ? <> · {lead.phone}</> : null}
      </p>

      {lead.businessBio ? (
        <p className="text-sm text-[#888] leading-relaxed mb-8">{lead.businessBio}</p>
      ) : null}

      {lead.openingLine ? (
        <div className="bg-[#1A1814] border border-[#C4973F]/25 rounded-lg p-5 mb-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-[11px] text-[#C4973F] uppercase tracking-[0.1em] font-medium">
              Recommended Opening Line
            </p>
            <CopyButton text={lead.openingLine} />
          </div>
          <p className="text-[#FFFDF8] text-sm leading-relaxed">
            &ldquo;{lead.openingLine}&rdquo;
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 mb-8">
        {lead.recommendedChannel ? (
          <MetaCard label="Channel" value={lead.recommendedChannel} capitalize />
        ) : null}
        {lead.suggestedAngle ? (
          <MetaCard label="Angle" value={lead.suggestedAngle} capitalize />
        ) : null}
        {lead.googleRating != null ? (
          <MetaCard
            label="Google Rating"
            value={`★ ${lead.googleRating.toFixed(1)}`}
            sub={`${lead.reviewCount ?? 0} reviews`}
          />
        ) : null}
      </div>

      {intentSignals && intentSignals.length > 0 ? (
        <Section title="Intent Signals">
          <div className="flex flex-wrap gap-2">
            {intentSignals.map((signal) => (
              <span
                key={signal}
                className="px-2.5 py-1 text-xs bg-[#1A1814] border border-[#2A2720] text-[#888] rounded"
              >
                {signal}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {observations && observations.length > 0 ? (
        <Section title="Observations">
          <div className="space-y-3">
            {observations.map((obs, i) => (
              <div
                key={i}
                className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4"
              >
                <h3 className="text-sm font-medium text-[#FFFDF8] mb-1">
                  {obs.title}
                </h3>
                <p className="text-xs text-[#666] leading-relaxed mb-2.5">
                  {obs.detail}
                </p>
                <p className="text-xs text-[#C4973F]">{obs.signal}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {reviewSummary &&
      (reviewSummary.positiveThemes.length > 0 ||
        reviewSummary.negativeThemes.length > 0) ? (
        <Section title="Review Analysis">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {reviewSummary.positiveThemes.length > 0 ? (
              <div className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4">
                <p className="text-[11px] text-emerald-500/70 uppercase tracking-[0.08em] font-medium mb-3">
                  Positive Themes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reviewSummary.positiveThemes.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {reviewSummary.negativeThemes.length > 0 ? (
              <div className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4">
                <p className="text-[11px] text-red-500/70 uppercase tracking-[0.08em] font-medium mb-3">
                  Negative Themes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reviewSummary.negativeThemes.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs bg-red-500/8 border border-red-500/20 text-red-400 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-5 text-xs text-[#444]">
            <span>
              Response rate:{" "}
              <span className="text-[#888]">
                {reviewSummary.responseRate}%
              </span>
            </span>
            {reviewSummary.lastReviewDate ? (
              <span>
                Last review:{" "}
                <span className="text-[#888]">
                  {new Date(reviewSummary.lastReviewDate).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </span>
              </span>
            ) : null}
          </div>
        </Section>
      ) : null}

      {websiteAudit ? (
        <Section
          title="Website Audit"
          badge={`${websiteAudit.qualityScore}/100`}
        >
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "SSL Certificate", value: websiteAudit.hasSSL },
              { label: "Mobile Optimised", value: websiteAudit.hasMobileOptimisation },
              { label: "Booking System", value: websiteAudit.hasBookingLink },
              { label: "Contact Form", value: websiteAudit.hasContactForm },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between bg-[#1A1814] border border-[#2A2720] rounded px-3.5 py-2.5"
              >
                <span className="text-xs text-[#666]">{label}</span>
                <span
                  className={`text-xs font-medium ${
                    value ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {value ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
          {websiteAudit.loadSpeed ? (
            <p className="text-xs text-[#444]">
              Load speed:{" "}
              <span className="text-[#888] capitalize">
                {websiteAudit.loadSpeed}
              </span>
            </p>
          ) : null}
          {websiteAudit.brokenElements && websiteAudit.brokenElements.length > 0 ? (
            <p className="text-xs text-[#444] mt-1.5">
              Issues:{" "}
              <span className="text-red-400/80">
                {websiteAudit.brokenElements.join(", ")}
              </span>
            </p>
          ) : null}
        </Section>
      ) : null}

      {instagramData && instagramData.handle ? (
        <Section title="Instagram">
          <div className="grid grid-cols-3 gap-3">
            <MetaCard label="Handle" value={`@${instagramData.handle}`} />
            {instagramData.followerCount != null ? (
              <MetaCard
                label="Followers"
                value={instagramData.followerCount.toLocaleString()}
              />
            ) : null}
            {instagramData.engagementRate != null ? (
              <MetaCard
                label="Engagement"
                value={`${instagramData.engagementRate.toFixed(1)}%`}
              />
            ) : null}
          </div>
          {instagramData.postFrequency ? (
            <p className="text-xs text-[#444] mt-3">
              Post frequency:{" "}
              <span className="text-[#888]">{instagramData.postFrequency}</span>
            </p>
          ) : null}
        </Section>
      ) : null}

      <div className="mt-10 pt-6 border-t border-[#1A1814] flex items-center gap-3">
        {lead.card ? (
          <>
            <Link href={`/card/${lead.card.slug}`} target="_blank">
              <Button variant="primary">View Prospect Card</Button>
            </Link>
            <p className="text-xs text-[#444]">
              {lead.card.viewCount} view{lead.card.viewCount !== 1 ? "s" : ""}
            </p>
          </>
        ) : (
          <GenerateCardButton leadId={id} />
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium">
          {title}
        </h2>
        {badge ? (
          <span className="px-1.5 py-0.5 text-[10px] text-[#666] bg-[#1A1814] border border-[#2A2720] rounded">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function MetaCard({
  label,
  value,
  sub,
  capitalize,
}: {
  label: string;
  value: string;
  sub?: string;
  capitalize?: boolean;
}) {
  return (
    <div className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-3.5">
      <p className="text-[11px] text-[#444] mb-1.5">{label}</p>
      <p className={`text-sm text-[#FFFDF8] font-medium ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
      {sub ? <p className="text-[11px] text-[#444] mt-0.5">{sub}</p> : null}
    </div>
  );
}

function ProcessingView({
  status,
  jobId,
  leadId,
  businessName,
}: {
  status: string;
  jobId: string | null;
  leadId: string;
  businessName: string;
}) {
  const labels: Record<string, string> = {
    pending: "Queued for research",
    scraping: "Pulling business data…",
    enriching: "Running AI analysis…",
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-8 text-[11px] text-[#444]">
        <Link href="/leads" className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span className="text-[#666]">{businessName}</span>
      </div>

      <div className="py-20 text-center">
        <div className="w-9 h-9 border-2 border-[#2A2720] border-t-[#C4973F] rounded-full animate-spin mx-auto mb-6" />
        <p className="text-[#FFFDF8] text-sm font-medium mb-2">
          {labels[status] ?? "Processing…"}
        </p>
        <p className="text-[#444] text-xs">
          Takes about 30–60 seconds. This page will refresh automatically.
        </p>
      </div>

      {jobId ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=setInterval(async function(){try{var r=await fetch('/api/jobs/${jobId}');var d=await r.json();if(d.status==='complete'||d.status==='failed'){clearInterval(t);window.location.reload();}}catch(e){}},2500);})();`,
          }}
        />
      ) : null}
    </div>
  );
}

function FailedView({ businessName }: { businessName: string }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-8 text-[11px] text-[#444]">
        <Link href="/leads" className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span className="text-[#666]">{businessName}</span>
      </div>

      <div className="py-20 text-center">
        <p className="text-red-400 text-sm mb-2">
          Enrichment failed for {businessName}
        </p>
        <p className="text-[#444] text-xs mb-6 leading-relaxed">
          We couldn&apos;t gather enough data. Try again with a more specific
          business name or check the spelling.
        </p>
        <Link href="/search">
          <Button>Try Another Search</Button>
        </Link>
      </div>
    </div>
  );
}

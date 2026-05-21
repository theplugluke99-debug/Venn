import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadById } from "@/lib/db/queries/leads";
import { GenerateCardButton } from "./GenerateCardButton";
import { CopyButton } from "./CopyButton";
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
    lead.status === "pending" || lead.status === "scraping" || lead.status === "enriching";

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

  const INTENT_CONFIG: Record<IntentScore, { label: string; bg: string; color: string; border: string }> = {
    high: { label: "High intent", bg: "#0d2b0d", color: "#4CAF50", border: "#4CAF5030" },
    medium: { label: "Medium intent", bg: "#2b1e05", color: "#C4973F", border: "#C4973F30" },
    low: { label: "Low intent", bg: "#0d1524", color: "#5b7db1", border: "#5b7db130" },
  };
  const intent = INTENT_CONFIG[intentScore] ?? INTENT_CONFIG.low;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6" style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>
        <Link href="/leads" style={{ color: "#555250", textDecoration: "none" }} className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span style={{ color: "#666" }}>{lead.businessName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1
          style={{
            fontSize: 28,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          {lead.businessName}
        </h1>
        <span
          className="shrink-0 px-3 py-1.5 rounded"
          style={{
            fontSize: 12,
            fontWeight: 500,
            background: intent.bg,
            color: intent.color,
            border: `0.5px solid ${intent.border}`,
            fontFamily: "var(--font-inter)",
            marginTop: 6,
          }}
        >
          {intent.label}
        </span>
      </div>

      <div
        className="flex items-center gap-3 mb-6 flex-wrap"
        style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)" }}
      >
        <span>{lead.niche}</span>
        <span style={{ color: "#333230" }}>·</span>
        <span>{lead.location}</span>
        {lead.website && (
          <>
            <span style={{ color: "#333230" }}>·</span>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#C4973F", textDecoration: "none" }}
              className="hover:text-[#E8B44B] transition-colors"
            >
              {lead.website.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          </>
        )}
        {lead.phone && (
          <>
            <span style={{ color: "#333230" }}>·</span>
            <span>{lead.phone}</span>
          </>
        )}
      </div>

      {/* Intent signals */}
      {intentSignals && intentSignals.length > 0 && (
        <div className="mb-6">
          <p
            className="mb-2"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Why this score
          </p>
          <div className="flex flex-wrap gap-2">
            {intentSignals.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded"
                style={{
                  background: "#0F0E0B",
                  border: "0.5px solid #1E1C18",
                  fontSize: 11,
                  color: "#888",
                  fontFamily: "var(--font-inter)",
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: intent.color }} />
                {signal}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {/* Reviews column */}
        <div
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <p
            className="mb-3"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Google Reviews
          </p>
          {lead.googleRating != null ? (
            <>
              <p
                className="leading-none mb-1"
                style={{ fontSize: 32, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
              >
                {lead.googleRating.toFixed(1)}
              </p>
              <div className="flex mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ color: i < Math.floor(lead.googleRating!) ? "#C4973F" : "#333230", fontSize: 13 }}>★</span>
                ))}
              </div>
              {lead.reviewCount != null && (
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                  {lead.reviewCount} reviews
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: 12, color: "#333230", fontFamily: "var(--font-inter)" }}>No data</p>
          )}

          {reviewSummary && (
            <div className="mt-3 space-y-2">
              {reviewSummary.positiveThemes.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-1.5 py-0.5 rounded mr-1 mb-1"
                  style={{ fontSize: 10, background: "#4CAF5010", color: "#4CAF50", border: "0.5px solid #4CAF5020", fontFamily: "var(--font-inter)" }}
                >
                  {t}
                </span>
              ))}
              {reviewSummary.negativeThemes.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-1.5 py-0.5 rounded mr-1 mb-1"
                  style={{ fontSize: 10, background: "#ef444410", color: "#ef4444", border: "0.5px solid #ef444420", fontFamily: "var(--font-inter)" }}
                >
                  {t}
                </span>
              ))}
              {reviewSummary.responseRate != null && (
                <p style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)", marginTop: 6 }}>
                  Response rate: <span style={{ color: "#888" }}>{reviewSummary.responseRate}%</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Website audit column */}
        <div
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <p
            className="mb-3"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Website audit
          </p>
          {websiteAudit ? (
            <div className="space-y-2">
              {[
                { label: "SSL", value: websiteAudit.hasSSL },
                { label: "Mobile", value: websiteAudit.hasMobileOptimisation },
                { label: "Booking", value: websiteAudit.hasBookingLink },
                { label: "Contact form", value: websiteAudit.hasContactForm },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>{label}</span>
                  <span style={{ fontSize: 12, color: value ? "#4CAF50" : "#ef4444" }}>
                    {value ? "✓" : "✗"}
                  </span>
                </div>
              ))}
              {websiteAudit.qualityScore != null && (
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "0.5px solid #1E1C18" }}>
                  <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>Quality</span>
                  <span style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif)" }}>{websiteAudit.qualityScore}/100</span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#333230", fontFamily: "var(--font-inter)" }}>No audit data</p>
          )}
        </div>

        {/* Instagram column */}
        <div
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <p
            className="mb-3"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Instagram
          </p>
          {instagramData?.handle ? (
            <div className="space-y-2.5">
              <p style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)" }}>@{instagramData.handle}</p>
              {instagramData.followerCount != null && (
                <div>
                  <p style={{ fontSize: 18, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif)" }}>
                    {instagramData.followerCount.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)" }}>followers</p>
                </div>
              )}
              {instagramData.engagementRate != null && (
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                  Engagement: <span style={{ color: "#888" }}>{instagramData.engagementRate.toFixed(1)}%</span>
                </p>
              )}
              {instagramData.postFrequency && (
                <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                  Posts: <span style={{ color: "#888" }}>{instagramData.postFrequency}</span>
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#333230", fontFamily: "var(--font-inter)" }}>No Instagram data</p>
          )}
        </div>
      </div>

      {/* Observations */}
      {observations && observations.length > 0 && (
        <div className="mb-8">
          <p
            className="mb-3"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Intelligence observations
          </p>
          <div className="grid grid-cols-3 gap-3">
            {observations.map((obs, i) => (
              <div
                key={i}
                style={{
                  background: "#0F0E0B",
                  border: "0.5px solid #1E1C18",
                  borderLeft: "2px solid #C4973F",
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <h3
                  className="mb-1"
                  style={{ fontSize: 12, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}
                >
                  {obs.title}
                </h3>
                <p
                  className="mb-2"
                  style={{ fontSize: 11, color: "#666", lineHeight: 1.5, fontFamily: "var(--font-inter)" }}
                >
                  {obs.detail}
                </p>
                <p style={{ fontSize: 11, color: "#C4973F", fontFamily: "var(--font-inter)" }}>
                  {obs.signal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business bio */}
      {lead.businessBio && (
        <div className="mb-8">
          <p
            className="mb-3"
            style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
          >
            Business overview
          </p>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,253,248,0.8)",
              lineHeight: 1.7,
              fontFamily: "var(--font-inter)",
            }}
          >
            {lead.businessBio}
          </p>
        </div>
      )}

      {/* Opening line */}
      {lead.openingLine && (
        <div
          className="mb-8"
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #1E1C18",
            borderLeft: "2px solid #C4973F",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              style={{ fontSize: 10, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)" }}
            >
              Recommended opening line
            </p>
            <CopyButton text={lead.openingLine} />
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#FFFDF8",
              fontStyle: "italic",
              lineHeight: 1.6,
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            }}
          >
            &ldquo;{lead.openingLine}&rdquo;
          </p>
          {(lead.recommendedChannel || lead.suggestedAngle) && (
            <div className="flex gap-2 mt-3">
              {lead.recommendedChannel && (
                <span
                  className="px-2.5 py-1 rounded-full capitalize"
                  style={{ fontSize: 11, background: "#1A1814", color: "#888", border: "0.5px solid #1E1C18", fontFamily: "var(--font-inter)" }}
                >
                  {lead.recommendedChannel}
                </span>
              )}
              {lead.suggestedAngle && (
                <span
                  className="px-2.5 py-1 rounded-full capitalize"
                  style={{ fontSize: 11, background: "#1A1814", color: "#888", border: "0.5px solid #1E1C18", fontFamily: "var(--font-inter)" }}
                >
                  {lead.suggestedAngle} angle
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card analytics + CTA */}
      <div style={{ borderTop: "0.5px solid #1E1C18", paddingTop: 24, marginTop: 8 }}>
        {lead.card ? (
          <div>
            <CardAnalytics card={lead.card} />
            <Link
              href={`/card/${lead.card.slug}`}
              target="_blank"
              className="flex w-full items-center justify-center py-3 rounded transition-opacity hover:opacity-90"
              style={{
                background: "#C4973F",
                color: "#0A0907",
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "var(--font-inter)",
                textDecoration: "none",
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              View prospect card →
            </Link>
          </div>
        ) : (
          <GenerateCardButton leadId={id} />
        )}
      </div>
    </div>
  );
}

function timeAgo(date: Date): string {
  const ms = Date.now() - date.getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function CardAnalytics({
  card,
}: {
  card: { viewCount: number; lastViewed: Date | null };
}) {
  const isHot = card.lastViewed
    ? Date.now() - card.lastViewed.getTime() < 86_400_000
    : false;

  return (
    <div
      style={{
        background: "#0F0E0B",
        border: isHot ? "0.5px solid #C4973F40" : "0.5px solid #1E1C18",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          style={{
            fontSize: 10,
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
          }}
        >
          Card analytics
        </p>
        {isHot && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: "#C4973F",
              color: "#0A0907",
              padding: "2px 7px",
              borderRadius: 10,
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.05em",
            }}
          >
            HOT
          </span>
        )}
      </div>

      <div className="flex gap-6">
        <div>
          <p
            style={{
              fontSize: 28,
              color: isHot ? "#C4973F" : "#FFFDF8",
              fontFamily: "var(--font-instrument-serif)",
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {card.viewCount}
          </p>
          <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
            view{card.viewCount !== 1 ? "s" : ""}
          </p>
        </div>

        {card.lastViewed && (
          <div>
            <p
              style={{
                fontSize: 15,
                color: isHot ? "#C4973F" : "#888",
                fontFamily: "var(--font-instrument-serif)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {timeAgo(card.lastViewed as Date)}
            </p>
            <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
              last viewed
            </p>
          </div>
        )}

        {!card.lastViewed && (
          <div>
            <p
              style={{
                fontSize: 13,
                color: "#333230",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.4,
                marginTop: 4,
              }}
            >
              Not viewed yet
            </p>
          </div>
        )}
      </div>

      {isHot && (
        <p
          style={{
            fontSize: 11,
            color: "#C4973F",
            fontFamily: "var(--font-inter)",
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          This prospect viewed your card recently — reach out now while you&apos;re top of mind.
        </p>
      )}
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
      <div className="flex items-center gap-2 mb-8" style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>
        <Link href="/leads" style={{ color: "#555250", textDecoration: "none" }} className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span style={{ color: "#666" }}>{businessName}</span>
      </div>

      <div className="py-20 text-center">
        <div
          className="mx-auto mb-6 animate-spin"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #1E1C18",
            borderTop: "1.5px solid #C4973F",
          }}
        />
        <p style={{ fontSize: 15, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif)", marginBottom: 8 }}>
          {labels[status] ?? "Processing…"}
        </p>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)" }}>
          Takes about 30–60 seconds. This page will refresh automatically.
        </p>
      </div>

      {jobId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=setInterval(async function(){try{var r=await fetch('/api/jobs/${jobId}');var d=await r.json();if(d.status==='complete'||d.status==='failed'){clearInterval(t);window.location.reload();}}catch(e){}},2500);})();`,
          }}
        />
      )}
    </div>
  );
}

function FailedView({ businessName }: { businessName: string }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-8" style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>
        <Link href="/leads" style={{ color: "#555250", textDecoration: "none" }} className="hover:text-[#FFFDF8] transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span style={{ color: "#666" }}>{businessName}</span>
      </div>

      <div className="py-20 text-center">
        <p style={{ fontSize: 14, color: "#ef4444", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
          Enrichment failed for {businessName}
        </p>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)", lineHeight: 1.6, marginBottom: 24 }}>
          We couldn&apos;t gather enough data. Try again with a more specific business name.
        </p>
        <Link
          href="/search"
          className="inline-flex px-4 py-2 rounded transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Try another search
        </Link>
      </div>
    </div>
  );
}

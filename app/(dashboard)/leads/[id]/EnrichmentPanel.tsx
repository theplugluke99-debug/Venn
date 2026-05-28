"use client";

import { useState } from "react";

interface EnrichmentData {
  ownerEmail: string | null;
  ownerEmailConfidence: string | null;
  ownerEmailSource: string | null;
  ownerEmailVerified: boolean;
  linkedInUrl: string | null;
  linkedInConfidence: string | null;
  ownerName: string | null;
  ownerNameSource: string | null;
  instagramHandle: string | null;
  instagramFollowers: number | null;
  instagramPostCount: number | null;
  instagramLastPost: string | null;
  instagramBio: string | null;
  companiesHouseNumber: string | null;
  companyStatus: string | null;
  sicCode: string | null;
  incorporationDate: string | null;
  directorName: string | null;
  bookingPlatform: string | null;
  emailPlatform: string | null;
  chatPlatform: string | null;
  reviewPlatform: string | null;
  hasLiveChat: boolean | null;
  enrichmentRunAt: string | null;
  enrichmentSources: string[] | null;
  enrichmentScore: number | null;
}

interface Props {
  leadId: string;
  initialData: EnrichmentData | null;
}

function ConfidenceBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const color = level === "high" ? "#4CAF50" : level === "medium" ? "#C4973F" : "#555250";
  return (
    <span style={{
      fontSize: 10, color, border: `0.5px solid ${color}40`, borderRadius: 4,
      padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.08em",
      fontFamily: "var(--font-inter)",
    }}>
      {level}
    </span>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 11, color: "#9C9690", background: "#1A1814", border: "0.5px solid #2A2826",
      borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-inter)",
    }}>
      {label}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => null); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ fontSize: 11, color: copied ? "#4CAF50" : "#555250", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", padding: 0 }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "14px 16px" }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
      {children}
    </p>
  );
}

function channelRecommendation(d: EnrichmentData): string {
  if (d.ownerEmail && d.ownerEmailVerified) return "Email is your strongest channel for this lead";
  if (d.instagramHandle && d.instagramLastPost) {
    const daysAgo = Math.floor((Date.now() - new Date(d.instagramLastPost).getTime()) / 86_400_000);
    if (daysAgo < 60) return `Instagram DM likely effective — active ${daysAgo} days ago`;
  }
  if (!d.ownerEmail && d.linkedInUrl) return "Lead with LinkedIn for this one";
  return "Use the prospect card as your primary channel — no contact data publicly available";
}

export function EnrichmentPanel({ leadId, initialData }: Props) {
  const [data, setData] = useState<EnrichmentData | null>(initialData);
  const [loading, setLoading] = useState(false);

  async function runEnrichment() {
    setLoading(true);
    try {
      await fetch(`/api/enrichment/${leadId}`, { method: "POST" });
      // Poll for results after a short delay
      await new Promise((r) => setTimeout(r, 3000));
      const res = await fetch(`/api/enrichment/${leadId}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  const hasAnyData = data?.enrichmentRunAt && (
    data.ownerEmail || data.linkedInUrl || data.instagramHandle ||
    data.companiesHouseNumber || data.bookingPlatform
  );

  return (
    <div id="enrichment" style={{ marginTop: 32, paddingTop: 28, borderTop: "0.5px solid #1A1814" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 10, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-inter)" }}>
          Enrichment data
        </p>
        {data?.enrichmentScore != null && (
          <span style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)" }}>
            Score: <span style={{ color: data.enrichmentScore >= 60 ? "#4CAF50" : data.enrichmentScore >= 30 ? "#C4973F" : "#555250" }}>{data.enrichmentScore}/100</span>
          </span>
        )}
      </div>

      {!data?.enrichmentRunAt && !loading && (
        <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 20px" }}>
          <p style={{ fontSize: 13, color: "#9C9690", fontFamily: "var(--font-inter)", marginBottom: 12 }}>
            Finds owner email, LinkedIn, Instagram and company data from public sources.
          </p>
          <button
            onClick={runEnrichment}
            style={{
              fontSize: 13, color: "#C4973F", background: "none", border: "0.5px solid #C4973F40",
              borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--font-inter)",
            }}
          >
            Run enrichment →
          </button>
        </div>
      )}

      {loading && (
        <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "20px 20px" }}>
          <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)" }}>Finding contact data...</p>
        </div>
      )}

      {data?.enrichmentRunAt && (
        <>
          {/* Channel recommendation */}
          <div style={{ background: "#0F0E0B", border: "0.5px solid #C4973F20", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>
              {channelRecommendation(data)}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {/* Email */}
            <Card>
              <Label>Email</Label>
              {data.ownerEmail ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", wordBreak: "break-all" }}>{data.ownerEmail}</p>
                    {data.ownerEmailVerified && (
                      <span style={{ fontSize: 10, color: "#4CAF50", border: "0.5px solid #4CAF5040", borderRadius: 4, padding: "1px 6px", fontFamily: "var(--font-inter)", whiteSpace: "nowrap" }}>Verified</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <ConfidenceBadge level={data.ownerEmailConfidence} />
                    <CopyBtn text={data.ownerEmail} />
                  </div>
                  {data.ownerEmailSource && (
                    <p style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)", marginTop: 6 }}>
                      Source: {data.ownerEmailSource.replace("website_page:", "page — ")}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)" }}>Email not publicly listed</p>
              )}
            </Card>

            {/* LinkedIn */}
            <Card>
              <Label>LinkedIn</Label>
              {data.linkedInUrl ? (
                <>
                  {data.ownerName && (
                    <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 4 }}>{data.ownerName}</p>
                  )}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a
                      href={data.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                    >
                      Open profile →
                    </a>
                    <ConfidenceBadge level={data.linkedInConfidence} />
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)" }}>LinkedIn not found</p>
              )}
            </Card>

            {/* Instagram */}
            <Card>
              <Label>Instagram</Label>
              {data.instagramHandle ? (
                <>
                  <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", marginBottom: 4 }}>@{data.instagramHandle}</p>
                  {data.instagramFollowers != null && (
                    <p style={{ fontSize: 12, color: "#9C9690", fontFamily: "var(--font-inter)", marginBottom: 4 }}>{data.instagramFollowers.toLocaleString()} followers</p>
                  )}
                  {data.instagramLastPost && (() => {
                    const days = Math.floor((Date.now() - new Date(data.instagramLastPost!).getTime()) / 86_400_000);
                    return (
                      <p style={{ fontSize: 11, color: days > 60 ? "#C0392B" : "#555250", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
                        Last post {days}d ago
                      </p>
                    );
                  })()}
                  <a
                    href={`https://instagram.com/${data.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                  >
                    View profile →
                  </a>
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)" }}>Instagram not found</p>
              )}
            </Card>

            {/* Companies House */}
            <Card>
              <Label>Companies House</Label>
              {data.companiesHouseNumber ? (
                <>
                  <p style={{ fontSize: 12, color: "#9C9690", fontFamily: "var(--font-inter)", marginBottom: 4 }}>No. {data.companiesHouseNumber}</p>
                  {data.companyStatus && (
                    <p style={{ fontSize: 12, color: data.companyStatus === "active" ? "#4CAF50" : "#C0392B", fontFamily: "var(--font-inter)", marginBottom: 4, textTransform: "capitalize" }}>
                      {data.companyStatus}
                    </p>
                  )}
                  {data.directorName && (
                    <p style={{ fontSize: 12, color: "#9C9690", fontFamily: "var(--font-inter)", marginBottom: 4 }}>Director: {data.directorName}</p>
                  )}
                  {data.incorporationDate && (
                    <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginBottom: 4 }}>
                      Incorporated {new Date(data.incorporationDate).getFullYear()}
                    </p>
                  )}
                  {data.sicCode && (
                    <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>SIC: {data.sicCode}</p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#444", fontFamily: "var(--font-inter)" }}>Not registered</p>
              )}
            </Card>
          </div>

          {/* Tech stack */}
          {(data.bookingPlatform || data.emailPlatform || data.chatPlatform || data.reviewPlatform || data.hasLiveChat) && (
            <Card>
              <Label>Tech stack detected</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.bookingPlatform && <Chip label={`Bookings: ${data.bookingPlatform}`} />}
                {data.emailPlatform && <Chip label={`Email: ${data.emailPlatform}`} />}
                {data.chatPlatform && <Chip label={`Chat: ${data.chatPlatform}`} />}
                {data.reviewPlatform && <Chip label={`Reviews: ${data.reviewPlatform}`} />}
                {data.hasLiveChat && !data.chatPlatform && <Chip label="Live chat" />}
              </div>
            </Card>
          )}

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <p style={{ fontSize: 10, color: "#333", fontFamily: "var(--font-inter)" }}>
              {data.enrichmentSources?.length
                ? `Sources: ${data.enrichmentSources.join(", ")}`
                : "No sources"
              }{" · "}
              {new Date(data.enrichmentRunAt!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
            <button
              onClick={runEnrichment}
              disabled={loading}
              style={{ fontSize: 11, color: "#555250", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", padding: 0 }}
            >
              Regenerate →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

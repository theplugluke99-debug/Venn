import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCloseSessionById } from "@/lib/db/queries/closeSessions";
import type { DiscoveryQuestion } from "@/lib/intelligence";
import { GenerateProposalFromClose } from "./GenerateProposalFromClose";

export const metadata = { title: "Close Session — Venn" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

const STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  viewed: "Viewed",
  discovery_complete: "Discovery complete",
  proposal_generated: "Proposal generated",
  accepted: "Accepted",
  paid: "Paid",
};

function timeAgo(date: Date | string): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function stepGap(a: Date | null, b: Date | null): string | null {
  if (!a || !b) return null;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  const hrs = Math.floor(ms / 3_600_000);
  if (hrs < 1) return `${Math.floor(ms / 60_000)}m later`;
  if (hrs < 24) return `${hrs}h later`;
  return `${Math.floor(hrs / 24)}d later`;
}

export default async function CloseSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const session = await getCloseSessionById(id);
  if (!session || session.userId !== user.id) notFound();

  const questions = (session.questions as unknown as DiscoveryQuestion[]) ?? [];
  const answersMap: Record<string, string> = {};
  session.discoveryAnswers.forEach((a) => { answersMap[String(a.questionIndex)] = a.answer; });

  const canGenerate = !!session.discoveryCompletedAt && !session.proposalId;

  // Build intelligence recommendation
  const shortAnswers = session.discoveryAnswers.filter((a) => a.answer.length < 40);
  let recommendation: string | null = null;

  if (session.discoveryCompletedAt) {
    const totalMs = session.discoveryCompletedAt.getTime() - (session.discoveryViewedAt?.getTime() ?? session.createdAt.getTime());
    const totalMins = Math.floor(totalMs / 60_000);
    if (totalMins < 10) {
      recommendation = "High engagement. Generate their proposal today while interest is warm.";
    } else if (session.discoveryAnswers.length === questions.length && totalMins > 60) {
      recommendation = "Thoughtful decision maker. Give the proposal space to breathe before following up.";
    }
    if (shortAnswers.length > 0) {
      recommendation = `Question ${shortAnswers[0].questionIndex + 1} got a brief answer — there may be sensitivity here. Handle gently in the proposal.`;
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Link href="/close" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
          ← Close
        </Link>
        <span style={{ color: "#1E1C18" }}>/</span>
        <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>{session.lead.businessName}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <h1 style={{
            fontSize: 24, color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            fontWeight: 400,
          }}>
            {session.lead.businessName}
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
            color: "#C4973F", background: "#1a1808", border: "0.5px solid #C4973F30",
            padding: "3px 8px", borderRadius: 3, flexShrink: 0, marginTop: 4,
            fontFamily: "var(--font-inter)",
          }}>
            {STATUS_LABELS[session.status] ?? session.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)" }}>
          <span>{session.viewCount} view{session.viewCount !== 1 ? "s" : ""}</span>
          {session.sentChannel && <span>Sent via {session.sentChannel}</span>}
          {session.lastViewed && <span>Last viewed {timeAgo(session.lastViewed)}</span>}
          <a href={`${BASE_URL}/close/${session.slug}`} target="_blank" rel="noopener noreferrer"
            style={{ color: "#C4973F", textDecoration: "none" }}>
            View link →
          </a>
        </div>
      </div>

      {/* Generate proposal CTA */}
      {canGenerate && (
        <div style={{ marginBottom: 32 }}>
          <GenerateProposalFromClose
            leadId={session.leadId}
            closeSessionId={session.id}
            businessName={session.lead.businessName}
          />
        </div>
      )}

      {/* Intelligence recommendation */}
      {recommendation && (
        <div style={{
          background: "#0F0E0B", border: "0.5px solid #C4973F30", borderRadius: 8,
          padding: "14px 18px", marginBottom: 24,
        }}>
          <p style={{ fontSize: 10, color: "#C4973F", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
            Venn read
          </p>
          <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
            {recommendation}
          </p>
        </div>
      )}

      {/* Discovery answers */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
          Discovery answers · {session.discoveryAnswers.length} of {questions.length}
        </p>
        {questions.length === 0 && (
          <p style={{ fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)" }}>
            Awaiting discovery
          </p>
        )}
        {questions.map((q, i) => {
          const ans = answersMap[String(i)];
          return (
            <div key={i} style={{
              background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8,
              padding: "20px", marginBottom: 12,
            }}>
              <p style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontSize: 16, color: "#888580", fontStyle: "italic", marginBottom: 12,
                lineHeight: 1.5,
              }}>
                {q.text}
              </p>
              {ans ? (
                <div style={{ borderLeft: "2px solid #C4973F", paddingLeft: 14 }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#FFFDF8", lineHeight: 1.7 }}>
                    {ans}
                  </p>
                </div>
              ) : (
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "#333", fontStyle: "italic" }}>
                  Not yet answered
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div>
        <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
          Timeline
        </p>
        {[
          { label: "Session created", date: session.createdAt, prev: null },
          { label: "First viewed", date: session.discoveryViewedAt, prev: session.createdAt },
          { label: "Discovery completed", date: session.discoveryCompletedAt, prev: session.discoveryViewedAt },
          { label: "Proposal generated", date: session.proposalGeneratedAt, prev: session.discoveryCompletedAt },
        ].map((step) => (
          <div key={step.label} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
              background: step.date ? "#C4973F" : "#1E1C18",
              border: `1px solid ${step.date ? "#C4973F" : "#333"}`,
            }} />
            <div>
              <p style={{ fontSize: 12, color: step.date ? "#FFFDF8" : "#333", fontFamily: "var(--font-inter)" }}>
                {step.label}
                {step.date ? (
                  <span style={{ color: "#555250", marginLeft: 8 }}>
                    {new Date(step.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                ) : (
                  <span style={{ color: "#2A2826", marginLeft: 8 }}>—</span>
                )}
              </p>
              {step.date && step.prev && (
                <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", marginTop: 1 }}>
                  {stepGap(step.prev, step.date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

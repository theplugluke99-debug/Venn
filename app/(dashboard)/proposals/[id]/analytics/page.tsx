import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getProposalById } from "@/lib/db/queries/proposals";

export const metadata = { title: "Proposal Analytics — Venn" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  accepted: "Accepted",
  paid: "Paid",
};

export default async function ProposalAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const proposal = await getProposalById(id);
  if (!proposal || proposal.userId !== user.id) notFound();

  const answered = proposal.questions.filter((q) => q.answer).length;
  const unanswered = proposal.questions.filter((q) => !q.answer).length;

  return (
    <div className="max-w-2xl">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link href="/proposals" style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}>
            ← Proposals
          </Link>
          <span style={{ color: "#1E1C18" }}>/</span>
          <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>Analytics</span>
        </div>
        <h1 style={{ fontSize: 24, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", fontWeight: 400, margin: 0 }}>
          {proposal.lead.businessName}
        </h1>
        <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 6 }}>{proposal.title}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Views", value: proposal.viewCount },
          { label: "Questions", value: proposal.questions.length },
          { label: "Status", value: STATUS_LABELS[proposal.status] ?? proposal.status },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 20px" }}>
            <p style={{ fontSize: 11, color: "#444440", fontFamily: "var(--font-inter)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 28, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "First viewed", value: proposal.firstViewedAt ? new Date(proposal.firstViewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Not yet" },
          { label: "Last viewed", value: proposal.lastViewedAt ? new Date(proposal.lastViewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Not yet" },
          { label: "Accepted", value: proposal.acceptedAt ? new Date(proposal.acceptedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : "Not yet" },
          { label: "Deposit paid", value: proposal.paidAt ? new Date(proposal.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : proposal.depositAmount ? "Awaiting" : "N/A" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "14px 18px" }}>
            <p style={{ fontSize: 10, color: "#444440", fontFamily: "var(--font-inter)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{stat.label}</p>
            <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {proposal.questions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 12 }}>
            Q&A Summary
          </p>
          <div style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8, padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)" }}>
              {proposal.questions.length} question{proposal.questions.length !== 1 ? "s" : ""} ·{" "}
              {answered} answered · {unanswered} unanswered
            </p>
            {unanswered > 0 && (
              <Link
                href={`/proposals/${id}`}
                style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
              >
                Answer questions →
              </Link>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <a
          href={`${BASE_URL}/proposal/${proposal.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "9px 16px", borderRadius: 5, fontSize: 12, fontFamily: "var(--font-inter)",
            border: "0.5px solid #C4973F", color: "#C4973F", textDecoration: "none",
          }}
        >
          View proposal →
        </a>
      </div>
    </div>
  );
}

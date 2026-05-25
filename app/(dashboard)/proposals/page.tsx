import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getProposalsByUser } from "@/lib/db/queries/proposals";

export const metadata = { title: "Proposals — Venn" };

const STATUS_LABELS: Record<string, { label: string; colour: string; bg: string }> = {
  draft:    { label: "Draft",    colour: "#555250", bg: "#1E1C18" },
  sent:     { label: "Sent",     colour: "#888580", bg: "#1A1814" },
  viewed:   { label: "Viewed",   colour: "#C4973F", bg: "#1a1808" },
  accepted: { label: "Accepted", colour: "#4CAF50", bg: "#0d1a0d" },
  paid:     { label: "Paid",     colour: "#4CAF50", bg: "#0d1a0d" },
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export default async function ProposalsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const proposals = await getProposalsByUser(user.id);

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div
          style={{
            width: 52, height: 52, borderRadius: 12,
            background: "#C4973F10", border: "0.5px solid #C4973F30",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        </div>
        <p style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", marginBottom: 8 }}>
          No proposals yet
        </p>
        <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5, maxWidth: 280, marginBottom: 24 }}>
          Generate a bespoke proposal for any lead with a single click
        </p>
        <Link
          href="/leads"
          style={{
            background: "#C4973F", color: "#0A0907", fontSize: 13, fontWeight: 500,
            fontFamily: "var(--font-inter)", textDecoration: "none", borderRadius: 6, padding: "9px 18px",
          }}
        >
          Go to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}>
          Proposals
        </h1>
      </div>

      <div className="space-y-2">
        {proposals.map((proposal) => {
          const st = STATUS_LABELS[proposal.status] ?? STATUS_LABELS.draft;
          const unanswered = proposal.questions.filter((q) => !q.answer).length;
          const isHot = proposal.status === "viewed" || (unanswered > 0);

          return (
            <div
              key={proposal.id}
              style={{
                background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8,
                padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                    {proposal.lead.businessName}
                  </p>
                  {isHot && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#C4973F", background: "#1a1808", border: "0.5px solid #C4973F30",
                      padding: "1px 5px", borderRadius: 3,
                    }}>
                      HOT
                    </span>
                  )}
                  <span style={{
                    fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: st.colour, background: st.bg, padding: "1px 6px", borderRadius: 3,
                  }}>
                    {st.label}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>
                  {proposal.viewCount} view{proposal.viewCount !== 1 ? "s" : ""}
                  {unanswered > 0 && ` · ${unanswered} unanswered question${unanswered !== 1 ? "s" : ""}`}
                  {" · "}{new Date(proposal.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {unanswered > 0 && (
                  <Link
                    href={`/proposals/${proposal.id}`}
                    style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                  >
                    Answer →
                  </Link>
                )}
                <Link
                  href={`/proposals/${proposal.id}/analytics`}
                  style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                >
                  Analytics
                </Link>
                <a
                  href={`${BASE_URL}/proposal/${proposal.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                >
                  View →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

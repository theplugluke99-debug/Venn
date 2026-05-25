import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCloseSessionsByUser } from "@/lib/db/queries/closeSessions";

export const metadata = { title: "Venn Close — Dashboard" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

const STATUS_META: Record<string, { label: string; colour: string; bg: string }> = {
  sent:                { label: "Sent",               colour: "#555250", bg: "#1E1C18" },
  viewed:              { label: "Viewed",              colour: "#5b7db1", bg: "#0d1524" },
  discovery_complete:  { label: "Discovery complete",  colour: "#C4973F", bg: "#1a1808" },
  proposal_generated:  { label: "Proposal generated",  colour: "#4CAF50", bg: "#0d1a0d" },
  accepted:            { label: "Accepted",            colour: "#4CAF50", bg: "#0d1a0d" },
  paid:                { label: "Paid ✓",              colour: "#4CAF50", bg: "#0d1a0d" },
};

export default async function CloseDashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const sessions = await getCloseSessionsByUser(user.id);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: "#C4973F10", border: "0.5px solid #C4973F30",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 11V7a4 4 0 018 0v4M5 11h14l1 9H4l1-9z" />
          </svg>
        </div>
        <p style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", marginBottom: 8 }}>
          No Close sessions yet
        </p>
        <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5, maxWidth: 300, marginBottom: 24 }}>
          Send a Venn Close session to a lead and they&apos;ll answer discovery questions before you build their proposal
        </p>
        <Link href="/leads" style={{
          background: "#C4973F", color: "#0A0907", fontSize: 13, fontWeight: 500,
          fontFamily: "var(--font-inter)", textDecoration: "none", borderRadius: 6, padding: "9px 18px",
        }}>
          Go to leads
        </Link>
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="max-w-2xl">
      <h1 style={{
        fontSize: 28, color: "#FFFDF8",
        fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
        marginBottom: 24,
      }}>
        Venn Close
      </h1>

      <div className="space-y-2">
        {sessions.map((s) => {
          const st = STATUS_META[s.status] ?? STATUS_META.sent;
          const isHot = s.lastViewed ? now - new Date(s.lastViewed).getTime() < 2 * 60 * 60 * 1000 : false;
          const awaitingProposal = s.status === "discovery_complete" && !s.proposalId;
          const answeredCount = s.discoveryAnswers.length;

          return (
            <div key={s.id} style={{
              background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 8,
              padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                    {s.lead.businessName}
                  </p>
                  {isHot && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#C4973F", background: "#1a1808", border: "0.5px solid #C4973F30",
                      padding: "1px 5px", borderRadius: 3,
                    }}>HOT</span>
                  )}
                  <span style={{
                    fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: st.colour, background: st.bg, padding: "1px 6px", borderRadius: 3,
                  }}>
                    {st.label}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>
                  {s.viewCount} view{s.viewCount !== 1 ? "s" : ""}
                  {answeredCount > 0 && ` · ${answeredCount} answer${answeredCount !== 1 ? "s" : ""}`}
                  {" · "}{new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  {s.lastViewed && (
                    <> · Last viewed {new Date(s.lastViewed).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</>
                  )}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: 16, flexShrink: 0 }}>
                {awaitingProposal && (
                  <Link href={`/close/session/${s.id}`} style={{
                    fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none",
                    fontWeight: 500,
                  }}>
                    Generate proposal →
                  </Link>
                )}
                <Link href={`/close/session/${s.id}`} style={{
                  fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)", textDecoration: "none",
                }}>
                  View answers
                </Link>
                <a href={`${BASE_URL}/close/${s.slug}`} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)", textDecoration: "none",
                }}>
                  Link →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

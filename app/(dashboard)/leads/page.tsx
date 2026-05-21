import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { LeadCard } from "@/components/leads/LeadCard";
import type { IntentScore, LeadStatus } from "@/types";

export const metadata = { title: "Leads — Venn" };

const INTENT_FILTERS = [
  { label: "All", value: undefined },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [leads, total] = await Promise.all([
    getLeadsByUser(user.id, {
      status: "complete" as LeadStatus,
      limit: 100,
    }),
    getLeadCountByUser(user.id),
  ]);

  const filtered = filter
    ? leads.filter((l) => l.intentScore === filter)
    : leads;

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="mb-1"
            style={{
              fontSize: 28,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              lineHeight: 1.2,
            }}
          >
            Leads
          </h1>
          <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}>
            {total} prospect{total !== 1 ? "s" : ""} researched
          </p>
        </div>
        <Link
          href="/search"
          className="px-3 py-2 rounded transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            borderRadius: 6,
            marginTop: 4,
          }}
        >
          + New Search
        </Link>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="mb-5 flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#C4973F10",
              border: "0.5px solid #C4973F30",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </div>
          <p
            className="mb-2"
            style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
          >
            No leads yet
          </p>
          <p
            className="mb-6 max-w-xs"
            style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}
          >
            Run your first search to start building your intelligence pipeline
          </p>
          <Link
            href="/search"
            className="px-4 py-2 rounded transition-opacity hover:opacity-90"
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
            Start searching
          </Link>
        </div>
      ) : (
        <>
          {/* Intent filter pills */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-full mb-5 w-fit"
            style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18" }}
          >
            {INTENT_FILTERS.map((f) => {
              const isActive = filter === f.value || (!filter && !f.value);
              return (
                <Link
                  key={f.label}
                  href={f.value ? `/leads?filter=${f.value}` : "/leads"}
                  className="px-3 py-1 rounded-full transition-all"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: "var(--font-inter)",
                    background: isActive ? "#C4973F" : "transparent",
                    color: isActive ? "#0A0907" : "#555250",
                    textDecoration: "none",
                  }}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-2">
            {filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                id={lead.id}
                businessName={lead.businessName}
                niche={lead.niche}
                location={lead.location}
                intentScore={lead.intentScore as IntentScore}
                status={lead.status as LeadStatus}
                googleRating={lead.googleRating}
                reviewCount={lead.reviewCount}
                openingLine={lead.openingLine}
                cardSlug={lead.card?.slug ?? null}
                createdAt={lead.createdAt}
              />
            ))}
            {filtered.length === 0 && (
              <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", textAlign: "center", padding: "40px 0" }}>
                No {filter} intent leads found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

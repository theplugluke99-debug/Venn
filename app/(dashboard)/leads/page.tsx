import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { LeadCard } from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/Button";
import type { IntentScore, LeadStatus } from "@/types";

export const metadata = { title: "Leads — Venn" };

const FILTERS: Array<{ label: string; value: string | undefined }> = [
  { label: "All", value: undefined },
  { label: "Complete", value: "complete" },
  { label: "Processing", value: "scraping" },
  { label: "Failed", value: "failed" },
];

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
      status: filter as LeadStatus | undefined,
      limit: 100,
    }),
    getLeadCountByUser(user.id),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-2">
            Prospect Pipeline
          </p>
          <h1 className="text-[2.25rem] leading-tight font-serif text-[#FFFDF8]">
            Leads
          </h1>
          <p className="text-sm text-[#555] mt-1">
            {total} prospect{total !== 1 ? "s" : ""} researched
          </p>
        </div>
        <div className="mt-2">
          <Link href="/search">
            <Button>+ New Search</Button>
          </Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="border border-dashed border-[#2A2720] rounded-lg p-14 text-center">
          <p className="text-[#FFFDF8] text-sm font-medium mb-1.5">
            No leads yet
          </p>
          <p className="text-[#444] text-xs mb-6">
            Research your first prospect to get started.
          </p>
          <Link href="/search">
            <Button>Research your first prospect</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-5">
            {FILTERS.map((f) => (
              <Link
                key={f.label}
                href={f.value ? `/leads?filter=${f.value}` : "/leads"}
                className={[
                  "px-3 py-1 text-xs rounded transition-all",
                  filter === f.value || (!filter && !f.value)
                    ? "bg-[#C4973F] text-[#0A0907] font-semibold"
                    : "bg-[#1A1814] text-[#666] border border-[#2A2720] hover:text-[#FFFDF8] hover:border-[#444]",
                ].join(" ")}
              >
                {f.label}
              </Link>
            ))}
            <span className="ml-auto text-xs text-[#444]">
              {leads.length} shown
            </span>
          </div>

          <div className="space-y-2">
            {leads.map((lead) => (
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
          </div>
        </>
      )}
    </div>
  );
}

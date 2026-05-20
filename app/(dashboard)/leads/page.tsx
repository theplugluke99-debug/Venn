import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { LeadCard } from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/Button";
import type { IntentScore, LeadStatus } from "@/types";

export const metadata = { title: "Leads — Venn" };

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

  const filters: Array<{ label: string; value: string | undefined }> = [
    { label: "All", value: undefined },
    { label: "High Intent", value: "complete" },
    { label: "Processing", value: "scraping" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-1">Leads</h1>
          <p className="text-[#555] text-sm">{total} total prospects researched</p>
        </div>
        <Link href="/search">
          <Button>+ New Search</Button>
        </Link>
      </div>

      {total === 0 ? (
        <div className="border border-dashed border-[#2A2720] rounded-lg p-12 text-center">
          <p className="text-[#FFFDF8] font-medium mb-2">No leads yet</p>
          <p className="text-[#555] text-sm mb-6">
            Start by researching a prospect.
          </p>
          <Link href="/search">
            <Button>Research your first prospect</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            {filters.map((f) => (
              <Link
                key={f.label}
                href={f.value ? `/leads?filter=${f.value}` : "/leads"}
                className={[
                  "px-3 py-1 text-xs rounded transition-colors",
                  (filter === f.value || (!filter && !f.value))
                    ? "bg-[#C4973F] text-[#0A0907] font-medium"
                    : "bg-[#1A1814] text-[#888] hover:text-[#FFFDF8] border border-[#2A2720]",
                ].join(" ")}
              >
                {f.label}
              </Link>
            ))}
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

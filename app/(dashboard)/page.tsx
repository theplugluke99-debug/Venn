import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { getCardsByUser } from "@/lib/db/queries/cards";
import { LeadCard } from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/Button";
import type { IntentScore, LeadStatus } from "@/types";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [recentLeads, totalLeads, cards] = await Promise.all([
    getLeadsByUser(user.id, { limit: 5 }),
    getLeadCountByUser(user.id),
    getCardsByUser(user.id),
  ]);

  const highIntentLeads = recentLeads.filter((l: { intentScore: string }) => l.intentScore === "high").length;
  const completeLeads = recentLeads.filter((l: { status: string }) => l.status === "complete").length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-1">
          Good {getTimeOfDay()}, {user.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="text-[#555] text-sm">Your prospect intelligence overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Leads" value={totalLeads} />
        <StatCard label="Cards Generated" value={cards.length} />
        <StatCard label="High Intent" value={highIntentLeads} accent />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-[#555] uppercase tracking-wider">
            Recent Leads
          </h2>
          <Link href="/search">
            <Button size="sm" variant="primary">+ New Search</Button>
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
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
            {totalLeads > 5 ? (
              <div className="pt-2">
                <Link href="/leads" className="text-sm text-[#C4973F] hover:underline">
                  View all {totalLeads} leads →
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-5">
      <p className="text-xs text-[#555] mb-2">{label}</p>
      <p
        className={`text-3xl font-serif ${
          accent ? "text-[#C4973F]" : "text-[#FFFDF8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#2A2720] rounded-lg p-12 text-center">
      <p className="text-[#FFFDF8] font-medium mb-2">No leads yet</p>
      <p className="text-[#555] text-sm mb-6">
        Search for a business to generate your first intelligence profile.
      </p>
      <Link href="/search">
        <Button>Research your first prospect</Button>
      </Link>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

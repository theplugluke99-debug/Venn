import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadsByUser, getLeadCountByUser } from "@/lib/db/queries/leads";
import { getCardsByUser } from "@/lib/db/queries/cards";
import { LeadCard } from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/Button";
import type { IntentScore, LeadStatus } from "@/types";

export const metadata = { title: "Overview — Venn" };

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [recentLeads, totalLeads, cards] = await Promise.all([
    getLeadsByUser(user.id, { limit: 6 }),
    getLeadCountByUser(user.id),
    getCardsByUser(user.id),
  ]);

  const highIntentCount = recentLeads.filter(
    (l: { intentScore: string }) => l.intentScore === "high"
  ).length;
  const totalViews = cards.reduce(
    (sum: number, c: { viewCount: number }) => sum + c.viewCount,
    0
  );

  const greeting = getGreeting();
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-[2.25rem] leading-tight font-serif text-[#FFFDF8] mb-2">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-[#555]">
          {totalLeads === 0
            ? "No leads yet — run your first search to get started."
            : `${totalLeads} prospect${totalLeads !== 1 ? "s" : ""} in the pipeline.`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard label="Prospects" value={totalLeads} sub="researched" />
        <StatCard label="High Intent" value={highIntentCount} sub="from latest batch" accent />
        <StatCard label="Cards" value={cards.length} sub="generated" />
        <StatCard label="Card Views" value={totalViews} sub="total" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium">
            Recent Leads
          </h2>
          <Link href="/search">
            <Button size="sm" variant="primary">
              + New Search
            </Button>
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
            {totalLeads > 6 ? (
              <div className="pt-3">
                <Link
                  href="/leads"
                  className="text-sm text-[#C4973F] hover:text-[#E8B44B] transition-colors"
                >
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
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-5">
      <p className="text-[11px] text-[#444] uppercase tracking-[0.08em] font-medium mb-3">
        {label}
      </p>
      <p
        className={`text-[2rem] leading-none font-serif mb-1.5 ${
          accent ? "text-[#C4973F]" : "text-[#FFFDF8]"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-[#444]">{sub}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#2A2720] rounded-lg p-14 text-center">
      <div className="w-10 h-10 border border-[#2A2720] rounded-lg flex items-center justify-center mx-auto mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#555" strokeWidth="1.5">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M12.5 12.5L16 16" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[#FFFDF8] text-sm font-medium mb-1.5">No leads yet</p>
      <p className="text-[#444] text-xs mb-6 max-w-xs mx-auto leading-relaxed">
        Research a prospect and we'll build a full intelligence profile in under a minute.
      </p>
      <Link href="/search">
        <Button>Research your first prospect</Button>
      </Link>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

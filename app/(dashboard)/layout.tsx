import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertUser } from "@/lib/db/queries/users";
import { getLeadsByUser } from "@/lib/db/queries/leads";
import { getCardsByUser } from "@/lib/db/queries/cards";
import { DashboardProvider } from "@/components/layout/DashboardProvider";
import { DashboardShell } from "@/components/layout/DashboardShell";

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (email ?? "?").slice(0, 2).toUpperCase();
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  let userName: string | undefined;
  let userEmail: string | undefined;
  let userId: string | undefined;

  if (clerkUser) {
    const user = await upsertUser({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser.fullName ?? undefined,
    });
    userName = clerkUser.firstName ?? clerkUser.fullName?.split(" ")[0] ?? undefined;
    userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    userId = user.id;
  }

  // Fetch pipeline data for right panel
  const [leads, cards] = userId
    ? await Promise.all([
        getLeadsByUser(userId, { limit: 100 }),
        getCardsByUser(userId),
      ])
    : [[], []];

  const completedLeads = leads.filter((l) => l.status === "complete");
  const counts = {
    high: completedLeads.filter((l) => l.intentScore === "high").length,
    medium: completedLeads.filter((l) => l.intentScore === "medium").length,
    low: completedLeads.filter((l) => l.intentScore === "low").length,
    total: completedLeads.length,
  };

  // Build activity feed from recent leads + cards
  type ActivityType = "reply" | "card_sent" | "card_viewed" | "lead_added";
  const activity: { type: ActivityType; text: string; timestamp: string; sortDate: Date }[] = [];

  for (const card of cards.slice(0, 5)) {
    if (card.lastViewed) {
      activity.push({
        type: "card_viewed",
        text: `${card.lead?.businessName ?? "Card"} viewed your card`,
        timestamp: timeAgo(new Date(card.lastViewed)),
        sortDate: new Date(card.lastViewed),
      });
    }
    activity.push({
      type: "card_sent",
      text: `Card sent to ${card.lead?.businessName ?? "prospect"}`,
      timestamp: timeAgo(new Date(card.createdAt)),
      sortDate: new Date(card.createdAt),
    });
  }

  for (const lead of leads.slice(0, 5)) {
    activity.push({
      type: "lead_added",
      text: `${lead.businessName} added to pipeline`,
      timestamp: timeAgo(new Date(lead.createdAt)),
      sortDate: new Date(lead.createdAt),
    });
  }

  activity.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  const recentActivity = activity.slice(0, 8).map(({ type, text, timestamp }) => ({
    type,
    text,
    timestamp,
  }));

  const userInitials = getInitials(userName, userEmail);

  return (
    <DashboardProvider>
      <DashboardShell
        userName={userName}
        userInitials={userInitials}
        counts={counts}
        activity={recentActivity}
      >
        {children}
      </DashboardShell>
    </DashboardProvider>
  );
}

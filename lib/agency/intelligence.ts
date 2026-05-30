import { db } from "@/lib/db";

export interface BriefingItem {
  type: string;
  clientName?: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export interface PriorityItem {
  urgency: "urgent" | "attention" | "today" | "normal";
  urgencyLabel: string;
  headline: string;
  context: string;
  actionLabel: string;
  actionHref: string;
}

export interface AgencyIntelligence {
  hasClients: boolean;
  activeClientCount: number;

  // Briefing metrics
  unhealthyCount: number;
  overdueCount: number;
  dueTodayCount: number;
  proposalsHot24hCount: number;
  proposalsHot2hCount: number;
  checkInsOverdue14dCount: number;
  contractsEnding30dCount: number;
  unansweredQuestionsCount: number;
  nextDeliverable: { title: string; clientName: string; dueDate: string } | null;

  // Focus mode
  topPriority: PriorityItem | null;

  // Today mode
  hotProposals: Array<{
    leadId: string;
    leadName: string;
    viewCount: number;
    lastViewedAt: string;
    proposalId: string;
    proposalSlug: string;
  }>;
  urgentClients: Array<{ id: string; name: string; healthScore: number; reason: string }>;
  dueToday: Array<{ id: string; clientId: string; clientName: string; title: string }>;
  needsAttention: Array<{
    type: string;
    clientId?: string;
    clientName?: string;
    title: string;
    href: string;
  }>;
  upcoming: Array<{
    type: string;
    clientId?: string;
    clientName?: string;
    title: string;
    date: string;
  }>;

  // Briefing items (max 5)
  briefingItems: BriefingItem[];

  // Weekly summary (Mondays only)
  weeklySummary: {
    deliverablesCompleted: number;
    checkIns: number;
    proposalsSent: number;
    revenueActive: number;
    deliverablesDueThisWeek: number;
    renewalsApproaching: number;
    clientsNeedingAttention: number;
    recommendedFocus: {
      clientName: string;
      clientId: string;
      reason: string;
      contractRenewsIn: number | null;
    } | null;
  } | null;
}

const EMPTY: AgencyIntelligence = {
  hasClients: false,
  activeClientCount: 0,
  unhealthyCount: 0,
  overdueCount: 0,
  dueTodayCount: 0,
  proposalsHot24hCount: 0,
  proposalsHot2hCount: 0,
  checkInsOverdue14dCount: 0,
  contractsEnding30dCount: 0,
  unansweredQuestionsCount: 0,
  nextDeliverable: null,
  topPriority: null,
  hotProposals: [],
  urgentClients: [],
  dueToday: [],
  needsAttention: [],
  upcoming: [],
  briefingItems: [],
  weeklySummary: null,
};

export async function computeAgencyIntelligence(userId: string): Promise<AgencyIntelligence> {
  const now = new Date();
  const DAY = 86_400_000;
  const HOUR = 3_600_000;

  const oneHourAgo = new Date(now.getTime() - HOUR);
  const twoHoursAgo = new Date(now.getTime() - 2 * HOUR);
  const twelveHoursAgo = new Date(now.getTime() - 12 * HOUR);
  const twentyFourHoursAgo = new Date(now.getTime() - DAY);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + DAY);
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * DAY);
  const twentyOneDaysAgo = new Date(now.getTime() - 21 * DAY);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * DAY);
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * DAY);
  const threeDaysFromNow = new Date(now.getTime() + 3 * DAY);
  const weekStart = new Date(now.getTime() - 7 * DAY);
  const lastWeekStart = new Date(now.getTime() - 14 * DAY);
  const nextSevenDays = new Date(now.getTime() + 7 * DAY);

  const clients = await db.client.findMany({
    where: { userId, status: "active" },
    include: {
      deliverables: { orderBy: { dueDate: "asc" } },
      checkIns: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { healthScore: "asc" },
  });

  if (clients.length === 0) return EMPTY;

  const proposals = await db.proposal.findMany({
    where: { userId, status: { not: "draft" } },
    include: {
      lead: { select: { id: true, businessName: true } },
      questions: { where: { answer: null } },
    },
    orderBy: { lastViewedAt: "desc" },
  });

  const isMonday = now.getDay() === 1;

  // ── Weekly summary (Monday only) ──────────────────────────────────────────
  let weeklySummary: AgencyIntelligence["weeklySummary"] = null;
  if (isMonday) {
    const [deliverablesCompleted, checkIns, proposalsSent] = await Promise.all([
      db.deliverable.count({
        where: { userId, status: "complete", completedAt: { gte: lastWeekStart, lt: weekStart } },
      }),
      db.clientCheckIn.count({
        where: { userId, createdAt: { gte: lastWeekStart, lt: weekStart } },
      }),
      db.proposal.count({
        where: { userId, createdAt: { gte: lastWeekStart, lt: weekStart } },
      }),
    ]);

    const revenueActive = clients.reduce((s, c) => s + (c.contractValue ?? 0), 0);
    const deliverablesDueThisWeek = clients.reduce(
      (s, c) =>
        s +
        c.deliverables.filter(
          (d) => d.status !== "complete" && d.dueDate && d.dueDate >= now && d.dueDate <= nextSevenDays
        ).length,
      0
    );
    const renewalsApproaching = clients.filter(
      (c) => c.contractEndDate && c.contractEndDate >= now && c.contractEndDate <= thirtyDaysFromNow
    ).length;
    const clientsNeedingAttention = clients.filter((c) => c.healthScore < 60).length;

    let recommendedFocus: NonNullable<AgencyIntelligence["weeklySummary"]>["recommendedFocus"] = null;
    const withContractAndLowHealth = clients
      .filter((c) => c.healthScore < 70 && c.contractEndDate && c.contractEndDate >= now)
      .sort((a, b) => a.contractEndDate!.getTime() - b.contractEndDate!.getTime());

    if (withContractAndLowHealth.length > 0) {
      const top = withContractAndLowHealth[0];
      const contractRenewsIn = Math.floor(
        (top.contractEndDate!.getTime() - now.getTime()) / DAY
      );
      recommendedFocus = {
        clientName: top.businessName,
        clientId: top.id,
        reason: `Their health has been declining and their contract renews in ${contractRenewsIn} days. A strong month now makes renewal easier.`,
        contractRenewsIn,
      };
    } else if (clients[0]?.healthScore < 60) {
      recommendedFocus = {
        clientName: clients[0].businessName,
        clientId: clients[0].id,
        reason: `Their health score is ${clients[0].healthScore} — address it before it drops further.`,
        contractRenewsIn: null,
      };
    }

    weeklySummary = {
      deliverablesCompleted,
      checkIns,
      proposalsSent,
      revenueActive,
      deliverablesDueThisWeek,
      renewalsApproaching,
      clientsNeedingAttention,
      recommendedFocus,
    };
  }

  // ── Compute from clients ──────────────────────────────────────────────────
  const unhealthyClients = clients.filter((c) => c.healthScore < 60);

  const overdueDeliverables = clients.flatMap((c) =>
    c.deliverables
      .filter((d) => d.status !== "complete" && d.dueDate && d.dueDate < now)
      .map((d) => ({ id: d.id, clientId: c.id, clientName: c.businessName, title: d.title, dueDate: d.dueDate! }))
  );

  const dueTodayDeliverables = clients.flatMap((c) =>
    c.deliverables
      .filter(
        (d) => d.status !== "complete" && d.dueDate && d.dueDate >= todayStart && d.dueDate < tomorrowStart
      )
      .map((d) => ({ id: d.id, clientId: c.id, clientName: c.businessName, title: d.title }))
  );

  const hotProposalsList = proposals
    .filter((p) => p.lastViewedAt && p.lastViewedAt >= twoHoursAgo)
    .map((p) => ({
      leadId: p.lead.id,
      leadName: p.lead.businessName,
      viewCount: p.viewCount,
      lastViewedAt: p.lastViewedAt!.toISOString(),
      proposalId: p.id,
      proposalSlug: p.slug,
    }));

  const proposals24h = proposals.filter(
    (p) => p.lastViewedAt && p.lastViewedAt >= twentyFourHoursAgo
  );

  const checkInsOverdue = clients.filter((c) => {
    const last = c.checkIns[0];
    return !last || new Date(last.createdAt) < fourteenDaysAgo;
  });

  const contractsEnding = clients.filter(
    (c) => c.contractEndDate && c.contractEndDate >= now && c.contractEndDate <= thirtyDaysFromNow
  );

  const unansweredQuestions = proposals.flatMap((p) =>
    p.questions.filter((q) => new Date(q.createdAt) < twentyFourHoursAgo)
  );

  const futureDeliverables = clients
    .flatMap((c) =>
      c.deliverables
        .filter((d) => d.status !== "complete" && d.dueDate && d.dueDate >= tomorrowStart)
        .map((d) => ({ title: d.title, clientName: c.businessName, dueDate: d.dueDate! }))
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const nextDeliverable = futureDeliverables[0]
    ? {
        title: futureDeliverables[0].title,
        clientName: futureDeliverables[0].clientName,
        dueDate: futureDeliverables[0].dueDate.toISOString(),
      }
    : null;

  // ── Priority algorithm ────────────────────────────────────────────────────
  let topPriority: AgencyIntelligence["topPriority"] = null;

  // 1. HOT proposal viewed < 1hr
  if (!topPriority) {
    const p = proposals.find((p) => p.lastViewedAt && p.lastViewedAt >= oneHourAgo);
    if (p) {
      topPriority = {
        urgency: "urgent",
        urgencyLabel: "URGENT",
        headline: "Your proposal is being read right now.",
        context: `${p.lead.businessName} has viewed it ${p.viewCount} time${p.viewCount === 1 ? "" : "s"}. This is warm — reach out now.`,
        actionLabel: "View proposal →",
        actionHref: `/proposals/${p.id}`,
      };
    }
  }

  // 2. Client health < 40
  if (!topPriority) {
    const c = clients.find((c) => c.healthScore < 40);
    if (c) {
      topPriority = {
        urgency: "urgent",
        urgencyLabel: "URGENT",
        headline: `${c.businessName} is at risk.`,
        context: `Health score ${c.healthScore}. This needs immediate attention — a client at this level is close to churning.`,
        actionLabel: "View client →",
        actionHref: `/clients/${c.id}`,
      };
    }
  }

  // 3. Overdue deliverable for at-risk client (health < 60)
  if (!topPriority) {
    const od = overdueDeliverables.find((d) => {
      const c = clients.find((cl) => cl.id === d.clientId);
      return c && c.healthScore < 60;
    });
    if (od) {
      const c = clients.find((cl) => cl.id === od.clientId)!;
      const daysLate = Math.floor((now.getTime() - od.dueDate.getTime()) / DAY);
      topPriority = {
        urgency: "urgent",
        urgencyLabel: "URGENT",
        headline: `This deliverable is ${daysLate} day${daysLate === 1 ? "" : "s"} late.`,
        context: `"${od.title}" for ${c.businessName}. Their health is already ${c.healthScore} — overdue work makes this worse.`,
        actionLabel: `View ${c.businessName} →`,
        actionHref: `/clients/${c.id}`,
      };
    }
  }

  // 4. Unanswered proposal question > 24hrs
  if (!topPriority && unansweredQuestions.length > 0) {
    const oldest = [...unansweredQuestions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];
    const p = proposals.find((p) => p.questions.some((q) => q.id === oldest.id))!;
    const hoursAgo = Math.floor((now.getTime() - new Date(oldest.createdAt).getTime()) / HOUR);
    topPriority = {
      urgency: "attention",
      urgencyLabel: "ATTENTION NEEDED",
      headline: "A question on your proposal hasn't been answered.",
      context: `${p.lead.businessName} asked ${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago. Unanswered questions lose deals.`,
      actionLabel: "Answer the question →",
      actionHref: `/proposals/${p.id}`,
    };
  }

  // 5. Contract ending < 14 days
  if (!topPriority) {
    const c = clients.find(
      (c) => c.contractEndDate && c.contractEndDate >= now && c.contractEndDate <= fourteenDaysFromNow
    );
    if (c) {
      const daysUntil = Math.floor((c.contractEndDate!.getTime() - now.getTime()) / DAY);
      topPriority = {
        urgency: "attention",
        urgencyLabel: "ATTENTION NEEDED",
        headline: `${c.businessName}'s contract ends in ${daysUntil} day${daysUntil === 1 ? "" : "s"}.`,
        context: `Start the renewal conversation now — not in ${daysUntil} days. The earlier you have this conversation, the better the outcome.`,
        actionLabel: "View client →",
        actionHref: `/clients/${c.id}`,
      };
    }
  }

  // 6. Client health 40-59
  if (!topPriority) {
    const c = clients.find((c) => c.healthScore >= 40 && c.healthScore < 60);
    if (c) {
      topPriority = {
        urgency: "attention",
        urgencyLabel: "ATTENTION NEEDED",
        headline: `${c.businessName} is showing warning signs.`,
        context: `Health score ${c.healthScore}. Act this week before it drops further.`,
        actionLabel: "View client →",
        actionHref: `/clients/${c.id}`,
      };
    }
  }

  // 7. Any overdue deliverable
  if (!topPriority && overdueDeliverables.length > 0) {
    const od = [...overdueDeliverables].sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    )[0];
    const daysLate = Math.floor((now.getTime() - od.dueDate.getTime()) / DAY);
    topPriority = {
      urgency: "attention",
      urgencyLabel: "ATTENTION NEEDED",
      headline: `This deliverable is ${daysLate} day${daysLate === 1 ? "" : "s"} late.`,
      context: `"${od.title}" for ${od.clientName}. Complete or communicate — either is better than silence.`,
      actionLabel: `View ${od.clientName} →`,
      actionHref: `/clients/${od.clientId}`,
    };
  }

  // 8. Check-in overdue > 21 days
  if (!topPriority) {
    const c = clients.find((c) => {
      const last = c.checkIns[0];
      return !last || new Date(last.createdAt) < twentyOneDaysAgo;
    });
    if (c) {
      const last = c.checkIns[0];
      const daysAgoNum = last
        ? Math.floor((now.getTime() - new Date(last.createdAt).getTime()) / DAY)
        : null;
      topPriority = {
        urgency: "attention",
        urgencyLabel: "ATTENTION NEEDED",
        headline: `${c.businessName} is going quiet.`,
        context: daysAgoNum
          ? `No check-in in ${daysAgoNum} days. Regular contact is what keeps clients renewing.`
          : "You haven't logged a check-in yet. Schedule one this week.",
        actionLabel: "Log a check-in →",
        actionHref: `/clients/${c.id}`,
      };
    }
  }

  // 9. Proposal viewed today
  if (!topPriority) {
    const p = proposals.find((p) => p.lastViewedAt && p.lastViewedAt >= todayStart);
    if (p) {
      topPriority = {
        urgency: "today",
        urgencyLabel: "TODAY",
        headline: `${p.lead.businessName} viewed your proposal today.`,
        context: `${p.viewCount} view${p.viewCount === 1 ? "" : "s"} total. They're considering it — this is the right time to follow up.`,
        actionLabel: "View proposal →",
        actionHref: `/proposals/${p.id}`,
      };
    }
  }

  // 10. Deliverable due today
  if (!topPriority && dueTodayDeliverables.length > 0) {
    const d = dueTodayDeliverables[0];
    topPriority = {
      urgency: "today",
      urgencyLabel: "TODAY",
      headline: "You have a deliverable due today.",
      context: `"${d.title}" for ${d.clientName}. Complete it today to keep their health score strong.`,
      actionLabel: `View ${d.clientName} →`,
      actionHref: `/clients/${d.clientId}`,
    };
  }

  // ── Today mode sections ───────────────────────────────────────────────────
  const urgentClients = clients
    .filter((c) => {
      if (c.healthScore < 40) return true;
      if (c.healthScore < 60) {
        return c.deliverables.some(
          (d) => d.status !== "complete" && d.dueDate && d.dueDate < sevenDaysAgo
        );
      }
      return false;
    })
    .map((c) => ({
      id: c.id,
      name: c.businessName,
      healthScore: c.healthScore,
      reason:
        c.healthScore < 40
          ? `Health score ${c.healthScore} — prioritise immediately`
          : "Overdue deliverable for at-risk client",
    }));

  const urgentClientIds = new Set(urgentClients.map((u) => u.id));

  const needsAttention: AgencyIntelligence["needsAttention"] = [];

  // Health 40-60 (not already urgent)
  clients
    .filter((c) => c.healthScore >= 40 && c.healthScore < 60 && !urgentClientIds.has(c.id))
    .forEach((c) => {
      needsAttention.push({
        type: "health",
        clientId: c.id,
        clientName: c.businessName,
        title: `Health ${c.healthScore} — needs attention this week`,
        href: `/clients/${c.id}`,
      });
    });

  // Overdue < 7 days (not for urgent clients)
  overdueDeliverables
    .filter((d) => {
      const daysLate = Math.floor((now.getTime() - d.dueDate.getTime()) / DAY);
      return daysLate < 7 && !urgentClientIds.has(d.clientId);
    })
    .forEach((d) => {
      needsAttention.push({
        type: "overdue",
        clientId: d.clientId,
        clientName: d.clientName,
        title: `"${d.title}" is overdue`,
        href: `/clients/${d.clientId}`,
      });
    });

  // Check-ins 14-21 days
  clients
    .filter((c) => {
      const last = c.checkIns[0];
      if (!last) return false;
      const d = new Date(last.createdAt);
      return d < fourteenDaysAgo && d >= twentyOneDaysAgo;
    })
    .forEach((c) => {
      const daysAgoNum = Math.floor(
        (now.getTime() - new Date(c.checkIns[0]!.createdAt).getTime()) / DAY
      );
      needsAttention.push({
        type: "checkin",
        clientId: c.id,
        clientName: c.businessName,
        title: `No check-in in ${daysAgoNum} days`,
        href: `/clients/${c.id}`,
      });
    });

  // Unanswered proposal questions 12-24hrs
  proposals.forEach((p) => {
    const has = p.questions.some((q) => {
      const d = new Date(q.createdAt);
      return d < twelveHoursAgo && d >= twentyFourHoursAgo;
    });
    if (has) {
      needsAttention.push({
        type: "question",
        clientName: p.lead.businessName,
        title: "Unanswered proposal question",
        href: `/proposals/${p.id}`,
      });
    }
  });

  // Upcoming (next 3 days: deliverables not today + renewals)
  const upcoming: AgencyIntelligence["upcoming"] = [];
  clients.forEach((c) => {
    c.deliverables
      .filter(
        (d) =>
          d.status !== "complete" &&
          d.dueDate &&
          d.dueDate > tomorrowStart &&
          d.dueDate <= threeDaysFromNow
      )
      .forEach((d) => {
        upcoming.push({
          type: "deliverable",
          clientId: c.id,
          clientName: c.businessName,
          title: d.title,
          date: d.dueDate!.toISOString(),
        });
      });
  });
  contractsEnding.slice(0, 3).forEach((c) => {
    upcoming.push({
      type: "renewal",
      clientId: c.id,
      clientName: c.businessName,
      title: "Contract renewal",
      date: c.contractEndDate!.toISOString(),
    });
  });
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // ── Briefing items (max 5) ─────────────────────────────────────────────────
  const briefingItems: BriefingItem[] = [];

  const longOverdueCheckIn = checkInsOverdue.find((c) => {
    const last = c.checkIns[0];
    return !last || new Date(last.createdAt) < twentyOneDaysAgo;
  });
  const anyOverdueCheckIn = longOverdueCheckIn ?? checkInsOverdue[0];
  if (anyOverdueCheckIn) {
    const last = anyOverdueCheckIn.checkIns[0];
    const daysAgoNum = last
      ? Math.floor((now.getTime() - new Date(last.createdAt).getTime()) / DAY)
      : null;
    briefingItems.push({
      type: "checkin",
      clientName: anyOverdueCheckIn.businessName,
      description: daysAgoNum ? `No check-in in ${daysAgoNum} days` : "No check-in logged yet",
      actionLabel: "Log check-in",
      actionHref: `/clients/${anyOverdueCheckIn.id}`,
    });
  }

  if (overdueDeliverables.length > 0) {
    const d = overdueDeliverables[0];
    briefingItems.push({
      type: "overdue",
      clientName: d.clientName,
      description: `"${d.title}" is overdue`,
      actionLabel: "View deliverable",
      actionHref: `/clients/${d.clientId}`,
    });
  }

  const hotProposalForBriefing = proposals.find(
    (p) => p.lastViewedAt && p.lastViewedAt >= twoHoursAgo
  );
  if (hotProposalForBriefing) {
    briefingItems.push({
      type: "hot_proposal",
      clientName: hotProposalForBriefing.lead.businessName,
      description: `Proposal is hot — viewed ${hotProposalForBriefing.viewCount} time${hotProposalForBriefing.viewCount === 1 ? "" : "s"} recently`,
      actionLabel: "View proposal",
      actionHref: `/proposals/${hotProposalForBriefing.id}`,
    });
  }

  if (dueTodayDeliverables.length > 0 && briefingItems.length < 5) {
    const d = dueTodayDeliverables[0];
    briefingItems.push({
      type: "due_today",
      clientName: d.clientName,
      description: `"${d.title}" is due today`,
      actionLabel: "Mark complete",
      actionHref: `/clients/${d.clientId}`,
    });
  }

  if (unansweredQuestions.length > 0 && briefingItems.length < 5) {
    const p = proposals.find((p) => p.questions.some((q) => unansweredQuestions.some((uq) => uq.id === q.id)));
    if (p) {
      briefingItems.push({
        type: "question",
        clientName: p.lead.businessName,
        description: "Unanswered proposal question — waiting more than 24 hours",
        actionLabel: "Answer now",
        actionHref: `/proposals/${p.id}`,
      });
    }
  }

  return {
    hasClients: true,
    activeClientCount: clients.length,
    unhealthyCount: unhealthyClients.length,
    overdueCount: overdueDeliverables.length,
    dueTodayCount: dueTodayDeliverables.length,
    proposalsHot24hCount: proposals24h.length,
    proposalsHot2hCount: hotProposalsList.length,
    checkInsOverdue14dCount: checkInsOverdue.length,
    contractsEnding30dCount: contractsEnding.length,
    unansweredQuestionsCount: unansweredQuestions.length,
    nextDeliverable,
    topPriority,
    hotProposals: hotProposalsList,
    urgentClients,
    dueToday: dueTodayDeliverables,
    needsAttention,
    upcoming: upcoming.slice(0, 5),
    briefingItems: briefingItems.slice(0, 5),
    weeklySummary,
  };
}

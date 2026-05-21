import { db } from "@/lib/db";

export type EventType =
  | "first_search"
  | "first_lead_complete"
  | "first_card_generated"
  | "first_card_viewed"
  | "first_card_opened_twice"
  | "first_reply_logged"
  | "first_deal_closed"
  | "search_milestone_10"
  | "search_milestone_25"
  | "leads_milestone_50"
  | "leads_milestone_100"
  | "cards_milestone_10"
  | "cards_milestone_50"
  | "member_month_1"
  | "member_month_3"
  | "member_month_6"
  | "member_month_12";

const EVENT_TITLES: Record<EventType, string> = {
  first_search: "First search",
  first_lead_complete: "First lead complete",
  first_card_generated: "First prospect card",
  first_card_viewed: "First card viewed",
  first_card_opened_twice: "Card opened twice",
  first_reply_logged: "First reply",
  first_deal_closed: "First deal closed",
  search_milestone_10: "10 searches",
  search_milestone_25: "25 searches",
  leads_milestone_50: "50 leads found",
  leads_milestone_100: "100 leads found",
  cards_milestone_10: "10 cards sent",
  cards_milestone_50: "50 cards sent",
  member_month_1: "One month with Venn",
  member_month_3: "Three months with Venn",
  member_month_6: "Six months with Venn",
  member_month_12: "One year with Venn",
};

const EVENT_DESCRIPTIONS: Record<EventType, string> = {
  first_search: "You ran your first intelligence search.",
  first_lead_complete: "Your first lead is fully enriched and ready.",
  first_card_generated: "Your first prospect card is live.",
  first_card_viewed: "Someone opened your card for the first time.",
  first_card_opened_twice: "A prospect is coming back to your card.",
  first_reply_logged: "Someone replied. The hardest part is done.",
  first_deal_closed: "You closed a deal through Venn.",
  search_milestone_10: "10 searches and counting.",
  search_milestone_25: "25 searches. Your pipeline is real.",
  leads_milestone_50: "50 leads found. You're building something.",
  leads_milestone_100: "100 leads. This is a proper pipeline now.",
  cards_milestone_10: "10 cards in the wild.",
  cards_milestone_50: "50 cards sent. You've put serious work in.",
  member_month_1: "One month of building with Venn.",
  member_month_3: "Three months. Your pipeline is real now.",
  member_month_6: "Six months with Venn. Thank you.",
  member_month_12: "One year. This is something.",
};

export async function logEvent(
  userId: string,
  type: EventType,
  metadata?: Record<string, unknown>
): Promise<{ isNew: boolean; event: { id: string; type: string; title: string } | null }> {
  try {
    const event = await db.userEvent.create({
      data: {
        userId,
        type,
        title: EVENT_TITLES[type],
        description: EVENT_DESCRIPTIONS[type],
        metadata: metadata ? (metadata as object) : undefined,
      },
    });
    return { isNew: true, event: { id: event.id, type: event.type, title: event.title } };
  } catch {
    // Unique constraint violation — event already exists for this user
    return { isNew: false, event: null };
  }
}

export async function checkAndLogMilestones(userId: string): Promise<EventType[]> {
  const achieved: EventType[] = [];

  const [searchCount, leadCount, cardCount] = await Promise.all([
    db.lead.count({ where: { userId } }),
    db.lead.count({ where: { userId, status: "complete" } }),
    db.card.count({ where: { userId } }),
  ]);

  const milestones: Array<[EventType, boolean]> = [
    ["first_search", searchCount >= 1],
    ["search_milestone_10", searchCount >= 10],
    ["search_milestone_25", searchCount >= 25],
    ["leads_milestone_50", leadCount >= 50],
    ["leads_milestone_100", leadCount >= 100],
    ["first_card_generated", cardCount >= 1],
    ["cards_milestone_10", cardCount >= 10],
    ["cards_milestone_50", cardCount >= 50],
  ];

  for (const [type, condition] of milestones) {
    if (condition) {
      const result = await logEvent(userId, type);
      if (result.isNew) achieved.push(type);
    }
  }

  return achieved;
}

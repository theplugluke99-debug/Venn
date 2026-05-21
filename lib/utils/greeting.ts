interface GreetingContext {
  name: string;
  hasHotLead: boolean;
  hotLeadName?: string;
  daysSinceLastLogin: number;
  dealJustClosed: boolean;
  solopreneurDaysLeft?: number;
  dayOfWeek: number; // 0=Sun, 1=Mon ... 6=Sat
  hour: number;
  weeklyCardCount: number;
  weeklyCardCountLastWeek: number;
  memberDays: number;
}

export function getGreeting(ctx: GreetingContext): { headline: string; subline?: string } {
  const { name, hasHotLead, hotLeadName, daysSinceLastLogin, dealJustClosed,
    solopreneurDaysLeft, dayOfWeek, hour, weeklyCardCount, weeklyCardCountLastWeek, memberDays } = ctx;
  const firstName = name.split(" ")[0];

  if (dealJustClosed) {
    return { headline: "Still thinking about that win.", subline: `Well done, ${firstName}.` };
  }

  // Member anniversaries
  if (memberDays === 365) {
    return { headline: "One year.", subline: "This is something." };
  }
  if (memberDays === 180) {
    return { headline: "Six months. Thank you for building with us.", subline: undefined };
  }
  if (memberDays === 90) {
    return { headline: "Three months with Venn.", subline: "Your pipeline is real now." };
  }
  if (memberDays === 30) {
    return { headline: "One month.", subline: "You've built more than you think." };
  }

  if (hasHotLead && hotLeadName) {
    return {
      headline: `${hotLeadName} opened your card recently.`,
      subline: "Worth a follow up today.",
    };
  }

  if (daysSinceLastLogin >= 5) {
    return {
      headline: daysSinceLastLogin >= 14 ? `${daysSinceLastLogin} days.` : "Good to see you.",
      subline: "A few things happened while you were away.",
    };
  }

  if (solopreneurDaysLeft !== undefined && solopreneurDaysLeft < 14) {
    return {
      headline: `${solopreneurDaysLeft} days left.`,
      subline: "Your pipeline is warmer than you think.",
    };
  }

  // High performance week
  if (weeklyCardCount > weeklyCardCountLastWeek * 1.5 && weeklyCardCount > 0) {
    return { headline: "Strong week.", subline: "Keep this up." };
  }

  if (dayOfWeek === 1 && hour < 12) {
    return { headline: "New week.", subline: "Your highest priority lead is waiting." };
  }

  if (dayOfWeek === 5 && hour >= 14) {
    return {
      headline: "Good week.",
      subline: weeklyCardCount > 0 ? `You've sent ${weeklyCardCount} cards.` : "Keep the momentum going.",
    };
  }

  const timeGreeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    "Good evening";

  return { headline: `${timeGreeting}, ${firstName}.` };
}

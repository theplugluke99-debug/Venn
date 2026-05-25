export function closeDiscoveryCompletedHtml({
  agencyOwnerName,
  businessName,
  questions,
  answers,
  sessionUrl,
  generateUrl,
}: {
  agencyOwnerName: string;
  businessName: string;
  questions: Array<{ text: string }>;
  answers: Record<string, string>;
  sessionUrl: string;
  generateUrl: string;
}): string {
  const firstName = agencyOwnerName.split(" ")[0];
  const qaRows = questions
    .map((q, i) => {
      const ans = answers[String(i)] ?? answers[String(i + 1)] ?? "No answer";
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;vertical-align:top;">
          <p style="font-style:italic;color:#1a1a18;margin:0 0 6px;font-size:14px;">${q.text}</p>
          <p style="color:#555;margin:0;font-size:13px;line-height:1.6;">${ans}</p>
        </td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a18;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  <p><strong>${businessName}</strong> just completed their Venn Close discovery. Here's what they said:</p>
  <table style="width:100%;border-collapse:collapse;margin:24px 0;">${qaRows}</table>
  <p>Generate their proposal now while this is fresh:</p>
  <p>
    <a href="${generateUrl}" style="display:inline-block;background:#C4973F;color:#0A0907;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px;margin-bottom:8px;">Generate proposal →</a>
  </p>
  <p><a href="${sessionUrl}" style="color:#C4973F;font-size:13px;">View session in dashboard →</a></p>
  <p style="margin-top:32px;">— Venn</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
  <p style="font-size:12px;color:#999;">Venn · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#999;">venn.so</a></p>
</body>
</html>`;
}

export function closeViewedHtml({
  agencyOwnerName,
  businessName,
  sessionUrl,
}: {
  agencyOwnerName: string;
  businessName: string;
  sessionUrl: string;
}): string {
  const firstName = agencyOwnerName.split(" ")[0];
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a18;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  <p><strong>${businessName}</strong> just opened their Venn Close discovery for the first time.</p>
  <p>They're reading your questions now.</p>
  <p><a href="${sessionUrl}" style="color:#C4973F;">View session →</a></p>
  <p style="margin-top:32px;">— Venn</p>
</body>
</html>`;
}

export function proposalQuestionNotificationHtml({
  agencyOwnerName,
  businessName,
  visitorName,
  question,
  answerUrl,
}: {
  agencyOwnerName: string;
  businessName: string;
  visitorName: string;
  question: string;
  answerUrl: string;
}): string {
  const firstName = agencyOwnerName.split(" ")[0];
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  <p><strong>${visitorName}</strong> from <strong>${businessName}</strong> just asked a question on your proposal:</p>
  <blockquote style="border-left:3px solid #C4973F;margin:16px 0;padding:0 16px;color:#555;font-style:italic;">"${question}"</blockquote>
  <p>Answer it now while it's fresh — unanswered questions lose deals.</p>
  <p><a href="${answerUrl}" style="display:inline-block;background:#C4973F;color:#0A0907;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px;">Answer this question →</a></p>
  <p style="margin-top:32px;">— Venn</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
  <p style="font-size:12px;color:#999;">Venn · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#999;">venn.so</a></p>
</body>
</html>`;
}

export function proposalViewedHtml({
  agencyOwnerName,
  businessName,
  proposalUrl,
}: {
  agencyOwnerName: string;
  businessName: string;
  proposalUrl: string;
}): string {
  const firstName = agencyOwnerName.split(" ")[0];
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  <p><strong>${businessName}</strong> just opened your proposal for the first time.</p>
  <p>Now is a good moment to send a brief follow-up — something like: <em>"Just checking you got it. Happy to answer any questions on a quick call."</em></p>
  <p><a href="${proposalUrl}" style="color:#C4973F;">View the proposal →</a></p>
  <p style="margin-top:32px;">— Venn</p>
</body>
</html>`;
}

export function solopreneurApprovedHtml(name: string, expiryDate: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${name} —</p>
  <p>You're in.</p>
  <p>Your 30-day Solopreneur trial is active now. Here's what to do first:</p>
  <ol>
    <li>Search for businesses in a niche you know well</li>
    <li>Find a high-intent lead</li>
    <li>Generate their prospect card</li>
    <li>Send it with twelve words</li>
  </ol>
  <p>The goal is one closed deal before ${expiryDate}. When you close, click the button in your dashboard and we'll move you to Growth — no questions asked.</p>
  <p>Reply to this email if you need anything. I read every one.</p>
  <p style="margin-top:32px;">— Luke</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
  <p style="font-size:12px;color:#999;">Venn · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#999;">venn.so</a></p>
</body>
</html>`;
}

export function solopreneurDeclinedHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${name} —</p>
  <p>Thank you for applying for the Solopreneur Programme.</p>
  <p>After reviewing your application, I've decided not to move forward with the trial at this time. This isn't a reflection of your potential — the programme has limited spots and I'm being selective about the fit.</p>
  <p>If you'd like to join Venn on a paid plan, our Starter plan is a great starting point at £149/month.</p>
  <p>If you have any questions, just reply to this email.</p>
  <p style="margin-top:32px;">— Luke</p>
</body>
</html>`;
}

export function checkinEmailHtml({
  name,
  hotLeadName,
  hotLeadOpeningLine,
  searchCount,
  cardCount,
  sequenceCount,
  solopreneurDaysLeft,
}: {
  name: string;
  hotLeadName?: string;
  hotLeadOpeningLine?: string;
  searchCount: number;
  cardCount: number;
  sequenceCount: number;
  solopreneurDaysLeft?: number;
}): string {
  const firstName = name.split(" ")[0];
  const urgency = solopreneurDaysLeft !== undefined && solopreneurDaysLeft <= 14
    ? `<p><strong>${solopreneurDaysLeft} days left on your trial.</strong> Your pipeline is warmer than you think.</p>`
    : "";

  const hotLeadSection = hotLeadName
    ? `<p><strong>${hotLeadName}</strong> opened your card recently. Here's the opening line for a follow-up:</p>
       <blockquote style="border-left:3px solid #C4973F;margin:16px 0;padding:0 16px;color:#555;">${hotLeadOpeningLine ?? ""}</blockquote>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  ${urgency}
  ${hotLeadSection}
  <p>Here's where things stand:</p>
  <ul style="padding-left:20px;">
    <li>Searches run: ${searchCount}</li>
    <li>Cards generated: ${cardCount}</li>
    <li>Sequences active: ${sequenceCount}</li>
  </ul>
  <p>Keep the momentum going. Even one search a day compounds quickly.</p>
  <p>Reply if you need anything. I read every one.</p>
  <p style="margin-top:32px;">— Luke</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
  <p style="font-size:12px;color:#999;">Venn · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#999;">venn.so</a> · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#999;">Unsubscribe</a></p>
</body>
</html>`;
}

export function weeklyDigestHtml({
  name,
  hotLeadName,
  hotLeadViewCount,
  hotLeadOpeningLine,
  highestPriorityLead,
  weekSearches,
  weekCards,
  weekOpens,
  weekReplies,
  prevWeekCards,
  weekNumber,
}: {
  name: string;
  hotLeadName?: string;
  hotLeadViewCount?: number;
  hotLeadOpeningLine?: string;
  highestPriorityLead?: { businessName: string; location: string; openingLine: string | null };
  weekSearches: number;
  weekCards: number;
  weekOpens: number;
  weekReplies: number;
  prevWeekCards: number;
  weekNumber: number;
}): string {
  const firstName = name.split(" ")[0];
  const openRate = weekCards > 0 ? Math.round((weekOpens / weekCards) * 100) : 0;

  const subjects = [
    `Your week ahead, ${firstName}`,
    `${weekCards} leads worth your attention this week`,
    hotLeadName ? `${hotLeadName} is still warm — here's what to do` : `Your week ahead, ${firstName}`,
    `How your pipeline looks this week`,
  ];
  // Subject is handled outside this function; just build the body

  const hotSection = hotLeadName
    ? `<p><strong>${hotLeadName}</strong> opened your card ${hotLeadViewCount ?? 1} time${hotLeadViewCount !== 1 ? "s" : ""} this week. They haven't replied but they're thinking about it. A short follow-up today could be the nudge.</p>`
    : "";

  const prioritySection = highestPriorityLead
    ? `<p>Your highest priority uncontacted lead is <strong>${highestPriorityLead.businessName}</strong> in ${highestPriorityLead.location}. Here's your opening line ready to use:</p>
       <blockquote style="border-left:3px solid #C4973F;margin:16px 0;padding:0 16px;color:#555;font-style:italic;">"${highestPriorityLead.openingLine ?? ""}"</blockquote>`
    : "";

  const trendLine = weekCards > prevWeekCards
    ? `You sent ${weekCards - prevWeekCards} more cards than last week. That's the right direction.`
    : weekCards < prevWeekCards
    ? `Quieter week — that's fine. Your pipeline is still warm.`
    : `Consistent week. Consistency is what builds pipelines.`;

  const openRateLine = openRate > 50
    ? `That open rate is strong. The work is landing.`
    : openRate < 30
    ? `Open rates take time to build. Keep sending.`
    : `Solid open rate. Keep the momentum.`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#fff;font-family:Georgia,serif;color:#1a1a1a;max-width:520px;margin:40px auto;padding:0 24px;line-height:1.7;">
  <p>${firstName} —</p>
  ${hotSection}
  ${prioritySection}
  <p><strong>HOW YOU'RE DOING</strong><br />
  Searches: ${weekSearches}<br />
  Cards sent: ${weekCards}<br />
  Cards opened: ${weekOpens} (${openRate}%) — ${openRateLine}<br />
  Replies: ${weekReplies}</p>
  <p>${trendLine}</p>
  <p>Reply if you need anything.</p>
  <p style="margin-top:32px;">Luke at Venn</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
  <p style="font-size:12px;color:#999;">Venn · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#999;">venn.so</a></p>
</body>
</html>`;
}

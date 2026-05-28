import { getResend } from "@/lib/email/resend";

const FROM = "Luke at Venn <luke@getvenn.agency>";
const REPLY_TO = "luke@getvenn.agency";

const BODY_STYLE = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 560px;
    margin: 60px auto;
    padding: 0 24px;
  }
  p { margin: 0 0 20px 0; }
`;

const PLAN_MESSAGE: Record<string, string> = {
  starter: "Your intelligence pipeline is live. Your first lead is one search away.",
  growth: "Your prospect cards are ready. Your intelligence pipeline is live. Your first lead is one search away.",
  pro: "Everything is ready. Intelligence. Cards. Proposals. Close. Agency OS. Your first lead is one search away.",
  solopreneur: "Welcome to the cohort. Run your first search today. Your 60 days starts now.",
};

export async function sendWelcomeEmail({
  email,
  firstName,
  plan,
}: {
  email: string;
  firstName: string;
  plan: string;
}) {
  const planMessage = PLAN_MESSAGE[plan] ?? PLAN_MESSAGE.starter;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BODY_STYLE}</style>
</head>
<body>
<div class="container">
  <p>${firstName} —</p>

  <p>You just joined something I've been building because I needed it and couldn't find it anywhere.</p>

  <p>Venn works because it has to. I use it every day to sell my own software. Every feature exists because I felt the problem firsthand.</p>

  <p>${planMessage}</p>

  <p>Here's what I want you to do in the next twenty minutes:</p>

  <p>Run your first search. Pick a niche you know. Pick a city. Watch what Venn does.</p>

  <p>When you get your first prospect card back — send it to someone. Twelve words. Their URL. That's it.</p>

  <p>Then tell me what happened. Reply to this email. I read every one.</p>

  <p>Welcome to the right side of outreach.</p>

  <p style="margin-top: 40px;">Luke<br>Founder, Venn</p>
</div>
</body>
</html>`;

  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: REPLY_TO,
    subject: "You're in — and I mean it",
    html,
  });
}

export async function sendThirtyMinuteFollowUp({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BODY_STYLE}</style>
</head>
<body>
<div class="container">
  <p>${firstName} —</p>

  <p>Before you dive in — one thing worth knowing.</p>

  <p>The first search you run sets the tone for everything. Pick a niche you actually understand. A niche where you know what good looks like and what broken looks like.</p>

  <p>Venn will find businesses, read their reviews, audit their websites and score their intent. But the opening line it generates will be better if the niche is one you genuinely care about.</p>

  <p>So — what niche are you starting with?</p>

  <p>Reply and tell me. I'll tell you if there's anything specific to watch for.</p>

  <p>Luke</p>
</div>
</body>
</html>`;

  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: REPLY_TO,
    subject: "One thing before you start",
    html,
  });
}

export async function sendDayThreeCheckIn({
  email,
  firstName,
  searchCount,
  cardCount,
}: {
  email: string;
  firstName: string;
  searchCount: number;
  cardCount: number;
}) {
  let body: string;

  if (searchCount === 0) {
    body = `
  <p>You signed up three days ago and haven't run your first search yet.</p>

  <p>That's okay. Sometimes the first step is the hardest one.</p>

  <p>Here's all you need to do right now: go to the search page. Type a niche. Type a city. Hit search.</p>

  <p>Venn does everything else. You just need to start.</p>`;
  } else if (cardCount === 0) {
    body = `
  <p>You ran your first search. That's the hardest step.</p>

  <p>The next one is sending your first prospect card.</p>

  <p>I know it feels like a risk — putting something out there and waiting. But the card does the work. You just have to send it.</p>

  <p>Pick your highest intent lead. Hit generate card. Send it with twelve words and their URL.</p>

  <p>Then tell me what happens.</p>`;
  } else {
    body = `
  <p>You've run searches and sent cards. That's real progress.</p>

  <p>How are you finding it so far?</p>

  <p>Reply and tell me what's working and what isn't. I use that feedback to make Venn better every week.</p>`;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BODY_STYLE}</style>
</head>
<body>
<div class="container">
  <p>${firstName} —</p>
  ${body}
  <p>Luke</p>
</div>
</body>
</html>`;

  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: REPLY_TO,
    subject: "How's your first week going?",
    html,
  });
}

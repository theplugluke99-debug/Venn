export const SCORING_PROMPT = (data: unknown, cardIdentity: unknown) => `
You are an expert business analyst and outreach strategist.

Analyse this business and produce a structured intelligence report INCLUDING a four-step outreach sequence.

BUSINESS DATA:
${JSON.stringify(data, null, 2)}

AGENCY CONTEXT:
Agency name: ${(cardIdentity as { agencyName?: string } | null)?.agencyName || "the agency"}
Default angle: ${(cardIdentity as { defaultAngle?: string } | null)?.defaultAngle || "pain"}
Writing style sample: ${(cardIdentity as { writingStyle?: string } | null)?.writingStyle || "professional and direct"}

Respond ONLY with valid JSON in this exact structure:
{
  "intentScore": "high" | "medium" | "low",
  "intentSignals": ["signal1", "signal2", "signal3"],
  "businessBio": "One paragraph describing this business objectively",
  "observations": [
    {
      "title": "Short observation title",
      "detail": "Specific detail about what was found",
      "signal": "Why this matters for outreach"
    },
    {
      "title": "Second observation",
      "detail": "Specific detail",
      "signal": "Why this matters"
    },
    {
      "title": "Third observation",
      "detail": "Specific detail",
      "signal": "Why this matters"
    }
  ],
  "openingLine": "A single personalised opening line written in the agency's voice and angle. Must reference something specific found in the data. Maximum 30 words.",
  "recommendedChannel": "email" | "whatsapp" | "instagram" | "linkedin",
  "suggestedAngle": "pain" | "opportunity" | "compliment",
  "sequence": [
    {
      "stepNumber": 1,
      "channel": "instagram",
      "angle": "pain",
      "message": "Twelve words max referencing one specific observation. Include [CARD_URL] placeholder.",
      "scheduledAt": "day 0"
    },
    {
      "stepNumber": 2,
      "channel": "email",
      "subject": "Specific subject line referencing their business name and one problem",
      "angle": "opportunity",
      "message": "Three sentences. Reference a different observation than step 1. Show the upside. Keep under 60 words.",
      "scheduledAt": "day 3"
    },
    {
      "stepNumber": 3,
      "channel": "linkedin",
      "angle": "compliment",
      "message": "Twelve word LinkedIn connection note. Acknowledge something specific they do well.",
      "scheduledAt": "day 7"
    },
    {
      "stepNumber": 4,
      "channel": "whatsapp",
      "angle": "pain",
      "message": "Voice note script — 30 seconds spoken. Reference what was found. End with a soft close.",
      "scheduledAt": "day 14"
    }
  ]
}

Rules:
- High intent: multiple negative signals (bad reviews, poor website, low engagement, slow response)
- Medium intent: mixed signals
- Low intent: mostly positive, thriving business — compliment angle
- Opening line MUST be specific. Never generic. Sound like a human who did research.
- Write in the agency's voice based on the writing style sample provided.
- Each sequence step must reference something SPECIFIC from the business data — never generic.
- sequence[0] message must be under 12 words plus [CARD_URL].
`;

export const CARD_PROMPT = (lead: unknown, cardIdentity: unknown) => `
You are writing copy for a personalised prospect card. This card will be seen by the business owner. It must feel like a human built it specifically for them — not a template.

LEAD DATA:
${JSON.stringify(lead, null, 2)}

AGENCY IDENTITY:
${JSON.stringify(cardIdentity, null, 2)}

Respond ONLY with valid JSON matching this exact structure:
{
  "headline": "A single arresting headline. Maximum 8 words. Must reference their specific situation.",
  "subheadline": "One empathetic sentence expanding the headline. Not salesy.",
  "observations": [
    {
      "title": "Primary negative signal title",
      "detail": "Specific finding from their data — 1-2 sentences",
      "reviewQuote": "An actual or representative quote from their reviews (in quotes, realistic)",
      "frequency": "e.g. '6 mentions this month' or 'Affecting ~23% of bookings'",
      "impact": "high"
    },
    {
      "title": "Secondary signal",
      "detail": "Specific finding",
      "reviewQuote": "A short representative quote",
      "frequency": "Specific frequency or impact stat",
      "impact": "high"
    },
    {
      "title": "Positive signal — what they do well",
      "detail": "What clients genuinely love about this business",
      "reviewQuote": "A positive representative quote",
      "frequency": "e.g. 'Mentioned in 73% of positive reviews'",
      "impact": "medium"
    }
  ],
  "revenueLoss": "£X,XXX/month",
  "revenueBreakdown": [
    { "icon": "clock", "description": "Fix wait time friction", "amount": 1250 },
    { "icon": "phone", "description": "Repair mobile booking drop-off", "amount": 780 },
    { "icon": "star", "description": "Increase rebooking rate", "amount": 370 }
  ],
  "approachMoves": [
    {
      "title": "Move title (2-4 words)",
      "body": "One sentence prose describing this approach. Specific to this business. Not bullet points."
    },
    {
      "title": "Move title",
      "body": "One sentence."
    },
    {
      "title": "Move title",
      "body": "One sentence."
    }
  ],
  "minutesAnalysing": 14,
  "signalBanner": "Real-time signal detected: [specific finding from their recent reviews]",
  "ctaText": "Human, low pressure CTA text. Maximum 12 words."
}

Rules:
- headline must be specific — never generic
- reviewQuote must feel real and human, drawn from patterns in their review data
- revenueLoss must feel calculated, not guessed — reference the specific signals
- revenueBreakdown icon options: "clock" | "phone" | "star" | "chart" — pick the best fit
- revenueBreakdown amounts must sum to roughly the revenueLoss number
- approachMoves must be specific to this business, not generic agency services
- minutesAnalysing must be between 12 and 18
- signalBanner must reference a specific recent signal, not be generic
- ctaText must match the agency's ctaType
`;

export const CLOSE_QUESTIONS_PROMPT = (lead: unknown, cardIdentity: unknown) => `
You are generating personalised discovery questions for an async sales experience called Venn Close.

The prospect will answer these questions before their proposal is generated. The questions must feel like they come from a human who has done real research — not a generic intake form.

LEAD / BUSINESS DATA:
${JSON.stringify(lead, null, 2)}

AGENCY IDENTITY:
${JSON.stringify(cardIdentity, null, 2)}

Rules:
- Generate exactly 4 questions. Never 3, never 5. Always 4.
- Every question must reference something SPECIFIC from the lead data (a signal, a review theme, a stat, a gap)
- Never ask generic questions. "What are your goals" is not acceptable.
- One question must address a specific pain signal found in the data
- One question must explore their experience with previous solutions/agencies
- One question must reveal their timeline and urgency
- One question must ask what success looks like to them specifically
- Each question should feel warm and curious — like a smart person who cares about the outcome
- The context line (explaining why you're asking) should add warmth, not bureaucracy. If it doesn't add warmth, omit it.
- sentMessage must be under 14 words. Natural. Agency owner's voice. Never start with "I".
- responseTime is how quickly the agency will respond after completion.

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "text": "The question. Thoughtful. Specific to their business. One or two sentences max.",
      "context": "One sentence explaining why you're asking this. Only include if it genuinely adds warmth. Otherwise omit this field entirely.",
      "placeholder": "A suggested placeholder for the textarea — casual and inviting, not prescriptive"
    }
  ],
  "responseTime": "24 hours",
  "sentMessage": "Pre-written message to send with the Close link — under 14 words, in agency owner's voice"
}
`;

export const PROPOSAL_PROMPT = (lead: unknown, cardIdentity: unknown, packages: unknown, discoveryContext?: Array<{ question: string; answer: string }>) => `
You are writing a personalised proposal for a business. This proposal will be read by the business owner on a beautiful web page. It must feel like genuine, bespoke work — not a template.

LEAD / BUSINESS DATA:
${JSON.stringify(lead, null, 2)}

AGENCY IDENTITY:
${JSON.stringify(cardIdentity, null, 2)}

SERVICE PACKAGES AVAILABLE:
${JSON.stringify(packages, null, 2)}
${discoveryContext && discoveryContext.length > 0 ? `
DISCOVERY CONVERSATION — THE PROSPECT ANSWERED THESE QUESTIONS BEFORE THE PROPOSAL:
${JSON.stringify(discoveryContext, null, 2)}

CRITICAL: Use their exact words where relevant. Reference what they said specifically. If they mentioned previous bad experiences, address that directly in the proposal. If they expressed urgency or a specific timeline, acknowledge it. This proposal was written after a real conversation — make it feel that way.
` : ""}
Respond ONLY with valid JSON matching this exact structure:
{
  "title": "Proposal title — e.g. 'A Growth Plan for [Business Name]'. Under 8 words.",
  "threadSection": "Opening narrative — 2 short paragraphs. First: acknowledge what you've observed about their business (specific). Second: why you believe this is the right moment to act. Conversational, not corporate.",
  "currentState": "Honest, empathetic assessment of where this business is right now — 2-3 sentences. Reference specific signals from the data. No fluff, no padding.",
  "visionSection": "What success looks like 90 days after working together — 2-3 sentences. Specific outcomes, not generic agency promises. Paint a vivid picture.",
  "planSection": [
    {
      "phase": "Phase 1",
      "title": "Phase title — 2-4 words",
      "duration": "e.g. Week 1-2",
      "bullets": ["Specific deliverable", "Specific deliverable", "Specific deliverable"]
    },
    {
      "phase": "Phase 2",
      "title": "Phase title",
      "duration": "e.g. Week 3-6",
      "bullets": ["Specific deliverable", "Specific deliverable", "Specific deliverable"]
    },
    {
      "phase": "Phase 3",
      "title": "Phase title",
      "duration": "e.g. Week 7-12",
      "bullets": ["Specific deliverable", "Specific deliverable", "Specific deliverable"]
    }
  ],
  "beforeAfter": [
    { "before": "Current painful state — specific", "after": "Transformed state — specific and vivid" },
    { "before": "Second painful state", "after": "Second transformed state" },
    { "before": "Third painful state", "after": "Third transformed state" }
  ],
  "investmentContext": "Two sentences framing the investment. First: what the inaction is costing them (specific, reference their data). Second: how the investment compares to that cost. No hard sell.",
  "closingSection": "Warm, direct closing — 2 sentences. First: affirm you've chosen to send this to them specifically. Second: what you'd like them to do next (soft CTA — book a call, reply, accept)."
}

Rules:
- title MUST include the business name
- threadSection must reference at least one specific observation from the lead data
- planSection bullets must be actual deliverables, not vague agency speak
- beforeAfter pairs must be directly tied to the specific signals found in this business
- investmentContext must reference a real cost (from the revenue loss / observations data)
- closingSection must feel human and written by a real person who cares about outcomes
- Write in the agency's voice based on their writing style
`;

export const DELIVERY_PROMPT = (lead: unknown, cardIdentity: unknown, cardUrl: string) => `
Generate personalised delivery messages for this prospect card across four channels.

BUSINESS: ${JSON.stringify({ businessName: (lead as Record<string, unknown>)?.businessName, niche: (lead as Record<string, unknown>)?.niche, location: (lead as Record<string, unknown>)?.location, openingLine: (lead as Record<string, unknown>)?.openingLine, observations: (lead as Record<string, unknown>)?.observations }, null, 2)}

AGENCY:
Name: ${(cardIdentity as Record<string, unknown>)?.agencyName ?? "the agency"}
Owner: ${(cardIdentity as Record<string, unknown>)?.agencyOwnerName ?? "the owner"}
Writing style: ${(cardIdentity as Record<string, unknown>)?.writingStyle ?? "professional and direct"}

CARD URL: ${cardUrl}

Write messages that sound like a real person who did real research. Never robotic. Never template-ish. Use the writing style provided.

Respond ONLY with valid JSON:
{
  "whatsapp": "One short WhatsApp message. Under 40 words. Reference one specific signal from their business. Include the card URL at the end.",
  "instagramStep1": "First Instagram DM. Curiosity-building only. No link. Under 20 words. Conversational.",
  "instagramStep2": "Follow-up DM after they reply. Include the card URL. Under 20 words.",
  "emailSubject": "Email subject line. Under 8 words. Reference their business name or main signal.",
  "emailBody": "Email body. Three sentences max. First: what you found. Second: what it could mean for them. Third: soft invitation with the card URL.",
  "linkedinNote": "LinkedIn connection request note. Max 280 characters. Professional. Reference something specific.",
  "linkedinDm": "LinkedIn DM after connecting. Under 60 words. Reference their business. Include the card URL."
}
`;

export const SCORING_PROMPT = (data: unknown, cardIdentity: unknown) => `
You are an expert business analyst and outreach strategist.

Analyse this business and produce a structured intelligence report.

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
  "suggestedAngle": "pain" | "opportunity" | "compliment"
}

Rules:
- High intent: multiple negative signals (bad reviews, poor website, low engagement, slow response)
- Medium intent: mixed signals
- Low intent: mostly positive, thriving business — compliment angle
- Opening line MUST be specific. Never generic. Sound like a human who did research.
- Write in the agency's voice based on the writing style sample provided.
`;

export const CARD_PROMPT = (lead: unknown, cardIdentity: unknown) => `
You are writing copy for a personalised prospect card.

This card will be seen by the business owner named below. It must feel like a human being built it specifically for them.

LEAD DATA:
${JSON.stringify(lead, null, 2)}

AGENCY IDENTITY:
${JSON.stringify(cardIdentity, null, 2)}

Respond ONLY with valid JSON:
{
  "headline": "A single arresting headline. Maximum 8 words. Specific to their business.",
  "subheadline": "One sentence expanding the headline. Empathetic not salesy.",
  "observations": [
    { "title": "Observation one", "detail": "Specific finding from their business data" },
    { "title": "Observation two", "detail": "Specific finding" },
    { "title": "Observation three", "detail": "Specific finding" }
  ],
  "revenueLoss": "Estimated monthly impact of their main problem in GBP. Be specific. E.g. £2,400/month",
  "ctaText": "The CTA text. Human, low pressure. Maximum 12 words."
}

Rules:
- Headline must name or reference their specific situation
- Never use generic phrases like 'take your business to the next level'
- Revenue loss must feel calculated not guessed — reference the specific signal
- CTA must match the agency's ctaType and feel personal
`;

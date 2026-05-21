const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "REDIS_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "ANTHROPIC_API_KEY",
  "GOOGLE_PLACES_API_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_STARTER_PRICE_ID",
  "STRIPE_GROWTH_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
  "NEXT_PUBLIC_APP_URL",
] as const;

// Validate at startup — only runs in Node.js runtime, not during build compilation
if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Set these in your .env.local (development) or Vercel dashboard (production).`
    );
  }
}

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL!,
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    prices: {
      starter: process.env.STRIPE_STARTER_PRICE_ID!,
      growth: process.env.STRIPE_GROWTH_PRICE_ID!,
      pro: process.env.STRIPE_PRO_PRICE_ID!,
    },
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },
  // Optional
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? null,
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? null,
  },
  hunter: {
    apiKey: process.env.HUNTER_API_KEY ?? null,
  },
} as const;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: string;
  priceId: string | null;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£79",
    priceId: null, // set from props
    description: "Find and qualify leads automatically.",
    features: [
      "100 leads per month",
      "Google intelligence & intent scoring",
      "Opening line generation",
      "CRM pipeline",
    ],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: "£149",
    priceId: null,
    description: "Everything in Starter plus digital prospect cards.",
    features: [
      "250 leads per month",
      "Everything in Starter",
      "Digital Prospect Cards",
      "Multi-channel sequence generation",
      "Outreach sorted by channel",
    ],
    popular: true,
    cta: "Start with Growth",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£249",
    priceId: null,
    description: "The complete Prospect Engine. All modules.",
    features: [
      "500 leads per month",
      "Everything in Growth",
      "Proposal builder",
      "Client dashboard",
      "Automated reporting",
    ],
    cta: "Go Pro",
  },
];

export function SubscribePage({
  isAuthed,
  starterPriceId,
  growthPriceId,
  proPriceId,
}: {
  isAuthed: boolean;
  starterPriceId: string | null;
  growthPriceId: string | null;
  proPriceId: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = PLANS.map((p) => ({
    ...p,
    priceId:
      p.id === "starter" ? starterPriceId :
      p.id === "growth" ? growthPriceId :
      p.id === "pro" ? proPriceId : null,
  }));

  async function handleSelect(plan: Plan) {
    if (!isAuthed) {
      router.push(`/sign-up?redirect=/subscribe`);
      return;
    }
    if (!plan.priceId) {
      // no price ID configured — contact sales or self-serve starter
      router.push("/settings");
      return;
    }
    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0907",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            color: "#C4973F",
            letterSpacing: "0.04em",
            display: "block",
            marginBottom: 12,
          }}
        >
          Venn
        </span>
        <h1
          style={{
            fontSize: 36,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Choose your plan
        </h1>
        <p style={{ fontSize: 14, color: "#555250", lineHeight: 1.6 }}>
          Cancel any time. No long-term contracts.
        </p>
      </div>

      {/* Pricing cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          maxWidth: 900,
          width: "100%",
        }}
        className="pricing-grid"
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.popular ? "#0F0E0B" : "#0D0C09",
              border: plan.popular ? "0.5px solid #C4973F40" : "0.5px solid #1E1C18",
              borderRadius: 10,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#C4973F",
                  color: "#0A0907",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "3px 14px",
                  borderRadius: "0 0 8px 8px",
                  fontFamily: "var(--font-inter)",
                }}
              >
                MOST POPULAR
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "#555250",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                {plan.name}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 36,
                    color: "#FFFDF8",
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 12, color: "#444" }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "#555250", lineHeight: 1.5 }}>
                {plan.description}
              </p>
            </div>

            <ul style={{ flex: 1, marginBottom: 28, listStyle: "none", padding: 0 }}>
              {plan.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 13,
                    color: "#888",
                    fontFamily: "var(--font-inter)",
                    lineHeight: 1.5,
                    paddingBottom: 8,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#C4973F", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan)}
              disabled={loading === plan.id}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                background: plan.popular ? "#C4973F" : "#1A1814",
                color: plan.popular ? "#0A0907" : "#FFFDF8",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-inter)",
                cursor: loading === plan.id ? "not-allowed" : "pointer",
                opacity: loading === plan.id ? 0.7 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {loading === plan.id ? "Redirecting…" : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ fontSize: 12, color: "#333230", marginTop: 32, textAlign: "center" }}>
        All plans include a 7-day free trial. Payments processed securely by Stripe.
      </p>

      <style>{`
        @media (max-width: 700px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

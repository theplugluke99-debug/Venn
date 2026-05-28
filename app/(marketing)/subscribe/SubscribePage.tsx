"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlanDef {
  id: string;
  name: string;
  price: string;
  sub: string;
  priceId: string | null;
  description: string;
  features: string[];
  popular?: boolean;
  special?: boolean;
  cta: string;
}

const PLANS: PlanDef[] = [
  {
    id: "solopreneur",
    name: "Solopreneur",
    price: "£0",
    sub: "30-day trial",
    priceId: null,
    description: "Prove the tool works. Close a deal. Upgrade on results.",
    features: [
      "100 leads included",
      "20 prospect cards",
      "Outreach sequences",
      "30-day trial period",
      "Close a deal → upgrade on us",
    ],
    special: true,
    cta: "Apply now →",
  },
  {
    id: "starter",
    name: "Starter",
    price: "£149",
    sub: "/month",
    priceId: null,
    description: "Find and qualify leads automatically.",
    features: [
      "150 leads per month",
      "Google intelligence & intent scoring",
      "Opening line generation",
      "10 prospect cards",
      "CRM pipeline",
    ],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: "£299",
    sub: "/month",
    priceId: null,
    description: "Everything in Starter plus sequences and unlimited cards.",
    features: [
      "400 leads per month",
      "Everything in Starter",
      "Unlimited prospect cards",
      "Multi-channel sequences",
      "Outreach sorted by channel",
    ],
    popular: true,
    cta: "Start with Growth",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£499",
    sub: "/month",
    priceId: null,
    description: "The complete Prospect Engine. All modules.",
    features: [
      "999 leads per month",
      "Everything in Growth",
      "Proposal builder",
      "Automated reporting",
      "White-label cards",
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

  async function handleSelect(plan: PlanDef) {
    if (plan.id === "solopreneur") {
      router.push("/solopreneur");
      return;
    }
    if (!isAuthed) {
      router.push(`/sign-up?redirect=/subscribe`);
      return;
    }
    if (!plan.priceId) {
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
            fontSize: "clamp(24px, 5vw, 36px)",
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
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          maxWidth: 1080,
          width: "100%",
        }}
        className="pricing-grid"
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.special
                ? "linear-gradient(145deg, #0F0D0A 0%, #131109 100%)"
                : plan.popular
                ? "#0F0E0B"
                : "#0D0C09",
              border: plan.special
                ? "0.5px solid #C4973F60"
                : plan.popular
                ? "0.5px solid #C4973F40"
                : "0.5px solid #1E1C18",
              borderRadius: 10,
              padding: 24,
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
                  whiteSpace: "nowrap",
                }}
              >
                MOST POPULAR
              </div>
            )}

            {plan.special && (
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#C4973F20",
                  color: "#C4973F",
                  border: "0.5px solid #C4973F40",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "3px 14px",
                  borderRadius: "0 0 8px 8px",
                  fontFamily: "var(--font-inter)",
                  whiteSpace: "nowrap",
                }}
              >
                APPLY
              </div>
            )}

            <div style={{ marginBottom: 20, marginTop: plan.popular || plan.special ? 8 : 0 }}>
              <p
                style={{
                  fontSize: 11,
                  color: plan.special ? "#C4973F" : "#555250",
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
                    fontSize: 32,
                    color: "#FFFDF8",
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 12, color: "#444" }}>{plan.sub}</span>
              </div>
              <p style={{ fontSize: 12, color: "#555250", lineHeight: 1.5 }}>
                {plan.description}
              </p>
            </div>

            <ul style={{ flex: 1, marginBottom: 24, listStyle: "none", padding: 0 }}>
              {plan.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 12,
                    color: "#888",
                    fontFamily: "var(--font-inter)",
                    lineHeight: 1.5,
                    paddingBottom: 7,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#C4973F", fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan)}
              disabled={loading === plan.id}
              style={{
                width: "100%",
                padding: "11px 16px",
                borderRadius: 8,
                border: plan.special ? "0.5px solid #C4973F60" : "none",
                background: plan.popular
                  ? "#C4973F"
                  : plan.special
                  ? "#C4973F15"
                  : "#1A1814",
                color: plan.popular ? "#0A0907" : plan.special ? "#C4973F" : "#FFFDF8",
                fontSize: 13,
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
        Paid plans include a 7-day free trial. Payments processed securely by Stripe.
      </p>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

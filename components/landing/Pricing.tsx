"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Solopreneur",
    price: "£0",
    period: "until you close",
    description: "Apply for approved access. Pay nothing until your first client.",
    features: [
      "100 leads/month",
      "20 prospect cards",
      "Outreach sequences",
      "60-day trial",
      "Pay £149 on first close",
    ],
    cta: "Apply for access",
    href: "/solopreneur",
    highlight: false,
    badge: "Trial",
  },
  {
    name: "Starter",
    price: "£149",
    period: "/month",
    description: "For agency owners doing 1–3 proposals a week.",
    features: [
      "150 leads/month",
      "10 prospect cards",
      "No sequences",
      "Email support",
      "Cancel anytime",
    ],
    cta: "Get started",
    href: "/subscribe?plan=starter",
    highlight: false,
    badge: null,
  },
  {
    name: "Growth",
    price: "£299",
    period: "/month",
    description: "When outreach becomes a real part of your business.",
    features: [
      "400 leads/month",
      "Unlimited cards",
      "Outreach sequences",
      "Priority support",
      "Cancel anytime",
    ],
    cta: "Get started",
    href: "/subscribe?plan=growth",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Pro",
    price: "£499",
    period: "/month",
    description: "Full intelligence stack. White-label ready.",
    features: [
      "Unlimited leads",
      "Unlimited cards",
      "Sequences + proposals",
      "White-label cards",
      "Reporting + analytics",
    ],
    cta: "Get started",
    href: "/subscribe?plan=pro",
    highlight: false,
    badge: null,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: "#0F0E0B",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Pricing
        </p>
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          Simple pricing.
          <br />
          No surprises.
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#888580",
            textAlign: "center",
            marginBottom: 60,
            lineHeight: 1.6,
          }}
        >
          14-day money back on all paid plans. No questions asked.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? "#0A0907" : "transparent",
                border: plan.highlight ? "0.5px solid #C4973F" : "0.5px solid #1E1C18",
                borderRadius: 8,
                padding: "32px 28px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {plan.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.highlight ? "#C4973F" : "#1E1C18",
                    color: plan.highlight ? "#0A0907" : "#888580",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "3px 10px",
                    borderRadius: "0 0 6px 6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.badge}
                </span>
              )}

              <p style={{ fontSize: 12, color: "#888580", marginBottom: 8, letterSpacing: "0.05em" }}>
                {plan.name}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    fontSize: 36,
                    color: "#FFFDF8",
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 12, color: "#444440" }}>{plan.period}</span>
              </div>

              <p style={{ fontSize: 13, color: "#888580", lineHeight: 1.5, marginBottom: 28, marginTop: 8 }}>
                {plan.description}
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#FFFDF8" }}>
                    <span style={{ color: "#C4973F", flexShrink: 0 }}>–</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "11px 20px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  background: plan.highlight ? "#C4973F" : "transparent",
                  color: plan.highlight ? "#0A0907" : "#C4973F",
                  border: plan.highlight ? "none" : "0.5px solid #C4973F",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#444440",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Enterprise pricing available for agencies with 5+ seats.{" "}
          <a href="mailto:luke@venn.so" style={{ color: "#888580", textDecoration: "underline" }}>
            Get in touch.
          </a>
        </p>
      </div>
    </section>
  );
}

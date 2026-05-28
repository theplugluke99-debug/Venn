"use client";

import Link from "next/link";
import { Reveal, Section, SectionHeader, colours } from "./system";

const PLANS = [
  {
    name: "Solopreneur",
    price: "£0",
    period: "until you win",
    description: "For the builder doing everything alone. Pay nothing until Venn helps you close.",
    features: ["100 leads/month", "20 prospect cards", "Outreach sequences", "60-day runway", "Pay £149 on first close"],
    cta: "Apply for access",
    href: "/solopreneur",
    highlight: true,
    badge: "Pay when it works",
  },
  {
    name: "Starter",
    price: "£149",
    period: "/month",
    description: "For agency owners doing focused weekly outreach.",
    features: ["150 leads/month", "10 prospect cards", "Email support", "Cancel anytime"],
    cta: "Get started",
    href: "/subscribe?plan=starter",
  },
  {
    name: "Growth",
    price: "£299",
    period: "/month",
    description: "When prospecting becomes a consistent operating rhythm.",
    features: ["400 leads/month", "Unlimited cards", "Outreach sequences", "Priority support"],
    cta: "Get started",
    href: "/subscribe?plan=growth",
  },
  {
    name: "Pro",
    price: "£499",
    period: "/month",
    description: "For teams that want the full intelligence stack.",
    features: ["Unlimited leads", "Unlimited cards", "Sequences + proposals", "White-label cards"],
    cta: "Get started",
    href: "/subscribe?plan=pro",
  },
];

export function Pricing() {
  return (
    <Section id="pricing" tone="secondary">
      <div className="venn-container">
        <SectionHeader
          eyebrow="Pricing"
          title={
            <>
              Priced like we believe
              <br />
              it actually works.
            </>
          }
          subline={
            <>
              Because we do. Which is why solopreneurs
              <br />
              pay nothing until they win.
            </>
          }
        />

        <Reveal>
          <div className="pricing-grid" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className="pricing-card"
                style={{
                  background: plan.highlight ? "rgba(196,151,63,0.07)" : colours.bg,
                  border: `0.5px solid ${plan.highlight ? colours.goldBorder : colours.border}`,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 430,
                  padding: "30px 24px 24px",
                  position: "relative",
                  transition: "background 260ms var(--venn-ease), border-color 260ms var(--venn-ease), transform 260ms var(--venn-ease)",
                }}
              >
                {plan.badge && (
                  <span style={{ color: colours.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>
                    {plan.badge}
                  </span>
                )}
                <p style={{ color: colours.ivory, fontSize: 14, marginBottom: 18 }}>{plan.name}</p>
                <div style={{ alignItems: "baseline", display: "flex", gap: 6, marginBottom: 14 }}>
                  <span style={{ color: colours.ivory, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 44, lineHeight: 0.9 }}>{plan.price}</span>
                  <span style={{ color: colours.muted, fontSize: 12 }}>{plan.period}</span>
                </div>
                <p style={{ color: colours.secondary, fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>{plan.description}</p>
                <ul style={{ display: "grid", flex: 1, gap: 10, listStyle: "none", margin: "0 0 26px", padding: 0 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ color: colours.secondary, display: "flex", gap: 9, fontSize: 13, lineHeight: 1.45 }}>
                      <span style={{ color: colours.gold }}>—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link className={`venn-cta ${plan.highlight ? "venn-cta-primary" : ""}`} href={plan.href} style={{ border: plan.highlight ? "none" : `0.5px solid ${colours.goldBorder}`, color: plan.highlight ? colours.bg : colours.gold, width: "100%" }}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        .pricing-card:hover {
          background: rgba(255,253,248,0.035) !important;
          border-color: ${colours.goldBorder} !important;
          transform: translateY(-2px);
        }
        .pricing-card:first-child:hover { background: rgba(255,253,248,0.95) !important; }
        .pricing-card:first-child:hover p,
        .pricing-card:first-child:hover li,
        .pricing-card:first-child:hover span { color: ${colours.bg} !important; }
        @media (max-width: 980px) {
          .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 620px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-card { min-height: auto !important; }
        }
      `}</style>
    </Section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Section, SectionHeader, colours } from "./system";

const PLANS = [
  {
    name: "Solopreneur",
    price: "£0",
    period: "until you win",
    description: "For the builder doing everything alone. Pay nothing until Venn helps you close.",
    features: [
      "100 leads/month",
      "20 prospect cards",
      "Outreach sequences",
      "60-day runway",
      "Pay £149 on first close",
      "Venn Close — async discovery",
      "Full outreach arsenal",
    ],
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
    features: [
      "150 leads/month",
      "10 prospect cards",
      "Email support",
      "Cancel anytime",
      "Venn Close — async discovery",
      "Outreach arsenal",
      "In-house email finder",
    ],
    cta: "Get started",
    href: "/subscribe?plan=starter",
  },
  {
    name: "Growth",
    price: "£299",
    period: "/month",
    description: "When prospecting becomes a consistent operating rhythm.",
    features: [
      "400 leads/month",
      "Unlimited cards",
      "Outreach sequences",
      "Priority support",
      "Venn Close — async discovery",
      "Full outreach arsenal",
      "Email and LinkedIn finder",
      "Instagram intelligence",
      "Companies House data",
    ],
    cta: "Get started",
    href: "/subscribe?plan=growth",
  },
  {
    name: "Pro",
    price: "£499",
    period: "/month",
    description: "For teams that want the full intelligence stack.",
    features: [
      "Unlimited leads",
      "Unlimited cards",
      "Sequences + proposals",
      "White-label cards",
      "Proposal builder with embedded Stripe payment",
      "Agency OS — full client management",
      "Automated client reports",
      "Complete enrichment suite",
      "White label dashboard",
    ],
    cta: "Get started",
    href: "/subscribe?plan=pro",
  },
];

function Chk() {
  return <span style={{ color: colours.gold }}>✓</span>;
}
function Dash() {
  return <span style={{ color: colours.muted }}>—</span>;
}

const CMP_COLS = ["Solo", "Starter", "Growth", "Pro"] as const;
const CMP_ROWS: { feature: string; solo: React.ReactNode; starter: React.ReactNode; growth: React.ReactNode; pro: React.ReactNode }[] = [
  { feature: "Intelligence pipeline", solo: <Chk />, starter: <Chk />, growth: <Chk />, pro: <Chk /> },
  { feature: "Prospect cards",        solo: "20",     starter: "10",    growth: "Unlimited", pro: "Unlimited" },
  { feature: "Leads per month",       solo: "100",    starter: "150",   growth: "400",       pro: "Unlimited" },
  { feature: "Venn Close",            solo: <Chk />, starter: <Chk />, growth: <Chk />, pro: <Chk /> },
  { feature: "Outreach arsenal",      solo: <Chk />, starter: <Chk />, growth: <Chk />, pro: <Chk /> },
  { feature: "Email finder",          solo: <Dash />, starter: <Chk />, growth: <Chk />, pro: <Chk /> },
  { feature: "LinkedIn finder",       solo: <Dash />, starter: <Dash />, growth: <Chk />, pro: <Chk /> },
  { feature: "Instagram intel",       solo: <Dash />, starter: <Dash />, growth: <Chk />, pro: <Chk /> },
  { feature: "Companies House",       solo: <Dash />, starter: <Dash />, growth: <Chk />, pro: <Chk /> },
  { feature: "Proposal builder",      solo: <Dash />, starter: <Dash />, growth: <Dash />, pro: <Chk /> },
  { feature: "Agency OS",             solo: <Dash />, starter: <Dash />, growth: <Dash />, pro: <Chk /> },
  { feature: "Automated reports",     solo: <Dash />, starter: <Dash />, growth: <Dash />, pro: <Chk /> },
  { feature: "White label",           solo: <Dash />, starter: <Dash />, growth: <Dash />, pro: <Chk /> },
  { feature: "Priority support",      solo: <Dash />, starter: <Dash />, growth: <Dash />, pro: <Chk /> },
];

export function Pricing() {
  const [showCmp, setShowCmp] = useState(false);

  return (
    <Section id="pricing" tone="secondary">
      <div className="venn-container">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Priced like we believe<br />it actually works.</>}
          subline={<>Because we do. Which is why solopreneurs<br />pay nothing until they win.</>}
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
                <Link
                  className={`venn-cta ${plan.highlight ? "venn-cta-primary" : ""}`}
                  href={plan.href}
                  style={{ border: plan.highlight ? "none" : `0.5px solid ${colours.goldBorder}`, color: plan.highlight ? colours.bg : colours.gold, width: "100%" }}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </Reveal>

        {/* Feature comparison toggle */}
        <Reveal delay={0.08}>
          <div style={{ marginTop: 36, textAlign: "center" }}>
            <button
              className="cmp-toggle"
              onClick={() => setShowCmp((v) => !v)}
            >
              {showCmp ? "Hide comparison ↑" : "See full feature comparison ↓"}
            </button>
          </div>

          <AnimatePresence>
            {showCmp && (
              <motion.div
                key="feature-cmp"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="cmp-table-wrap">
                  <table className="cmp-table">
                    <thead>
                      <tr>
                        <th className="cmp-th cmp-th-feature">Feature</th>
                        {CMP_COLS.map((col) => (
                          <th
                            key={col}
                            className="cmp-th"
                            style={{ color: col === "Pro" || col === "Growth" ? colours.gold : colours.secondary }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CMP_ROWS.map((row) => (
                        <tr key={row.feature} className="cmp-tr">
                          <td className="cmp-td-feature">{row.feature}</td>
                          <td className="cmp-td">{row.solo}</td>
                          <td className="cmp-td">{row.starter}</td>
                          <td className="cmp-td">{row.growth}</td>
                          <td className="cmp-td cmp-td-pro">{row.pro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

        /* ── Comparison toggle ── */
        .cmp-toggle {
          background: transparent;
          border: none;
          color: ${colours.gold};
          cursor: pointer;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          transition: opacity 180ms ease;
        }
        .cmp-toggle:hover { opacity: 0.7; }

        /* ── Comparison table ── */
        .cmp-table-wrap {
          background: #0F0E0B;
          border: 0.5px solid #1E1C18;
          border-radius: 8px;
          margin: 24px auto 0;
          max-width: 900px;
          overflow-x: auto;
          padding: 24px;
        }
        .cmp-table {
          border-collapse: collapse;
          min-width: 560px;
          width: 100%;
        }
        .cmp-th {
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0 14px 16px;
          text-align: center;
        }
        .cmp-th-feature {
          color: ${colours.secondary};
          text-align: left;
        }
        .cmp-tr { border-top: 0.5px solid rgba(255,253,248,0.06); }
        .cmp-td-feature {
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 13px;
          padding: 12px 14px 12px 0;
          text-align: left;
        }
        .cmp-td {
          font-size: 14px;
          padding: 12px 14px;
          text-align: center;
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 12px;
        }
        .cmp-td-pro { background: rgba(196,151,63,0.04); border-radius: 4px; }

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

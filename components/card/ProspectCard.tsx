"use client";

import { motion } from "framer-motion";

interface Observation {
  title: string;
  detail: string;
}

interface ProspectCardProps {
  businessName: string;
  headline: string;
  observations: Observation[];
  revenueLoss: string | null;
  ctaText: string;
  ctaType: string;
  ctaValue: string | null;
  brandColour: string;
  logoUrl: string | null;
  agencyName: string | null;
  niche: string;
  location: string;
}

function AgencyLogo({
  logoUrl,
  agencyName,
  brandColour,
}: {
  logoUrl: string | null;
  agencyName: string | null;
  brandColour: string;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={agencyName ?? "Agency"}
        style={{ height: 28, maxWidth: 120, objectFit: "contain" }}
      />
    );
  }
  return (
    <span
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: brandColour,
        fontFamily: "Georgia, serif",
        letterSpacing: "-0.02em",
      }}
    >
      {agencyName ?? "Agency"}
    </span>
  );
}

function CTAButton({
  ctaText,
  ctaType,
  ctaValue,
  brandColour,
}: {
  ctaText: string;
  ctaType: string;
  ctaValue: string | null;
  brandColour: string;
}) {
  function getHref() {
    if (!ctaValue) return "#";
    if (ctaType === "reply") return `mailto:${ctaValue}`;
    if (ctaType === "calendly") return ctaValue;
    if (ctaType === "video") return ctaValue;
    return ctaValue;
  }

  return (
    <a
      href={getHref()}
      target={ctaType !== "reply" ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        display: "block",
        width: "100%",
        background: brandColour,
        color: "#fff",
        textAlign: "center",
        padding: "16px 24px",
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        textDecoration: "none",
        letterSpacing: "-0.01em",
        minHeight: 52,
        boxSizing: "border-box",
      }}
    >
      {ctaText}
    </a>
  );
}

export function ProspectCard({
  businessName,
  headline,
  observations,
  revenueLoss,
  ctaText,
  ctaType,
  ctaValue,
  brandColour,
  logoUrl,
  agencyName,
  niche,
  location,
}: ProspectCardProps) {
  return (
    <>
      <style>{`
        :root { --brand: ${brandColour}; }

        .pc-container {
          min-height: 100vh;
          background: #FAFAF8;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .pc-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .pc-header {
          padding-top: 40px;
          padding-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #F0EDE8;
          gap: 12px;
        }
        .pc-header-tagline {
          font-size: 12px;
          color: #999;
          font-weight: 400;
          text-align: right;
          flex-shrink: 0;
        }
        .pc-hero {
          padding-top: 48px;
          padding-bottom: 40px;
        }
        .pc-hero-eyebrow {
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }
        .pc-hero-name {
          font-size: 40px;
          line-height: 1.1;
          color: #1a1a18;
          margin-bottom: 20px;
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          word-break: break-word;
        }
        .pc-hero-headline {
          font-size: 18px;
          line-height: 1.6;
          color: #4a4a48;
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 400;
        }
        .pc-divider { height: 1px; background: #F0EDE8; }
        .pc-section {
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .pc-section-label {
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 28px;
        }
        .pc-obs-list { display: flex; flex-direction: column; gap: 28px; }
        .pc-obs-item { display: flex; gap: 20px; }
        .pc-obs-bar {
          width: 2px;
          flex-shrink: 0;
          background: var(--brand);
          border-radius: 2px;
          align-self: stretch;
          min-height: 40px;
        }
        .pc-obs-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a18;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .pc-obs-detail {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
        .pc-revenue-section {
          padding-top: 36px;
          padding-bottom: 36px;
        }
        .pc-revenue-label {
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }
        .pc-revenue-amount {
          font-size: 42px;
          font-family: Georgia, 'Times New Roman', serif;
          color: var(--brand);
          line-height: 1;
          margin-bottom: 6px;
        }
        .pc-revenue-sub { font-size: 13px; color: #999; }
        .pc-cta-section {
          padding-top: 8px;
          padding-bottom: 48px;
        }
        .pc-footer {
          padding-top: 24px;
          padding-bottom: 32px;
          border-top: 1px solid #F0EDE8;
          text-align: center;
        }
        .pc-footer p { font-size: 12px; color: #ccc; }

        @media (max-width: 480px) {
          .pc-inner { padding: 0 16px; }
          .pc-header { padding-top: 24px; padding-bottom: 20px; }
          .pc-header-tagline { font-size: 11px; }
          .pc-hero { padding-top: 28px; padding-bottom: 28px; }
          .pc-hero-name { font-size: 26px; }
          .pc-hero-headline { font-size: 15px; line-height: 1.55; }
          .pc-section { padding-top: 24px; padding-bottom: 24px; }
          .pc-obs-item { gap: 14px; }
          .pc-obs-title { font-size: 14px; }
          .pc-obs-detail { font-size: 13px; line-height: 1.6; }
          .pc-revenue-section { padding-top: 24px; padding-bottom: 24px; }
          .pc-revenue-amount { font-size: 36px; }
          .pc-cta-section { padding-top: 4px; padding-bottom: 36px; }
          .pc-footer { padding-top: 16px; padding-bottom: 24px; }
        }
      `}</style>

      <div className="pc-container">
        <div className="pc-inner">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="pc-header"
          >
            <AgencyLogo
              logoUrl={logoUrl}
              agencyName={agencyName}
              brandColour={brandColour}
            />
            <p className="pc-header-tagline">Put this together specifically for you</p>
          </motion.header>

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="pc-hero"
          >
            <p className="pc-hero-eyebrow">
              {niche} · {location}
            </p>
            <h1 className="pc-hero-name">{businessName}</h1>
            <p className="pc-hero-headline">{headline}</p>
          </motion.section>

          <div className="pc-divider" />

          {/* Observations */}
          {observations.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16 }}
              className="pc-section"
            >
              <p className="pc-section-label">What we found</p>
              <div className="pc-obs-list">
                {observations.map((obs, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="pc-obs-item"
                  >
                    <div className="pc-obs-bar" />
                    <div>
                      <h3 className="pc-obs-title">{obs.title}</h3>
                      <p className="pc-obs-detail">{obs.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Revenue impact */}
          {revenueLoss && (
            <>
              <div className="pc-divider" />
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pc-revenue-section"
              >
                <p className="pc-revenue-label">
                  We estimate this is costing you approximately
                </p>
                <p className="pc-revenue-amount">{revenueLoss}</p>
                <p className="pc-revenue-sub">per month in missed revenue</p>
              </motion.section>
            </>
          )}

          {/* CTA */}
          <div className="pc-divider" />
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pc-cta-section"
            style={{ paddingTop: 28 }}
          >
            <CTAButton
              ctaText={ctaText}
              ctaType={ctaType}
              ctaValue={ctaValue}
              brandColour={brandColour}
            />
          </motion.section>

          {/* Footer */}
          <footer className="pc-footer">
            <p>
              {agencyName ?? "Venn"} · This analysis was prepared specifically for{" "}
              {businessName}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

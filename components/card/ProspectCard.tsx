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

function AgencyLogo({ logoUrl, agencyName, brandColour }: { logoUrl: string | null; agencyName: string | null; brandColour: string }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={agencyName ?? "Agency"} style={{ height: 28, objectFit: "contain" }} />;
  }
  return (
    <span
      style={{
        fontSize: 15,
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

function CTAButton({ ctaText, ctaType, ctaValue, brandColour }: {
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
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            paddingTop: 40,
            paddingBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F0EDE8",
          }}
        >
          <AgencyLogo logoUrl={logoUrl} agencyName={agencyName} brandColour={brandColour} />
          <p style={{ fontSize: 12, color: "#999", fontWeight: 400 }}>
            Put this together specifically for you
          </p>
        </motion.header>

        {/* Business name hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ paddingTop: 48, paddingBottom: 40 }}
        >
          <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            {niche} · {location}
          </p>
          <h1
            style={{
              fontSize: 40,
              lineHeight: 1.1,
              color: "#1a1a18",
              marginBottom: 20,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            {businessName}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "#4a4a48",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
            }}
          >
            {headline}
          </p>
        </motion.section>

        {/* Divider */}
        <div style={{ height: 1, background: "#F0EDE8" }} />

        {/* Observations */}
        {observations.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16 }}
            style={{ paddingTop: 40, paddingBottom: 40 }}
          >
            <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 28 }}>
              What we found
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {observations.map((obs, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  style={{ display: "flex", gap: 20 }}
                >
                  <div
                    style={{
                      width: 2,
                      flexShrink: 0,
                      background: brandColour,
                      borderRadius: 2,
                      alignSelf: "stretch",
                      minHeight: 40,
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a18", marginBottom: 6, lineHeight: 1.3 }}>
                      {obs.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>
                      {obs.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Revenue impact */}
        {revenueLoss && (
          <>
            <div style={{ height: 1, background: "#F0EDE8" }} />
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ paddingTop: 36, paddingBottom: 36 }}
            >
              <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                We estimate this is costing you approximately
              </p>
              <p
                style={{
                  fontSize: 42,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: brandColour,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {revenueLoss}
              </p>
              <p style={{ fontSize: 13, color: "#999" }}>per month in missed revenue</p>
            </motion.section>
          </>
        )}

        {/* Demo placeholder */}
        <div style={{ height: 1, background: "#F0EDE8" }} />
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ paddingTop: 36, paddingBottom: 36 }}
        >
          <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
            See it in action
          </p>
          <div
            style={{
              borderRadius: 10,
              overflow: "hidden",
              background: "#F5F3F0",
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "#bbb" }}>Product demo</p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ paddingTop: 8, paddingBottom: 48 }}
        >
          <CTAButton
            ctaText={ctaText}
            ctaType={ctaType}
            ctaValue={ctaValue}
            brandColour={brandColour}
          />
        </motion.section>

        {/* Footer */}
        <footer
          style={{
            paddingTop: 24,
            paddingBottom: 32,
            borderTop: "1px solid #F0EDE8",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "#ccc" }}>
            {agencyName ?? "Venn"} · This analysis was prepared specifically for {businessName}
          </p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CARD = {
  businessName: "Glow Aesthetics",
  location: "Manchester",
  niche: "Aesthetic Clinic",
  rating: 4.1,
  reviewCount: 87,
  agencyOwner: "Luke K.",
  agencyName: "Momentum Agency",
  minutesAnalysing: 14,
  observations: [
    {
      title: "Wait times come up more than anything",
      quote:
        "Lovely clinic but had to wait nearly 30 minutes past my appointment time.",
      frequency: "6 mentions this month",
      impact: "high" as const,
    },
    {
      title: "Booking on mobile creates friction",
      quote:
        "The booking link doesn't work on my phone, had to try on my laptop later.",
      frequency: "Affecting ~23% of potential clients",
      impact: "high" as const,
    },
    {
      title: "Results are great. Engagement is low.",
      quote: "Amazing results as always, my skin has never looked better!",
      frequency: "High satisfaction, low rebooking frequency",
      impact: "medium" as const,
    },
  ],
  revenueLoss: 2400,
  revenueBreakdown: [
    { label: "Reduce wait time dissatisfaction", amount: 1250 },
    { label: "Fix mobile booking friction", amount: 780 },
    { label: "Increase rebooking rate", amount: 370 },
  ],
  approach: [
    {
      title: "Remove friction",
      body: "Fix the booking experience and reduce wait time friction. Your competitors offer instant online booking. This is fixable in 48 hours.",
    },
    {
      title: "Capture more reviews",
      body: "Your clients love their results. They're just not telling Google. An automated follow-up asking satisfied clients to share their experience costs nothing and compounds over time.",
    },
    {
      title: "Reactivate past clients",
      body: "A meaningful portion of your revenue potential is sitting in dormant client records. A simple sequence re-engages them without discounting.",
    },
  ],
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: 14, letterSpacing: 2 }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

function ImpactBadge({ impact }: { impact: "high" | "medium" }) {
  const isHigh = impact === "high";
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: 3,
        background: isHigh ? "#fff0f0" : "#fef9ec",
        color: isHigh ? "#c0392b" : "#8a6800",
      }}
    >
      {impact}
    </span>
  );
}

export function CardExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.1"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(10, 9, 7)", "rgb(255, 253, 248)"]
  );
  const labelColor = useTransform(scrollYProgress, [0, 1], ["#C4973F", "#B8872E"]);
  const headlineColor = useTransform(scrollYProgress, [0, 1], ["#FFFDF8", "#0A0907"]);
  const subColor = useTransform(scrollYProgress, [0, 1], ["#888580", "#555250"]);

  return (
    <motion.section
      ref={sectionRef}
      style={{
        background,
        padding: "120px 24px 160px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
            color: labelColor,
          }}
        >
          The digital prospect card
        </motion.p>
        <motion.h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 12,
            lineHeight: 1.1,
            color: headlineColor,
          }}
        >
          This is what your
          <br />
          prospect receives.
        </motion.h2>
        <motion.p
          style={{
            fontSize: 15,
            textAlign: "center",
            marginBottom: 56,
            lineHeight: 1.6,
            color: subColor,
          }}
        >
          Scroll through it. Feel what they feel.
        </motion.p>

        {/* The Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 8,
            border: "0.5px solid #E8E6E0",
            overflow: "hidden",
            boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            color: "#1A1814",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: "32px 36px 24px",
              borderBottom: "0.5px solid #F0EDE6",
              background: "#FFFDF8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "#0A0907",
                  lineHeight: 1.1,
                }}
              >
                {CARD.businessName}
              </h1>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: "#f0fdf0",
                  color: "#15803d",
                  border: "0.5px solid #bbf7d0",
                  whiteSpace: "nowrap",
                }}
              >
                HIGH INTENT
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#888580", marginBottom: 12 }}>
              {CARD.location} · {CARD.niche}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Stars rating={CARD.rating} />
              <span style={{ fontSize: 13, color: "#888580" }}>
                {CARD.rating} ({CARD.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Analysis */}
          <div style={{ padding: "28px 36px", borderBottom: "0.5px solid #F0EDE6" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4973F", marginBottom: 20 }}>
              What we found · {CARD.minutesAnalysing} minutes analysing
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {CARD.observations.map((obs, i) => (
                <div key={i} style={{ paddingLeft: 14, borderLeft: "2px solid #F0EDE6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0907" }}>{obs.title}</p>
                    <ImpactBadge impact={obs.impact} />
                  </div>
                  <blockquote
                    style={{
                      fontStyle: "italic",
                      fontSize: 13,
                      color: "#555250",
                      lineHeight: 1.6,
                      margin: "0 0 6px",
                      borderLeft: "none",
                      padding: 0,
                    }}
                  >
                    &ldquo;{obs.quote}&rdquo;
                  </blockquote>
                  <p style={{ fontSize: 11, color: "#888580", letterSpacing: "0.04em" }}>{obs.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue */}
          <div style={{ padding: "28px 36px", borderBottom: "0.5px solid #F0EDE6", background: "#FDFBF5" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4973F", marginBottom: 16 }}>
              Estimated revenue impact
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontSize: 40,
                  color: "#0A0907",
                  lineHeight: 1,
                }}
              >
                £{CARD.revenueLoss.toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: "#888580" }}>per month left on the table</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CARD.revenueBreakdown.map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#555250" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0907" }}>£{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approach */}
          <div style={{ padding: "28px 36px", borderBottom: "0.5px solid #F0EDE6" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4973F", marginBottom: 20 }}>
              What we'd focus on
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {CARD.approach.map((item, i) => (
                <div key={i}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0907", marginBottom: 6 }}>
                    {i + 1}. {item.title}
                  </p>
                  <p style={{ fontSize: 13, color: "#555250", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: "32px 36px", background: "#0A0907" }}>
            <p
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontSize: 18,
                color: "#FFFDF8",
                lineHeight: 1.6,
                marginBottom: 24,
                fontStyle: "italic",
              }}
            >
              &ldquo;I&apos;ve spent {CARD.minutesAnalysing} minutes analysing your business. Happy to talk
              about how to fix this.&rdquo;
            </p>
            <p style={{ fontSize: 13, color: "#888580", marginBottom: 24 }}>
              — {CARD.agencyOwner}, {CARD.agencyName}
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: 6,
                background: "#C4973F",
                color: "#0A0907",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              }}
            >
              Reply to {CARD.agencyOwner}
            </a>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            textAlign: "center",
            marginTop: 32,
            lineHeight: 1.6,
            color: "#888580",
          }}
        >
          Every prospect gets their own card. Unique URL. Built automatically.
          <br />
          The closest alternative costs $750/month and is manual.
        </p>
      </div>
    </motion.section>
  );
}

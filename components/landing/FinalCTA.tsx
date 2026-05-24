"use client";

import Link from "next/link";

export function FinalCTA() {
  return (
    <section
      style={{
        background: "#0A0907",
        padding: "140px 24px",
        textAlign: "center",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        borderTop: "0.5px solid #1E1C18",
      }}
    >
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            color: "#FFFDF8",
            lineHeight: 1.05,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          You've read this far.
          <br />
          You know what to do.
        </h2>

        <p
          style={{
            fontSize: 16,
            color: "#888580",
            lineHeight: 1.7,
            marginBottom: 44,
          }}
        >
          The next prospect card you send could be the one that changes
          your business. Start finding clients today.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Link
            href="/sign-up"
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: 6,
              background: "#C4973F",
              color: "#0A0907",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Start finding clients
          </Link>
          <Link
            href="/solopreneur"
            style={{
              fontSize: 14,
              color: "#888580",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888580")}
          >
            Apply for solopreneur access →
          </Link>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#444440",
            marginTop: 28,
          }}
        >
          14-day money back guarantee · Cancel anytime · No credit card for trial
        </p>
      </div>
    </section>
  );
}

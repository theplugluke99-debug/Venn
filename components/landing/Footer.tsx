"use client";

import Link from "next/link";

function VennMark() {
  return (
    <svg viewBox="0 0 28 24" width="22" height="19" fill="none" aria-hidden>
      <circle cx="10" cy="12" r="7" stroke="#C4973F" strokeWidth="1" />
      <circle cx="18" cy="12" r="7" stroke="#C4973F" strokeWidth="1" />
      <path d="M 14 6.26 A 7 7 0 0 1 14 17.74 A 7 7 0 0 0 14 6.26 Z" fill="#C4973F" />
    </svg>
  );
}

const COLS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "The card", href: "#the-card" },
      { label: "Pricing", href: "#pricing" },
      { label: "Compare", href: "#compare" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Get started", href: "/sign-up" },
      { label: "Solopreneur", href: "/solopreneur" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "#0A0907",
        borderTop: "0.5px solid #1E1C18",
        padding: "60px 24px 40px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 60,
          }}
          className="footer-grid"
        >
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 16 }}>
              <VennMark />
              <span
                style={{
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontSize: 16,
                  color: "#FFFDF8",
                }}
              >
                Venn
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: "#444440",
                lineHeight: 1.7,
                maxWidth: 260,
              }}
            >
              The prospect engine for agency owners. Find clients, understand their problems, win their business.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#444440",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      fontSize: 13,
                      color: "#888580",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888580")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "0.5px solid #1E1C18",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "#444440" }}>
            © {new Date().getFullYear()} Venn. Built for agency owners.
          </p>
          <p style={{ fontSize: 12, color: "#2A2826" }}>
            luke@venn.so
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

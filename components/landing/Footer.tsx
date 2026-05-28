"use client";

import Link from "next/link";
import { colours } from "./system";

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
      { label: "Cookies", href: "/cookies" },
      { label: "Acceptable Use", href: "/acceptable-use" },
      { label: "Refunds", href: "/refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: colours.bg,
        borderTop: `0.5px solid ${colours.border}`,
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        padding: "56px 24px 36px",
      }}
    >
      <div className="venn-container">
        <div className="footer-grid" style={{ display: "grid", gap: 44, gridTemplateColumns: "2fr 1fr 1fr 1fr", marginBottom: 54 }}>
          <div>
            <Link href="/" style={{ display: "inline-flex", marginBottom: 18, textDecoration: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/venn-logo.svg" alt="Venn" style={{ height: 64, width: "auto", display: "block" }} />
            </Link>
            <p className="venn-copy" style={{ color: colours.muted, fontSize: 13, maxWidth: 280 }}>
              The prospect engine that thinks before it speaks.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="venn-eyebrow" style={{ color: colours.muted, marginBottom: 16 }}>
                {col.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(({ label, href }) => (
                  <Link key={label} href={href} style={{ color: colours.secondary, fontSize: 13, textDecoration: "none" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ alignItems: "center", borderTop: `0.5px solid ${colours.border}`, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", paddingTop: 24, marginBottom: 16 }}>
          <p style={{ color: colours.muted, fontSize: 12 }}>© {new Date().getFullYear()} Venn. Built for agency owners.</p>
          <p style={{ color: "#2A2826", fontSize: 12 }}>hello@getvenn.agency</p>
        </div>

        {/* Legal links strip */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 12, borderTop: `0.5px solid #141210` }}>
          {[
            { label: "Terms", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
            { label: "Cookies", href: "/cookies" },
            { label: "Acceptable Use", href: "/acceptable-use" },
            { label: "Refunds", href: "/refunds" },
          ].map(({ label, href }, i, arr) => (
            <span key={href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link href={href} style={{ fontSize: 12, color: "#444440", textDecoration: "none" }}>
                {label}
              </Link>
              {i < arr.length - 1 && (
                <span style={{ color: "#2A2826", fontSize: 12 }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        footer a { transition: color 220ms var(--venn-ease); }
        footer a:hover { color: ${colours.ivory} !important; }
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}

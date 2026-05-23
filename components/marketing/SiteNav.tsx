"use client";

import { useState } from "react";
import Link from "next/link";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,9,7,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "0.5px solid #1E1C18",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "#1A1206",
                border: "0.5px solid #3A2A10",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#C4973F",
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                V
              </span>
            </div>
            <span
              style={{
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontSize: 17,
              }}
            >
              Venn
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  color: "#888",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/sign-in"
              style={{
                fontSize: 13,
                color: "#555250",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555250")}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: 7,
                background: "#C4973F",
                color: "#0A0907",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#888",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "#0A0907",
            paddingTop: 56,
            display: "flex",
            flexDirection: "column",
            padding: "80px 32px 32px",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          }}
        >
          {[
            { href: "#how-it-works", label: "How it works" },
            { href: "#pricing", label: "Pricing" },
            { href: "#faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 24,
                color: "#FFFDF8",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                textDecoration: "none",
                paddingBottom: 20,
                borderBottom: "0.5px solid #1E1C18",
                marginBottom: 20,
              }}
            >
              {label}
            </a>
          ))}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: 8,
                border: "0.5px solid #2A2826",
                color: "#888",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: 8,
                background: "#C4973F",
                color: "#0A0907",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Get started free
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function VennMark({ size = 28 }: { size?: number }) {
  const h = Math.round((size * 24) / 28);
  return (
    <svg viewBox="0 0 28 24" width={size} height={h} fill="none" aria-hidden>
      <defs>
        <clipPath id="vm-clip-left">
          <circle cx="10" cy="12" r="7" />
        </clipPath>
      </defs>
      <circle cx="10" cy="12" r="7" stroke="#C4973F" strokeWidth="1" fill="none" />
      <circle cx="18" cy="12" r="7" stroke="#C4973F" strokeWidth="1" fill="none" />
      {/* Intersection filled gold via clipPath */}
      <circle cx="18" cy="12" r="7" fill="#C4973F" clipPath="url(#vm-clip-left)" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#prospect-card", label: "The card" },
  { href: "#pricing", label: "Pricing" },
  { href: "#comparison", label: "Compare" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          zIndex: 200,
          background: scrolled ? "rgba(10,9,7,0.95)" : "transparent",
          borderBottom: scrolled ? "0.5px solid #1E1C18" : "0.5px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <VennMark />
            <span
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontSize: 18,
                color: "#FFFDF8",
                letterSpacing: "-0.01em",
              }}
            >
              Venn
            </span>
          </Link>

          <div className="nav-desktop-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{ fontSize: 13, color: "#888580", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888580")}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="nav-desktop-cta" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/sign-in"
              style={{ fontSize: 13, color: "#888580", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888580")}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 16px",
                borderRadius: 6,
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

          <button
            className="nav-hamburger"
            onClick={() => setMobile(!mobile)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#888580", padding: 4 }}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobile ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 199,
              background: "#0A0907",
              display: "flex",
              flexDirection: "column",
              padding: "80px 32px 40px",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
            }}
          >
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setMobile(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                style={{
                  fontSize: 32,
                  color: "#FFFDF8",
                  textDecoration: "none",
                  paddingBottom: 20,
                  marginBottom: 20,
                  borderBottom: "0.5px solid #1E1C18",
                }}
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}
            >
              <Link
                href="/sign-in"
                onClick={() => setMobile(false)}
                style={{
                  textAlign: "center",
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "0.5px solid #2A2826",
                  color: "#888580",
                  textDecoration: "none",
                  fontSize: 14,
                  fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobile(false)}
                style={{
                  textAlign: "center",
                  padding: "12px 24px",
                  borderRadius: 8,
                  background: "#C4973F",
                  color: "#0A0907",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                }}
              >
                Get started free
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links, .nav-desktop-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

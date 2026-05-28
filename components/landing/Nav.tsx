"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { CTA, VennLogo, colours, motionPresets } from "./system";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#the-card", label: "The card" },
  { href: "#pricing", label: "Pricing" },
  { href: "#compare", label: "Compare" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          inset: "0 0 auto",
          height: 64,
          zIndex: 200,
          background: scrolled ? "rgba(10, 9, 7, 0.82)" : "transparent",
          borderBottom: `0.5px solid ${scrolled ? "rgba(255,253,248,0.08)" : "transparent"}`,
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          transition: "background 360ms var(--venn-ease), border-color 360ms var(--venn-ease), backdrop-filter 360ms var(--venn-ease)",
        }}
      >
        <div
          className="venn-container"
          style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Link href="/" aria-label="Venn home" style={{ textDecoration: "none" }}>
            <VennLogo size={28} variant="horizontal" />
          </Link>

          <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} style={{ color: colours.secondary, fontSize: 13, textDecoration: "none", transition: "color 220ms var(--venn-ease)" }}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-desktop-cta" style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/sign-in" style={{ color: colours.secondary, fontSize: 13, textDecoration: "none" }}>
              Sign in
            </Link>
            <CTA href="/sign-up">Get started</CTA>
          </div>

          <button
            className="nav-hamburger"
            type="button"
            onClick={() => setMobile((value) => !value)}
            aria-label="Menu"
            aria-expanded={mobile}
            style={{
              alignItems: "center",
              background: "transparent",
              border: `0.5px solid ${colours.border}`,
              borderRadius: 6,
              color: colours.ivory,
              cursor: "pointer",
              display: "none",
              height: 36,
              justifyContent: "center",
              width: 36,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobile ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M5 7h14M5 12h14M5 17h14" />}
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
            transition={motionPresets.soft}
            style={{
              background: colours.bg,
              display: "flex",
              flexDirection: "column",
              inset: 0,
              padding: "92px 28px 32px",
              position: "fixed",
              zIndex: 199,
            }}
          >
            {NAV_LINKS.map(({ href, label }, index) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setMobile(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionPresets.soft, delay: index * 0.04 }}
                style={{
                  borderBottom: `0.5px solid ${colours.border}`,
                  color: colours.ivory,
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  fontSize: 34,
                  lineHeight: 1,
                  padding: "0 0 22px",
                  marginBottom: 22,
                  textDecoration: "none",
                }}
              >
                {label}
              </motion.a>
            ))}
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <Link className="venn-cta" href="/sign-in" onClick={() => setMobile(false)} style={{ border: `0.5px solid ${colours.border}`, color: colours.secondary }}>
                Sign in
              </Link>
              <Link className="venn-cta venn-cta-primary" href="/sign-up" onClick={() => setMobile(false)}>
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-desktop-links a:hover,
        .nav-desktop-cta a:hover { color: ${colours.ivory} !important; }
        @media (max-width: 820px) {
          .nav-desktop-links, .nav-desktop-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

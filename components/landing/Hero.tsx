"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Link from "next/link";

// Vesica piscis for circles at (20,30) and (80,30) r=35 in viewBox 0 0 100 60
// Intersection points: y = 30 ± sqrt(35² − 30²) = 30 ± 18.03
const LENS_PATH = "M 50 11.97 A 35 35 0 0 1 50 48.03 A 35 35 0 0 0 50 11.97 Z";

const HEADLINE_LINES = [
  ["The", "clients", "you", "need"],
  ["are", "already", "out", "there."],
  ["Venn", "knows", "exactly"],
  ["who", "they", "are."],
];

function VennMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 24" width={size} height={Math.round((size * 24) / 28)} fill="none" aria-hidden>
      <defs>
        <clipPath id="hero-mark-clip">
          <circle cx="10" cy="12" r="7" />
        </clipPath>
      </defs>
      <circle cx="10" cy="12" r="7" stroke="#C4973F" strokeWidth="1" fill="none" />
      <circle cx="18" cy="12" r="7" stroke="#C4973F" strokeWidth="1" fill="none" />
      <circle cx="18" cy="12" r="7" fill="#C4973F" clipPath="url(#hero-mark-clip)" />
    </svg>
  );
}

export function Hero() {
  const leftCx = useMotionValue(-30);
  const rightCx = useMotionValue(130);

  const [phase, setPhase] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const timers = [
      // Phase 1 — logo
      setTimeout(() => setPhase(1), 50),
      // Phase 2 — circles start moving
      setTimeout(() => {
        setPhase(2);
        animate(leftCx, 20, { duration: 2.2, ease: [0.45, 0, 0.55, 1] });
        animate(rightCx, 80, { duration: 2.2, ease: [0.45, 0, 0.55, 1] });
      }, 300),
      // Phase 3 — intersection ignites
      setTimeout(() => {
        setPhase(3);
        setPulseKey((k) => k + 1);
      }, 2500),
      // Phase 4 — breathing starts (400ms after ignition)
      setTimeout(() => setBreathing(true), 2900),
      // Phase 5 — headline
      setTimeout(() => setPhase(5), 3000),
      // Phase 6 — subline
      setTimeout(() => setPhase(6), 4000),
      // Phase 7 — CTAs
      setTimeout(() => setPhase(7), 4400),
      // Phase 8 — pills
      setTimeout(() => setPhase(8), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let wordIndex = 0;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#0A0907",
        overflow: "hidden",
      }}
    >
      {/* Background circles — absolute SVG covers full section */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left circle */}
        <motion.circle
          cx={leftCx}
          cy={30}
          r={35}
          stroke="#C4973F"
          strokeWidth="0.2"
          fill="none"
        />
        {/* Right circle */}
        <motion.circle
          cx={rightCx}
          cy={30}
          r={35}
          stroke="#C4973F"
          strokeWidth="0.2"
          fill="none"
        />

        {/* Radiance pulse on ignition */}
        {phase >= 3 && (
          <motion.circle
            key={`radiance-${pulseKey}`}
            cx={50}
            cy={30}
            r={3}
            fill="#C4973F"
            initial={{ r: 3, opacity: 0.5 }}
            animate={{ r: 20, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Vesica piscis — the intersection */}
        <motion.path
          d={LENS_PATH}
          fill="#C4973F"
          initial={{ opacity: 0 }}
          animate={
            breathing
              ? { opacity: [0.8, 1, 0.8] }
              : phase >= 3
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={
            breathing
              ? { duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }
              : { duration: 0.4 }
          }
        />

        {/* Ambient glow around intersection */}
        {phase >= 3 && (
          <circle cx={50} cy={30} r={12} fill="url(#hero-glow)" opacity={0.35} />
        )}

        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4973F" stopOpacity="1" />
            <stop offset="100%" stopColor="#C4973F" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          padding: "0 24px",
        }}
      >
        {/* Logo — top centre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingTop: 100,
            paddingBottom: 0,
          }}
        >
          <VennMark size={30} />
          <span
            style={{
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: 20,
              color: "#FFFDF8",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            Venn
          </span>
        </motion.div>

        {/* Spacer — pushes headline below circle centre */}
        <div style={{ flex: 1, minHeight: "38vh" }} />

        {/* Headline — word by word */}
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontWeight: 400,
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: "-0.01em",
            marginBottom: 32,
            padding: 0,
          }}
        >
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {line.map((word) => {
                const delay = wordIndex++ * 0.12;
                return (
                  <motion.span
                    key={`${li}-${word}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ delay, duration: 0.45, ease: "easeOut" }}
                    style={{
                      display: "inline-block",
                      marginRight: "0.25em",
                      fontSize: "clamp(40px, 5.5vw, 68px)",
                      color: "#FFFDF8",
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            fontSize: 18,
            color: "#888580",
            lineHeight: 1.7,
            maxWidth: 480,
            textAlign: "center",
            margin: "0 0 40px",
          }}
        >
          Find them. Know what&apos;s broken in their business.
          <br />
          Say exactly the right thing. Win.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <Link
            href="/sign-up"
            style={{
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              padding: "14px 28px",
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
          <a
            href="#how-it-works"
            style={{
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              fontSize: 14,
              color: "#C4973F",
              textDecoration: "none",
            }}
          >
            See how it works →
          </a>
        </motion.div>

        {/* Stat pills */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 8 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            fontSize: 11,
            color: "#444440",
            letterSpacing: "0.06em",
            textAlign: "center",
            marginBottom: 80,
          }}
        >
          Replaces Apollo · Clay · Digital sales rooms
        </motion.p>
      </div>
    </section>
  );
}

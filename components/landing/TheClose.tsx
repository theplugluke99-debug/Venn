"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

function VennCircles({ progress }: { progress: number }) {
  const gap = 30 - progress * 10;
  const lx = 50 - gap;
  const rx = 50 + gap;

  return (
    <svg
      viewBox="0 0 100 60"
      width="200"
      height="120"
      fill="none"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <circle cx={lx} cy={30} r={22} stroke="#C4973F" strokeWidth="0.4" fill="none" opacity={0.6} />
      <circle cx={rx} cy={30} r={22} stroke="#C4973F" strokeWidth="0.4" fill="none" opacity={0.6} />
      {progress > 0.3 && (
        <ellipse
          cx={50}
          cy={30}
          rx={Math.max(0, 22 - gap * 0.8)}
          ry={Math.min(22, 22 * (1 - gap / 30) * 2.5)}
          fill="#C4973F"
          opacity={Math.min(1, progress * 1.5)}
        />
      )}
    </svg>
  );
}

export function TheClose() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "center center"],
  });

  const circleProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="close"
      ref={ref}
      style={{
        background: "#0A0907",
        padding: "140px 24px 160px",
        textAlign: "center",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        borderTop: "0.5px solid #1E1C18",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Animated circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}
        >
          <motion.div style={{ opacity: scrollYProgress }}>
            <VennCircles progress={0.7} />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            color: "#FFFDF8",
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          The right clients
          <br />
          are already out there.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 16,
            color: "#888580",
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          Venn finds where your expertise meets their problem.
          <br />
          That intersection is where you win.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <Link
            href="/sign-up"
            style={{
              display: "inline-block",
              padding: "16px 36px",
              borderRadius: 6,
              background: "#C4973F",
              color: "#0A0907",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.15s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Start finding clients
          </Link>

          <Link
            href="/solopreneur"
            style={{
              fontSize: 13,
              color: "#444440",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#888580")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#444440")}
          >
            Or try the solopreneur tier — pay nothing until you close →
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: 12,
            color: "#2A2826",
            marginTop: 40,
            letterSpacing: "0.04em",
          }}
        >
          No credit card required · Cancel anytime · 14-day money back guarantee
        </motion.p>
      </div>
    </section>
  );
}

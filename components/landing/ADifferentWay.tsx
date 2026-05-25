"use client";

import { motion } from "framer-motion";

const OLD_WAY = [
  "You build a list in Apollo.",
  "You enrich it in Clay.",
  "You write the same email 200 times.",
  "You get a 1.8% reply rate.",
  "You try a different template.",
  "The trust ran out.",
];

const VENN_WAY = [
  "You search for a niche.",
  "Venn finds who has a real problem.",
  "The card writes the message.",
  "They open it because it's true.",
  "You have one conversation. You win.",
];

export function ADifferentWay() {
  return (
    <section
      id="different"
      style={{
        background: "#0F0E0B",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          07 / A different way
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 72,
            lineHeight: 1.1,
          }}
        >
          Most outreach is noise.
          <br />
          <em>This is signal.</em>
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
          }}
          className="way-grid"
        >
          {/* Old way */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "#444440",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Before Venn
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {OLD_WAY.map((line, i) => {
                const isLast = i === OLD_WAY.length - 1;
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{
                      fontFamily: isLast
                        ? "var(--font-instrument-serif), Georgia, serif"
                        : "var(--font-inter), Inter, system-ui, sans-serif",
                      fontSize: isLast ? 18 : 15,
                      color: isLast ? "#C4973F" : "#444440",
                      lineHeight: 1.5,
                      margin: 0,
                      fontStyle: isLast ? "italic" : "normal",
                    }}
                  >
                    {line}
                  </motion.p>
                );
              })}
            </div>
          </div>

          {/* Venn way */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "#C4973F",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              With Venn
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {VENN_WAY.map((line, i) => {
                const isLast = i === VENN_WAY.length - 1;
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.3 }}
                    style={{
                      fontFamily: isLast
                        ? "var(--font-instrument-serif), Georgia, serif"
                        : "var(--font-inter), Inter, system-ui, sans-serif",
                      fontSize: isLast ? 18 : 15,
                      color: isLast ? "#FFFDF8" : "#888580",
                      lineHeight: 1.5,
                      margin: 0,
                      fontStyle: isLast ? "italic" : "normal",
                    }}
                  >
                    {line}
                  </motion.p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #C4973F, transparent)",
            marginTop: 72,
            marginBottom: 48,
            transformOrigin: "center",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "#FFFDF8",
            textAlign: "center",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          Outreach that works doesn&apos;t look like outreach.
          <br />
          <em style={{ color: "#888580" }}>It looks like someone did their homework.</em>
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .way-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </section>
  );
}

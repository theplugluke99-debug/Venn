"use client";

import { motion } from "framer-motion";

const TRUTHS = [
  {
    title: "Apollo gives you a database.",
    body: "275 million contacts. Most outdated. You still research every business yourself. Write every message yourself. You're paying to fire blanks.",
  },
  {
    title: "Clay enriches your data.",
    body: "More fields in your spreadsheet. But data isn't a message. Data doesn't know what to say. You do all the thinking. Still.",
  },
  {
    title: "Templates get ignored.",
    body: "Prospects have seen every variation. The moment it feels like a template it gets deleted. They always know.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function NamedPain() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#0F0E0B",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          The problem with outreach
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "#FFFDF8",
            lineHeight: 1.1,
            marginBottom: 80,
            letterSpacing: "-0.01em",
          }}
        >
          You already know
          <br />
          outreach is broken.
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
          {TRUTHS.map((truth, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#FFFDF8",
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                {truth.title}
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "#888580",
                  lineHeight: 1.8,
                }}
              >
                {truth.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontStyle: "italic",
            color: "#C4973F",
            textAlign: "center",
            marginTop: 80,
            lineHeight: 1.5,
          }}
        >
          "The problem isn't your effort.
          <br />
          It's the tools."
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Founder() {
  return (
    <section
      id="founder"
      style={{
        background: "#0A0907",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        borderTop: "0.5px solid #1E1C18",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
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
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          10 / From the founder
        </motion.p>

        {/* Avatar + growing line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          {/* Circular headshot */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "0.5px solid #2A2826",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src="/founder-headshot.png"
              alt="Luke K., Founder of Venn"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <p style={{ fontSize: 14, color: "#FFFDF8", marginBottom: 4 }}>Luke K.</p>
          <p style={{ fontSize: 12, color: "#444440" }}>Founder, Venn</p>

          {/* Growing gold line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{
              width: 1,
              height: 40,
              background: "#C4973F",
              marginTop: 24,
              transformOrigin: "top",
              opacity: 0.5,
            }}
          />
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <blockquote
            style={{
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: "clamp(18px, 2vw, 22px)",
              color: "#FFFDF8",
              lineHeight: 1.7,
              fontWeight: 400,
              fontStyle: "italic",
              margin: "0 0 32px",
              borderLeft: "none",
              padding: 0,
            }}
          >
            &ldquo;I built Venn because I watched good agencies struggle with bad outreach. Not because
            they lacked skill — because they lacked time to do it properly. Venn does the homework so you
            can just show up and have the right conversation.&rdquo;
          </blockquote>

          {[
            "Every search gives you a real business with a real problem you can genuinely help with.",
            "Every card is built on evidence — Google reviews, competitor gaps, revenue signals.",
            "Every message is written to sound like you spent an hour researching. Because Venn did.",
          ].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "#C4973F",
                  fontSize: 13,
                  marginTop: 2,
                  flexShrink: 0,
                }}
              >
                —
              </span>
              <p style={{ fontSize: 14, color: "#888580", lineHeight: 1.65, margin: 0 }}>
                {line}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

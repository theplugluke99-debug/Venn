"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHANNELS = [
  {
    key: "email",
    label: "Email",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    preview: {
      from: "Luke K. <luke@momentum.agency>",
      subject: "Glow Aesthetics — something I noticed",
      body: "Hi Sarah,\n\nYour reviews mention wait times six times this month. Your two nearest competitors don't have a single complaint about it.\n\nI've put together a short analysis — took 14 minutes. The link is below.\n\nHappy to talk through it if useful.\n\nLuke",
      url: "venn.agency/card/glow-aesthetics-mx7k",
    },
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    preview: {
      from: "Luke K.",
      subject: null,
      body: "Hi Sarah — saw your clinic on Google. Your reviews mention wait times 6× this month, thought it was worth flagging.\n\nI've put a short analysis together: venn.agency/card/glow-aesthetics-mx7k\n\nTook 14 minutes. Worth a look if you get a chance.",
      url: null,
    },
  },
  {
    key: "dm",
    label: "DM",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    preview: {
      from: "@luke.momentum",
      subject: null,
      body: "Hey Sarah 👋 Noticed your reviews mention wait times more than anything else this month. Wanted to share something I put together — takes 60 seconds to look through.\n\nvenn.agency/card/glow-aesthetics-mx7k\n\nNo pitch, just analysis.",
      url: null,
    },
  },
  {
    key: "voice",
    label: "Voicemail",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
      </svg>
    ),
    preview: {
      from: "Luke K. · Momentum Agency",
      subject: "Script",
      body: '"Hi Sarah, this is Luke from Momentum — I spent about 14 minutes looking at your Google reviews and noticed something worth a quick conversation. I\'ve left a link in your inbox at the address on your website. Have a look when you get a moment — no rush at all. Cheers."',
      url: null,
    },
  },
];

export function ChannelDelivery() {
  const [active, setActive] = useState(0);
  const ch = CHANNELS[active];

  return (
    <section
      id="delivery"
      style={{
        background: "#0F0E0B",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
          05 / How it reaches them
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
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          One analysis.
          <br />
          Every channel.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: 15,
            color: "#888580",
            textAlign: "center",
            marginBottom: 56,
            lineHeight: 1.6,
          }}
        >
          The same intelligence shapes your email, your DM, your voicemail script.
          <br />
          You choose the channel. Venn writes the message.
        </motion.p>

        {/* Channel tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {CHANNELS.map((c, i) => (
            <button
              key={c.key}
              onClick={() => setActive(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 6,
                border: active === i ? "0.5px solid #C4973F" : "0.5px solid #1E1C18",
                background: active === i ? "rgba(196,151,63,0.08)" : "transparent",
                color: active === i ? "#C4973F" : "#444440",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              }}
            >
              {c.icon}
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Message preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "#0A0907",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* Email-style header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "0.5px solid #1E1C18",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#1A1814",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#C4973F",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                L
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: "#FFFDF8", margin: 0 }}>{ch.preview.from}</p>
                {ch.preview.subject && (
                  <p style={{ fontSize: 12, color: "#444440", margin: 0 }}>{ch.preview.subject}</p>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#444440",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                just now
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", lineHeight: 1.75 }}>
              {ch.preview.body.split("\n").map((line, i) =>
                line === "" ? (
                  <div key={i} style={{ height: 8 }} />
                ) : (
                  <p key={i} style={{ fontSize: 14, color: "#888580", margin: 0 }}>
                    {line}
                  </p>
                )
              )}
              {ch.preview.url && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#C4973F",
                    fontFamily: "monospace",
                    marginTop: 8,
                  }}
                >
                  {ch.preview.url}
                </p>
              )}
            </div>

            {/* Intent signal strip */}
            <div
              style={{
                padding: "12px 24px",
                borderTop: "0.5px solid #1E1C18",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                className="pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#C4973F",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "#444440", letterSpacing: "0.04em" }}>
                Generated from 847 real reviews · Personalised · Ready to send
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 13,
            color: "#444440",
            textAlign: "center",
            marginTop: 28,
            lineHeight: 1.6,
          }}
        >
          Every message is grounded in real intelligence. No templates. No spray and pray.
        </motion.p>
      </div>
    </section>
  );
}

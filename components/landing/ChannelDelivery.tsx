"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Section, SectionHeader, colours, motionPresets } from "./system";

const CHANNELS = [
  {
    label: "Email",
    from: "Luke K. <luke@momentum.agency>",
    subject: "Glow Aesthetics — something I noticed",
    body: [
      "Hi Sarah,",
      "Your reviews mention wait times six times this month. Your two nearest competitors do not have a single complaint about it.",
      "I put together a short analysis. It took 14 minutes, and it may be useful before you spend more on ads.",
      "Luke",
    ],
  },
  {
    label: "WhatsApp",
    from: "Luke K.",
    subject: "Context-led note",
    body: [
      "Hi Sarah — I noticed a pattern in your Google reviews.",
      "People clearly like the results, but wait times are showing up repeatedly. I made a short private card with the detail.",
      "No rush. Worth a look when you have a minute.",
    ],
  },
  {
    label: "DM",
    from: "@luke.momentum",
    subject: "Quiet opener",
    body: [
      "Hi Sarah — noticed one specific issue in your reviews that may be costing bookings.",
      "I put the evidence in a short card so you can see what I mean without a call first.",
    ],
  },
  {
    label: "Voicemail",
    from: "Luke K. · Momentum Agency",
    subject: "Script",
    body: [
      "Hi Sarah, it is Luke from Momentum.",
      "I spent a few minutes looking at your Google reviews and found a pattern around wait times that may be easy to fix.",
      "I sent the short analysis to the email on your website. No rush at all.",
    ],
  },
];

export function ChannelDelivery() {
  const [active, setActive] = useState(0);
  const channel = CHANNELS[active];

  return (
    <Section id="delivery" tone="secondary">
      <div className="venn-container-narrow">
        <SectionHeader
          eyebrow="Channel delivery"
          title={
            <>
              The prospect engine
              <br />
              that thinks before it speaks.
            </>
          }
          subline="One intelligence layer adapts the same evidence to the channel, without turning it into noise."
        />

        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 22 }}>
            {CHANNELS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActive(index)}
                style={{
                  background: active === index ? "rgba(196,151,63,0.08)" : "transparent",
                  border: `0.5px solid ${active === index ? colours.goldBorder : colours.border}`,
                  borderRadius: 999,
                  color: active === index ? colours.gold : colours.secondary,
                  cursor: "pointer",
                  fontSize: 13,
                  minHeight: 38,
                  padding: "0 15px",
                  transition: "background 260ms var(--venn-ease), border-color 260ms var(--venn-ease), color 260ms var(--venn-ease)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="venn-card" style={{ overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={channel.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={motionPresets.soft}
              >
                <header style={{ alignItems: "center", borderBottom: `0.5px solid ${colours.border}`, display: "flex", gap: 14, padding: "18px 22px" }}>
                  <div style={{ alignItems: "center", background: "#18150f", border: `0.5px solid ${colours.border}`, borderRadius: "50%", color: colours.gold, display: "flex", flexShrink: 0, fontSize: 13, fontWeight: 600, height: 38, justifyContent: "center", width: 38 }}>
                    L
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: colours.ivory, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{channel.from}</p>
                    <p style={{ color: colours.muted, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{channel.subject}</p>
                  </div>
                  <span style={{ color: colours.muted, fontSize: 11 }}>ready</span>
                </header>

                <div style={{ padding: "26px 28px 30px" }}>
                  {channel.body.map((line) => (
                    <p key={line} style={{ color: colours.secondary, fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>
                      {line}
                    </p>
                  ))}
                  <p style={{ color: colours.gold, fontFamily: "monospace", fontSize: 12, marginTop: 10 }}>
                    venn.agency/card/glow-aesthetics-mx7k
                  </p>
                </div>

                <footer style={{ alignItems: "center", borderTop: `0.5px solid ${colours.border}`, display: "flex", gap: 9, padding: "13px 22px" }}>
                  <span className="pulse-dot" style={{ background: colours.gold, borderRadius: "50%", height: 6, width: 6 }} />
                  <span style={{ color: colours.muted, fontSize: 11, letterSpacing: "0.04em" }}>
                    Generated from the same intelligence card
                  </span>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

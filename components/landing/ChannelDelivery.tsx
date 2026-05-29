"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Section, colours } from "./system";

const CHANNELS = [
  { name: "WhatsApp", tone: "Personal. Direct. Conversational." },
  { name: "Instagram", tone: "Visual. Casual. Curiosity-led." },
  { name: "Email", tone: "Professional. Clear. Considered." },
  { name: "LinkedIn", tone: "Relevant. Professional. Trusted." },
];

function WAPreview() {
  return (
    <div className="cprev cprev-wa">
      <div className="cprev-head">
        <span className="cprev-avatar wa-avatar" />
        <div className="cprev-head-info">
          <span className="agency-brand cprev-name">thrive online.</span>
          <small>online · 9:41 AM</small>
        </div>
      </div>
      <div className="cprev-bubble">
        Put something together specifically for you —
      </div>
      <a className="cprev-link">getvenn.agency/c/glow-aesthetics</a>
      <div className="cprev-richcard">
        <div className="cprev-richimg">
          <Image src="/landing/glow-aesthetics-reception.png" alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
        </div>
        <p className="cprev-richname">Glow Aesthetics</p>
      </div>
      <p className="cprev-tick">✓✓ Delivered</p>
    </div>
  );
}

function IGPreview() {
  return (
    <div className="cprev cprev-ig">
      <div className="cprev-head">
        <span className="cprev-avatar ig-avatar" />
        <div className="cprev-head-info">
          <span className="agency-brand cprev-name">thriveonline_</span>
          <small>Instagram · Active now</small>
        </div>
      </div>
      <div className="cprev-bubble">
        Hey Glow 👋<br />
        Put something together specifically for you —
      </div>
      <a className="cprev-link">getvenn.agency/c/glow-aesthetics</a>
      <p className="cprev-tick">Seen</p>
    </div>
  );
}

function EmailPreview() {
  return (
    <div className="cprev cprev-email">
      <div className="cprev-email-header">
        <div><span className="cprev-field">From</span> <span className="agency-brand">Luke at thrive online.</span></div>
        <div><span className="cprev-field">To</span> Glow Aesthetics</div>
        <div className="cprev-subject">Something specific to Glow Aesthetics</div>
      </div>
      <div className="cprev-bubble">Thought you might find this useful.</div>
      <a className="cprev-link">getvenn.agency/c/glow-aesthetics</a>
    </div>
  );
}

function LIPreview() {
  return (
    <div className="cprev cprev-li">
      <div className="cprev-head">
        <span className="cprev-avatar li-avatar" />
        <div className="cprev-head-info">
          <span className="agency-brand cprev-name">Luke K.</span>
          <span className="cprev-name-sub"> · thrive online.</span>
          <small>LinkedIn · 2nd</small>
        </div>
      </div>
      <div className="cprev-bubble">
        Hi there, saw your clinic and wanted to share something that might be helpful. Put something together specifically for you —
      </div>
      <a className="cprev-link">getvenn.agency/c/glow-aesthetics</a>
    </div>
  );
}

const PREVIEWS = [
  { channel: "WhatsApp", label: "WhatsApp", node: <WAPreview /> },
  { channel: "Instagram", label: "Instagram", node: <IGPreview /> },
  { channel: "Email", label: "Email", node: <EmailPreview /> },
  { channel: "LinkedIn", label: "LinkedIn", node: <LIPreview /> },
];

export function ChannelDelivery() {
  const [selected, setSelected] = useState(CHANNELS[0]);

  return (
    <Section id="delivery" tone="primary" className="delivery-cinema">
      <div className="venn-container">
        <Reveal>
          <div className="delivery-title">
            <p className="venn-eyebrow">05 / The channel delivery</p>
            <h2>The twelve words.<br />Delivered anywhere.</h2>
            <p className="venn-copy">Venn adapts to the channel. Your message always lands with impact.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="phone-stage">
            <div className="main-phone">
              <div className="phone-screen">
                <div className="phone-status">9:41</div>
                <div className="chat-head">
                  <span />
                  <div>
                    <b className="agency-brand">{selected.name === "Instagram" ? "thriveonline_" : selected.name === "Email" ? "Luke at thrive online." : "thrive online."}</b>
                    <small>{selected.name === "Email" ? "Glow Aesthetics" : selected.name === "LinkedIn" ? "2nd · Connected" : "online"}</small>
                  </div>
                </div>
                <div className="day-pill">Today</div>
                <div className="chat-bubble">Put something together specifically for you —</div>
                <a>getvenn.agency/c/glow-aesthetics</a>
                <div className="message-card">
                  <div className="message-image">
                    <Image src="/landing/glow-aesthetics-reception.png" alt="Glow Aesthetics reception" fill sizes="280px" style={{ objectFit: "cover" }} />
                  </div>
                  <p className="venn-eyebrow">Personalised growth opportunity</p>
                  <h3>Glow Aesthetics</h3>
                  <small>We noticed a few things about your reviews, bookings and competitors.</small>
                  <strong>View your personalised insights →</strong>
                </div>
                <div className="phone-input">+</div>
              </div>
            </div>
            <div className="delivery-note">
              <span>←</span>
              <p>One message.<br />Personalised.<br />Every time.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="channel-pills">
            {CHANNELS.map((channel) => (
              <button
                key={channel.name}
                className={selected.name === channel.name ? "active" : ""}
                onClick={() => setSelected(channel)}
                type="button"
              >
                {channel.name}
              </button>
            ))}
          </div>
          <p className="native-line">One message. Four channels. Each one feels native.</p>

          <div className="cprev-grid">
            {PREVIEWS.map(({ channel, label, node }) => (
              <motion.div
                key={channel}
                className="cprev-cell"
                animate={{ opacity: selected.name === channel ? 1 : 0.6, scale: selected.name === channel ? 1 : 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {node}
                <p className="cprev-label">{label}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        .delivery-cinema {
          background:
            radial-gradient(circle at 50% 45%, rgba(196,151,63,0.16), transparent 34%),
            linear-gradient(180deg, ${colours.bgSecondary}, ${colours.bg}) !important;
          overflow: hidden;
        }
        .delivery-title {
          margin: 0 auto 36px;
          max-width: 780px;
          text-align: center;
        }
        .delivery-title .venn-eyebrow { margin-bottom: 20px; }
        .delivery-title h2 {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(46px, 7vw, 82px);
          font-weight: 400;
          line-height: 0.92;
          margin-bottom: 22px;
        }
        .phone-stage {
          align-items: center;
          display: grid;
          grid-template-columns: 1fr 0.72fr;
          margin: 0 auto 34px;
          max-width: 820px;
        }
        .main-phone {
          background: linear-gradient(145deg, #282520, #050504);
          border: 1px solid rgba(255,253,248,0.2);
          border-radius: 44px;
          box-shadow: 0 34px 120px rgba(196,151,63,0.24);
          justify-self: end;
          padding: 13px;
          position: relative;
          width: min(340px, 82vw);
        }
        .main-phone::before {
          background: #050504;
          border-radius: 0 0 18px 18px;
          content: "";
          height: 24px;
          left: 50%;
          position: absolute;
          top: 13px;
          transform: translateX(-50%);
          width: 118px;
          z-index: 2;
        }
        .main-phone::after {
          background: rgba(255,253,248,0.22);
          border-radius: 999px;
          bottom: 20px;
          content: "";
          height: 4px;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 104px;
          z-index: 2;
        }
        .phone-screen {
          background: #070706;
          border-radius: 34px;
          color: ${colours.ivory};
          min-height: 610px;
          overflow: hidden;
          padding: 22px;
          position: relative;
        }
        .phone-status { font-size: 12px; font-weight: 700; margin-bottom: 20px; }
        .chat-head { align-items: center; display: flex; gap: 10px; margin-bottom: 18px; }
        .chat-head span { background: #00E676; border-radius: 50%; height: 26px; width: 26px; }
        .chat-head b, .chat-head small { display: block; font-size: 12px; }
        .chat-head small { color: ${colours.secondary}; }
        .day-pill {
          background: rgba(255,253,248,0.08);
          border-radius: 999px;
          color: ${colours.secondary};
          font-size: 11px;
          margin: 0 auto 12px;
          padding: 5px 12px;
          width: max-content;
        }
        .chat-bubble {
          background: #232220;
          border-radius: 14px;
          color: ${colours.ivory};
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 8px;
          padding: 12px;
          width: 78%;
        }
        .phone-screen a {
          color: #69a7ff;
          display: block;
          font-size: 12px;
          margin-bottom: 12px;
        }
        .message-card {
          background: #171614;
          border: 0.5px solid ${colours.border};
          border-radius: 14px;
          overflow: hidden;
          padding-bottom: 16px;
        }
        .message-image { height: 145px; margin-bottom: 16px; position: relative; }
        .message-card p, .message-card h3, .message-card small, .message-card strong {
          display: block; margin-left: 16px; margin-right: 16px;
        }
        .message-card h3 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 6px;
        }
        .message-card small { color: ${colours.secondary}; font-size: 12px; line-height: 1.5; margin-bottom: 14px; }
        .message-card strong { color: ${colours.gold}; font-size: 12px; font-weight: 500; }
        .phone-input { bottom: 20px; color: ${colours.secondary}; font-size: 28px; left: 22px; position: absolute; }
        .delivery-note { align-items: center; display: flex; gap: 20px; margin-left: 40px; }
        .delivery-note span { color: ${colours.gold}; font-size: 34px; }
        .delivery-note p { color: ${colours.secondary}; font-size: 15px; line-height: 1.7; }

        /* ── Channel pills ── */
        .channel-pills {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin: 0 auto 26px;
          flex-wrap: wrap;
        }
        .channel-pills button {
          background: rgba(255,253,248,0.02);
          border: 0.5px solid ${colours.border};
          border-radius: 999px;
          color: ${colours.ivory};
          cursor: pointer;
          font-size: 15px;
          min-width: 150px;
          padding: 14px 26px;
          white-space: nowrap;
        }
        .channel-pills button.active {
          border-color: ${colours.gold};
          color: ${colours.gold};
          box-shadow: inset 0 0 34px rgba(196,151,63,0.08), 0 0 24px rgba(196,151,63,0.12);
        }
        .native-line { color: ${colours.secondary}; font-size: 15px; margin-bottom: 28px; text-align: center; }

        /* ── 4 channel previews ── */
        .cprev-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, 1fr);
        }
        .cprev-cell { display: flex; flex-direction: column; }
        .cprev-label {
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 12px;
          margin-top: 10px;
          text-align: center;
        }
        .cprev {
          background: #0F0E0B;
          border: 0.5px solid ${colours.border};
          border-radius: 12px;
          flex: 1;
          padding: 14px;
        }
        .cprev-head {
          align-items: center;
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .cprev-avatar {
          border-radius: 50%;
          flex-shrink: 0;
          height: 28px;
          width: 28px;
        }
        .wa-avatar { background: #00E676; }
        .ig-avatar { background: linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7); }
        .li-avatar { background: #0a66c2; }
        .cprev-head-info { min-width: 0; }
        .cprev-name { display: block; font-size: 12px; line-height: 1.2; }
        .cprev-name-sub { color: ${colours.secondary}; font-size: 11px; }
        .cprev-head-info small { color: ${colours.secondary}; display: block; font-size: 10px; margin-top: 1px; }
        .cprev-bubble {
          background: #1A1814;
          border-radius: 8px;
          color: ${colours.ivory};
          font-size: 11px;
          line-height: 1.5;
          margin-bottom: 8px;
          padding: 8px 10px;
        }
        .cprev-link { color: #69a7ff; display: block; font-size: 10px; margin-bottom: 8px; word-break: break-all; }
        .cprev-richcard {
          background: #141210;
          border: 0.5px solid ${colours.border};
          border-radius: 8px;
          margin-bottom: 6px;
          overflow: hidden;
        }
        .cprev-richimg { height: 70px; position: relative; }
        .cprev-richname { color: ${colours.ivory}; font-size: 11px; padding: 6px 8px; }
        .cprev-tick { color: ${colours.secondary}; font-size: 10px; }
        .cprev-email-header {
          border-bottom: 0.5px solid ${colours.border};
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 10px;
          padding-bottom: 8px;
        }
        .cprev-email-header > div { color: ${colours.ivory}; }
        .cprev-field { color: ${colours.secondary}; }
        .cprev-subject { color: ${colours.ivory}; font-weight: 500; font-size: 11px; margin-top: 4px; }

        /* ── Responsive ── */
        @media (max-width: 980px) {
          .phone-stage { grid-template-columns: 1fr; justify-items: center; }
          .main-phone { justify-self: center; }
          .delivery-note { margin: 28px 0 0; }
          .cprev-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .phone-screen { min-height: 560px; }
          .channel-pills {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .channel-pills::-webkit-scrollbar { display: none; }
          .channel-pills button { flex-shrink: 0; min-width: auto; padding: 10px 20px; }
        }
      `}</style>
    </Section>
  );
}

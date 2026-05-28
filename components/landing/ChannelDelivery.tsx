"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Section, colours } from "./system";

const CHANNELS = [
  { name: "WhatsApp", tone: "Personal. Direct. Conversational.", handle: "Momentum Agency", meta: "online" },
  { name: "Instagram", tone: "Visual. Casual. Curiosity-led.", handle: "momentum.agency", meta: "Active now" },
  { name: "Email", tone: "Professional. Clear. Considered.", handle: "Momentum Agency", meta: "A quick note for Glow" },
  { name: "LinkedIn", tone: "Relevant. Professional. Trusted.", handle: "Momentum Agency", meta: "Active now" },
];

function MiniPhone({ channel }: { channel: (typeof CHANNELS)[number] }) {
  return (
    <motion.div
      key={channel.name}
      className="mini-phone"
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mini-top">{channel.name}</div>
      <div className="mini-bubble">Put something together specifically for you —</div>
      <div className="mini-card-preview">
        <Image src="/landing/glow-aesthetics-reception.png" alt="" fill sizes="360px" style={{ objectFit: "cover" }} />
      </div>
      <p>Glow Aesthetics</p>
      <small>Manchester</small>
    </motion.div>
  );
}

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
                    <b>{selected.handle}</b>
                    <small>{selected.meta}</small>
                  </div>
                </div>
                <div className="day-pill">Today</div>
                <div className="chat-bubble">Put something together specifically for you —</div>
                <a>venn.ai/c/glow-aesthetics</a>
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
          <div className="mini-phone-grid">
            <div>
              <MiniPhone channel={selected} />
              <h4>{selected.name}</h4>
              <p>{selected.tone}</p>
            </div>
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
        .phone-status {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .chat-head {
          align-items: center;
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }
        .chat-head span {
          background: ${colours.gold};
          border-radius: 50%;
          height: 26px;
          width: 26px;
        }
        .chat-head b,
        .chat-head small {
          display: block;
          font-size: 12px;
        }
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
        .message-image {
          height: 145px;
          margin-bottom: 16px;
          position: relative;
        }
        .message-card p,
        .message-card h3,
        .message-card small,
        .message-card strong {
          display: block;
          margin-left: 16px;
          margin-right: 16px;
        }
        .message-card h3 {
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 6px;
        }
        .message-card small {
          color: ${colours.secondary};
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 14px;
        }
        .message-card strong {
          color: ${colours.gold};
          font-size: 12px;
          font-weight: 500;
        }
        .phone-input {
          bottom: 20px;
          color: ${colours.secondary};
          font-size: 28px;
          left: 22px;
          position: absolute;
        }
        .delivery-note {
          align-items: center;
          display: flex;
          gap: 20px;
          margin-left: 40px;
        }
        .delivery-note span {
          color: ${colours.gold};
          font-size: 34px;
        }
        .delivery-note p {
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 15px;
          line-height: 1.7;
        }
        .channel-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          justify-content: center;
          margin: 0 auto 26px;
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
        }
        .channel-pills button.active {
          border-color: ${colours.gold};
          color: ${colours.gold};
          box-shadow: inset 0 0 34px rgba(196,151,63,0.08), 0 0 24px rgba(196,151,63,0.12);
        }
        .native-line {
          color: ${colours.secondary};
          font-size: 15px;
          margin-bottom: 28px;
          text-align: center;
        }
        .mini-phone-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(260px, 420px);
          justify-content: center;
        }
        .mini-phone {
          background: rgba(10,9,7,0.72);
          border: 0.5px solid ${colours.border};
          border-radius: 16px;
          min-height: 330px;
          overflow: hidden;
          padding: 14px;
        }
        .mini-top,
        .mini-phone small,
        .mini-phone-grid > div > p {
          color: ${colours.secondary};
          font-size: 12px;
        }
        .mini-bubble {
          background: #242320;
          border-radius: 10px;
          color: ${colours.ivory};
          font-size: 12px;
          line-height: 1.4;
          margin: 14px 0;
          padding: 10px;
        }
        .mini-card-preview {
          border-radius: 10px;
          height: 138px;
          margin-bottom: 12px;
          overflow: hidden;
          position: relative;
        }
        .mini-phone p {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 22px;
        }
        .mini-phone-grid h4 {
          color: ${colours.ivory};
          font-size: 14px;
          margin: 18px 0 8px;
          text-align: center;
        }
        .mini-phone-grid > div > p {
          text-align: center;
        }
        @media (max-width: 980px) {
          .phone-stage {
            grid-template-columns: 1fr;
            justify-items: center;
          }
          .main-phone {
            justify-self: center;
          }
          .delivery-note {
            margin: 28px 0 0;
          }
          .mini-phone-grid { grid-template-columns: minmax(250px, 420px); }
        }
        @media (max-width: 560px) {
          .phone-screen { min-height: 560px; }
          .mini-phone-grid { grid-template-columns: 1fr; }
          .channel-pills button { min-width: 0; width: calc(50% - 9px); }
        }
      `}</style>
    </Section>
  );
}

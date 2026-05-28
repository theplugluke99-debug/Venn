"use client";

import Image from "next/image";
import { Reveal, Section, colours } from "./system";

const CHANNELS = ["WhatsApp", "Instagram", "Email", "LinkedIn"];

function MiniPhone({ channel }: { channel: string }) {
  return (
    <div className="mini-phone">
      <div className="mini-top">{channel}</div>
      <div className="mini-bubble">Put something together specifically for you —</div>
      <div className="mini-card-preview">
        <Image src="/landing/glow-aesthetics-reception.png" alt="" fill sizes="220px" style={{ objectFit: "cover" }} />
      </div>
      <p>Glow Aesthetics</p>
      <small>Manchester</small>
    </div>
  );
}

export function ChannelDelivery() {
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
                    <b>Momentum Agency</b>
                    <small>online</small>
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
            {CHANNELS.map((channel) => <button key={channel}>{channel}</button>)}
          </div>
          <p className="native-line">One message. Four channels. Each one feels native.</p>
          <div className="mini-phone-grid">
            {CHANNELS.map((channel) => (
              <div key={channel}>
                <MiniPhone channel={channel} />
                <h4>{channel}</h4>
                <p>{channel === "WhatsApp" ? "Personal. Direct. Conversational." : channel === "Instagram" ? "Visual. Casual. Curiosity-led." : channel === "Email" ? "Professional. Clear. Considered." : "Relevant. Professional. Trusted."}</p>
              </div>
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
          padding: 12px;
          width: min(340px, 82vw);
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
          font-size: 18px;
          line-height: 1.55;
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
          font-size: 15px;
          min-width: 150px;
          padding: 14px 26px;
        }
        .channel-pills button:first-child {
          border-color: ${colours.gold};
          color: ${colours.gold};
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
          grid-template-columns: repeat(4, 1fr);
        }
        .mini-phone {
          background: rgba(10,9,7,0.72);
          border: 0.5px solid ${colours.border};
          border-radius: 16px;
          min-height: 300px;
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
          height: 100px;
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
          .mini-phone-grid {
            grid-template-columns: repeat(2, 1fr);
          }
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

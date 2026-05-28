"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, VennLogo, colours, motionPresets } from "./system";

const LEADS = [
  ["Glow Aesthetics", "Opened 11 seconds ago", "HOT", "92"],
  ["Revive Beauty", "Viewed 2m ago", "WARM", "74"],
  ["Luxe Aesthetics", "Viewed 15m ago", "COOL", "38"],
];

export function IntelligenceLoop() {
  const [pulse, setPulse] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setPulse((value) => (value + 1) % 3), 1200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <Section id="intelligence" tone="primary" className="loop-cinema">
      <div className="venn-container">
        <Reveal>
          <div className="loop-title">
            <p className="venn-eyebrow">06 / The intelligence loop</p>
            <h2>You know when they&apos;re <em>reading it.</em><br />Before they&apos;ve said a word.</h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="loop-stage">
            <div className="dashboard-ui">
              <aside className="dash-rail">
                {["□", "⌁", "◌", "✉", "⚙"].map((icon, index) => (
                  <span key={icon} className={index === 1 ? "active" : ""}>{icon}</span>
                ))}
              </aside>
              <main>
                <div className="dash-brand">
                  <VennLogo size={38} variant="mark" decorative />
                  <span>Momentum Agency</span>
                </div>
                <h3>Live intelligence <small>• Updating in real time</small></h3>
                <div className="stats-row">
                  <span>All prospects <b>114</b></span>
                  <span>Warm now <b>7</b></span>
                  <span>Viewed today <b>37</b></span>
                  <span>Replied <b>3</b></span>
                </div>
                <div className="lead-list">
                  {LEADS.map(([name, viewed, state, score], index) => (
                    <motion.div
                      key={name}
                      animate={{
                        opacity: index === pulse ? 1 : index === 0 ? 0.92 : 0.64,
                        y: index === pulse ? -2 : 0,
                        scale: index === pulse ? 1.015 : 1,
                      }}
                      transition={motionPresets.soft}
                      className={index === pulse ? "lead-row featured" : "lead-row"}
                    >
                      <div className="avatar">{name.split(" ").map((word) => word[0]).join("")}</div>
                      <div>
                        <strong>{name}</strong>
                        <small>{viewed}</small>
                      </div>
                      <span className={`state ${state.toLowerCase()}`}>{state}</span>
                      <b>{score}<small>/100</small></b>
                    </motion.div>
                  ))}
                </div>
                <p className="dash-foot">Live signals. Real intent. Prioritised for you.</p>
              </main>
            </div>

            <motion.div
              className="bridge-signal"
              aria-hidden
              initial={false}
              animate={reduceMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span />
              <i />
            </motion.div>

            <div className="reader-phone">
              <div className="reader-screen">
                <div className="browser-bar">⌕ venn.ai/c/glow-aesthetics</div>
                <div className="reader-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/venn-logo.svg" alt="Venn" style={{ height: 64, width: "auto", display: "block", marginBottom: 4 }} />
                  <p className="venn-eyebrow">Personalised growth opportunity</p>
                  <h3>Glow Aesthetics</h3>
                  <p>We noticed a few things about your reviews, booking and competitors.</p>
                  <div className="reader-image">
                    <Image src="/landing/glow-aesthetics-reception.png" alt="Glow Aesthetics reception" fill sizes="320px" style={{ objectFit: "cover" }} />
                  </div>
                  <motion.div
                    className="reader-stats"
                    initial={false}
                    animate={reduceMotion ? undefined : { opacity: [0.78, 1, 0.78] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span>Reading time <b>1m 42s</b></span>
                    <span>Scroll depth <b>68%</b></span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <p className="loop-caption">Signals update <em>the moment</em> they act.</p>
        </Reveal>
      </div>

      <style>{`
        .loop-cinema {
          background:
            radial-gradient(circle at 56% 55%, rgba(196,151,63,0.16), transparent 28%),
            ${colours.bg} !important;
          overflow: hidden;
        }
        .loop-title {
          margin: 0 auto 42px;
          max-width: 1100px;
          text-align: center;
        }
        .loop-title .venn-eyebrow { margin-bottom: 18px; }
        .loop-title h2 {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(46px, 6.4vw, 84px);
          font-weight: 400;
          line-height: 0.96;
        }
        .loop-title em {
          color: ${colours.gold};
          font-style: normal;
        }
        .loop-stage {
          align-items: center;
          display: grid;
          gap: 0;
          grid-template-columns: 1.08fr 120px 0.82fr;
        }
        .dashboard-ui {
          background: rgba(8,8,6,0.76);
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 18px;
          box-shadow: 0 30px 120px rgba(0,0,0,0.35);
          display: grid;
          grid-template-columns: 88px 1fr;
          min-height: 610px;
          overflow: hidden;
        }
        .dash-rail {
          align-items: center;
          border-right: 0.5px solid ${colours.border};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 34px 0;
        }
        .dash-rail span {
          align-items: center;
          border-radius: 50%;
          color: ${colours.secondary};
          display: flex;
          font-size: 22px;
          height: 52px;
          justify-content: center;
          width: 52px;
        }
        .dash-rail .active {
          background: rgba(196,151,63,0.14);
          color: ${colours.gold};
        }
        .dashboard-ui main {
          padding: 34px 34px 28px;
        }
        .dash-brand {
          align-items: center;
          border-bottom: 0.5px solid ${colours.border};
          display: flex;
          gap: 12px;
          padding-bottom: 26px;
        }
        .dash-brand span {
          color: ${colours.ivory};
          font-size: 17px;
        }
        .dashboard-ui h3 {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 34px;
          font-weight: 400;
          margin: 28px 0 20px;
        }
        .dashboard-ui h3 small {
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 13px;
        }
        .dashboard-ui h3 small::before {
          animation: pulse-dot 1.8s ease-in-out infinite;
          background: ${colours.gold};
          border-radius: 50%;
          box-shadow: 0 0 18px rgba(196,151,63,0.6);
          content: "";
          display: inline-block;
          height: 7px;
          margin: 0 8px 1px 2px;
          width: 7px;
        }
        .stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 24px;
        }
        .stats-row span {
          color: ${colours.secondary};
          font-size: 13px;
        }
        .stats-row b {
          background: rgba(255,253,248,0.06);
          border-radius: 6px;
          color: ${colours.gold};
          margin-left: 5px;
          padding: 3px 7px;
        }
        .lead-list {
          display: grid;
          gap: 10px;
        }
        .lead-row {
          align-items: center;
          border: 0.5px solid ${colours.border};
          border-radius: 12px;
          display: grid;
          gap: 16px;
          grid-template-columns: 54px 1fr auto 76px;
          padding: 16px;
        }
        .lead-row.featured {
          border-color: ${colours.gold};
          box-shadow: inset 0 0 58px rgba(196,151,63,0.1), 0 0 34px rgba(196,151,63,0.12);
        }
        .avatar {
          align-items: center;
          background: rgba(196,151,63,0.12);
          border-radius: 50%;
          color: ${colours.gold};
          display: flex;
          font-weight: 700;
          height: 48px;
          justify-content: center;
          width: 48px;
        }
        .lead-row strong,
        .lead-row > b {
          color: ${colours.ivory};
          display: block;
          font-size: 16px;
          font-weight: 500;
        }
        .lead-row small {
          color: ${colours.secondary};
          display: block;
          font-size: 12px;
          margin-top: 4px;
        }
        .state {
          border: 0.5px solid ${colours.goldBorder};
          border-radius: 999px;
          color: ${colours.gold};
          font-size: 12px;
          letter-spacing: 0.1em;
          padding: 9px 15px;
        }
        .state.cool {
          border-color: rgba(110,180,220,0.4);
          color: #8ab9d8;
        }
        .dash-foot,
        .loop-caption {
          color: ${colours.secondary};
          font-size: 14px;
          margin-top: 28px;
          text-align: center;
        }
        .bridge-signal {
          align-items: center;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        .bridge-signal::before {
          background: linear-gradient(90deg, transparent, ${colours.gold}, transparent);
          content: "";
          height: 1px;
          position: absolute;
          width: 170px;
        }
        .bridge-signal span {
          animation: pulse-dot 2.4s ease-in-out infinite;
          background: ${colours.gold};
          border-radius: 50%;
          box-shadow: 0 0 34px rgba(196,151,63,0.72);
          height: 58px;
          width: 58px;
        }
        .bridge-signal i {
          animation: bridge-travel 2.8s ease-in-out infinite;
          background: ${colours.gold};
          border-radius: 50%;
          box-shadow: 0 0 18px rgba(196,151,63,0.9);
          height: 8px;
          position: absolute;
          width: 8px;
        }
        @keyframes bridge-travel {
          0% { transform: translateX(-78px); opacity: 0; }
          18% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(78px); opacity: 0; }
        }
        .reader-phone {
          background: linear-gradient(145deg, #2a2824, #050504);
          border: 1px solid rgba(255,253,248,0.24);
          border-radius: 50px;
          box-shadow: 0 34px 120px rgba(0,0,0,0.42);
          padding: 12px;
        }
        .reader-screen {
          background: #080806;
          border-radius: 40px;
          min-height: 650px;
          overflow: hidden;
          padding: 22px;
        }
        .browser-bar {
          background: rgba(255,253,248,0.08);
          border-radius: 999px;
          color: ${colours.ivory};
          font-size: 13px;
          margin-bottom: 28px;
          padding: 12px 16px;
        }
        .reader-card .venn-eyebrow {
          margin: 26px 0 16px;
        }
        .reader-card h3 {
          color: ${colours.ivory};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: 42px;
          font-weight: 400;
        }
        .reader-card > p:not(.venn-eyebrow) {
          color: ${colours.secondary};
          font-size: 15px;
          line-height: 1.5;
          margin: 10px 0 18px;
        }
        .reader-image {
          border-radius: 12px;
          height: 190px;
          overflow: hidden;
          position: relative;
        }
        .reader-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
          margin-top: 18px;
        }
        .reader-stats span {
          color: ${colours.secondary};
          font-size: 12px;
        }
        .reader-stats b {
          color: ${colours.ivory};
          display: block;
          font-size: 15px;
          margin-top: 6px;
        }
        .loop-caption em {
          color: ${colours.gold};
          font-style: normal;
        }
        @media (max-width: 1080px) {
          .loop-stage {
            gap: 28px;
            grid-template-columns: 1fr;
          }
          .bridge-signal {
            height: 70px;
            transform: rotate(90deg);
          }
          .reader-phone {
            margin: 0 auto;
            max-width: 420px;
            width: 100%;
          }
        }
        @media (max-width: 640px) {
          .dashboard-ui {
            grid-template-columns: 1fr;
          }
          .dash-rail {
            display: none;
          }
          .dashboard-ui main {
            padding: 22px;
          }
          .lead-row {
            grid-template-columns: 42px 1fr;
          }
          .lead-row .state,
          .lead-row > b {
            grid-column: 2;
          }
          .reader-screen {
            min-height: 560px;
          }
        }
      `}</style>
    </Section>
  );
}

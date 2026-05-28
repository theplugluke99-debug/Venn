"use client";

import Image from "next/image";
import { Reveal, Section, colours } from "./system";

const LINES = [
  "Every feature exists because I felt the problem firsthand.",
  "The empty leads.",
  "The paywalls.",
  "The scripts I didn’t believe in.",
  "The tools that promised everything and delivered excuses.",
  "I use Venn every day to sell my own software.",
  "It works because it has to — not because I built it to look like it works.",
  "That’s not a marketing line. It’s just true.",
];

export function Founder() {
  return (
    <Section id="founder" tone="primary" style={{ borderTop: `0.5px solid ${colours.border}` }}>
      <div className="venn-container-narrow">
        <Reveal>
          <div className="founder-intro" style={{ alignItems: "center", display: "flex", gap: 28, marginBottom: 50 }}>
            <div style={{ border: `0.5px solid ${colours.goldBorder}`, borderRadius: "50%", boxShadow: "0 0 44px rgba(196,151,63,0.12)", height: 148, overflow: "hidden", position: "relative", width: 148 }}>
              <Image src="/founder-headshot.png" alt="Luke S., founder of Venn" fill sizes="148px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p className="venn-eyebrow" style={{ marginBottom: 8 }}>From the founder</p>
              <p style={{ color: colours.secondary, fontSize: 13 }}>Luke S.</p>
            </div>
          </div>

          <h2 className="venn-heading-md" style={{ marginBottom: 38 }}>
            I built Venn
            <br />
            because I needed it.
          </h2>

          <div style={{ display: "grid", gap: 18, maxWidth: 600 }}>
            {LINES.map((line) => (
              <p key={line} className="venn-copy" style={{ fontSize: 17, lineHeight: 1.75 }}>
                {line}
              </p>
            ))}
            <p style={{ color: colours.ivory, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 26, marginTop: 16 }}>
              — Luke
            </p>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 560px) {
          .founder-intro {
            align-items: flex-start !important;
            flex-direction: column;
          }
        }
      `}</style>
    </Section>
  );
}

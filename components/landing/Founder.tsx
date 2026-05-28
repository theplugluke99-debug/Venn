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
          <div style={{ alignItems: "center", display: "flex", gap: 18, marginBottom: 44 }}>
            <div style={{ border: `0.5px solid ${colours.border}`, borderRadius: "50%", height: 72, overflow: "hidden", position: "relative", width: 72 }}>
              <Image src="/founder-headshot.png" alt="Luke K., founder of Venn" fill sizes="72px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p className="venn-eyebrow" style={{ marginBottom: 8 }}>From the founder</p>
              <p style={{ color: colours.secondary, fontSize: 13 }}>Luke K.</p>
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
    </Section>
  );
}

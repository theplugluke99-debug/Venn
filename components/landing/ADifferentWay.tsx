"use client";

import { Reveal, Section, colours } from "./system";

export function ADifferentWay() {
  return (
    <Section id="different" tone="secondary" className="manifesto-section">
      <div className="venn-container-narrow">
        <Reveal>
          <p className="venn-eyebrow" style={{ marginBottom: 42 }}>Manifesto</p>
          <h2
            style={{
              color: colours.ivory,
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: "clamp(44px, 7vw, 82px)",
              fontWeight: 400,
              lineHeight: 0.98,
              marginBottom: "clamp(56px, 8vw, 92px)",
            }}
          >
            The world is tired
            <br />
            of being sold to.
            <br />
            So are you.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="manifesto-copy" style={{ display: "grid", gap: 26, maxWidth: 620 }}>
            {[
              "You already know what modern outreach feels like. The scripts. The pressure. The automation pretending to be conversation.",
              "Most people stopped trusting sales a long time ago. Not because they hate buying things. Because too much of what reaches them feels designed rather than real.",
              "The trust ran out.",
              "Venn starts from a different place. Real context. Real attention. Something built from the reality of a business — not a template pretending to understand it.",
              "Not pressure. Not urgency. Just the feeling that someone actually looked.",
            ].map((line) => (
              <p key={line} className="venn-copy" style={{ fontSize: "clamp(17px, 2vw, 21px)", lineHeight: 1.78 }}>
                {line}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p
            style={{
              color: colours.ivory,
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              lineHeight: 1.08,
              marginTop: "clamp(70px, 10vw, 118px)",
              maxWidth: 640,
            }}
          >
            Real attention is the rarest thing in the world right now.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

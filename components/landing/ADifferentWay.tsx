"use client";

import { Reveal, Section, colours } from "./system";

export function ADifferentWay() {
  return (
    <Section id="different" tone="secondary" className="manifesto-section" style={{ overflow: "hidden" }}>
      <div className="venn-container-narrow" style={{ position: "relative" }}>
        <Reveal>
          <p className="venn-eyebrow" style={{ marginBottom: 34, textAlign: "center" }}>07 / A different way</p>
          <h2
            style={{
              color: colours.ivory,
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: "clamp(48px, 6.8vw, 92px)",
              fontWeight: 400,
              lineHeight: 0.9,
              margin: "0 auto clamp(50px, 7vw, 78px)",
              maxWidth: 980,
              textAlign: "center",
            }}
          >
            The world is tired
            <br />
            of being sold to.
            <br />
            <em style={{ color: colours.gold, fontStyle: "italic" }}>So are you.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="manifesto-copy">
            <p>You already know what modern outreach feels like.<br />The scripts.<br />The pressure.<br />The automation pretending to be conversation.</p>
            <span />
            <p>Most people stopped trusting sales a long time ago.<br />Not because they hate buying things.<br />Because too much of what reaches them<br />feels designed rather than real.</p>
            <span />
            <strong>The trust ran out.</strong>
            <span />
            <p>Venn starts from a different place.<br />Real context. Real attention.<br />Something built from the reality of a business —<br />not a template pretending to understand it.</p>
            <span />
            <p>Not pressure.<br />Not urgency.<br /><em>Just the feeling that someone actually looked.</em></p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p
            style={{
              color: colours.ivory,
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontStyle: "italic",
              lineHeight: 1.08,
              marginTop: "clamp(70px, 10vw, 118px)",
              textAlign: "center",
            }}
          >
            Real attention is the rarest thing in the world right now.
          </p>
        </Reveal>
      </div>
      <style>{`
        .manifesto-section {
          background:
            radial-gradient(circle at 50% 15%, rgba(196,151,63,0.10), transparent 34%),
            ${colours.bgSecondary} !important;
        }
        .manifesto-copy {
          display: grid;
          gap: 18px;
          margin: 0 auto;
          max-width: 590px;
        }
        .manifesto-copy p,
        .manifesto-copy strong {
          color: ${colours.secondary};
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: clamp(14px, 1.35vw, 16px);
          font-weight: 400;
          line-height: 1.9;
        }
        .manifesto-copy strong,
        .manifesto-copy em {
          color: ${colours.gold};
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-size: clamp(22px, 2.4vw, 28px);
          font-style: normal;
          line-height: 1.15;
        }
        .manifesto-copy span {
          background: ${colours.gold};
          display: block;
          height: 1px;
          opacity: 0.6;
          width: 24px;
        }
        @media (max-width: 620px) {
          .manifesto-copy p br { display: none; }
        }
      `}</style>
    </Section>
  );
}

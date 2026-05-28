"use client";

import { Reveal, Section, SectionHeader, colours } from "./system";

const OBSERVATIONS = [
  {
    title: "Wait times are the visible leak",
    quote: "Lovely clinic but had to wait nearly 30 minutes past my appointment time.",
    note: "6 mentions this month",
  },
  {
    title: "Mobile booking breaks momentum",
    quote: "The booking link doesn't work on my phone, had to try on my laptop later.",
    note: "Repeated in recent reviews",
  },
  {
    title: "The service is strong",
    quote: "Amazing results as always, my skin has never looked better!",
    note: "Trust exists. Follow-up is the gap.",
  },
];

export function CardExperience() {
  return (
    <Section tone="ivory" className="prospect-section">
      <div className="venn-container-narrow">
        <SectionHeader
          dark={false}
          eyebrow="The prospect card"
          title={
            <>
              It feels like
              <br />
              someone looked.
            </>
          }
          subline="A quiet document built from evidence, not a dashboard export."
        />

        <Reveal>
          <article
            className="prospect-card"
            style={{
              background: "#FFFDF8",
              border: "0.5px solid #E7E0D2",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgba(10,9,7,0.12)",
              color: colours.bg,
              overflow: "hidden",
            }}
          >
            <header style={{ borderBottom: "0.5px solid #E7E0D2", padding: "34px 38px 28px" }}>
              <div style={{ alignItems: "flex-start", display: "flex", gap: 18, justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <p style={{ color: "#B8872E", fontSize: 11, letterSpacing: "0.14em", marginBottom: 12, textTransform: "uppercase" }}>
                    Private analysis
                  </p>
                  <h3 style={{ color: colours.bg, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: "clamp(34px, 6vw, 52px)", fontWeight: 400, lineHeight: 0.98 }}>
                    Glow Aesthetics
                  </h3>
                </div>
                <span
                  style={{
                    border: "0.5px solid rgba(196,151,63,0.36)",
                    borderRadius: 999,
                    color: "#8A661E",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    padding: "7px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  HIGH INTENT
                </span>
              </div>
              <p style={{ color: "#77716A", fontSize: 13 }}>Manchester · Aesthetic Clinic · 4.1 from 87 reviews</p>
            </header>

            <section style={{ display: "grid", gap: 0 }}>
              {OBSERVATIONS.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    borderBottom: "0.5px solid #E7E0D2",
                    display: "grid",
                    gap: 22,
                    gridTemplateColumns: "120px 1fr",
                    padding: "28px 38px",
                  }}
                  className="analysis-row"
                >
                  <div>
                    <span style={{ color: "#B8872E", fontSize: 11, letterSpacing: "0.14em" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: colours.bg, fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</p>
                    <p style={{ color: "#5F5A54", fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 22, lineHeight: 1.45, marginBottom: 10 }}>
                      “{item.quote}”
                    </p>
                    <p style={{ color: "#8A837B", fontSize: 12 }}>{item.note}</p>
                  </div>
                </div>
              ))}
            </section>

            <section style={{ background: "#F7F1E6", borderBottom: "0.5px solid #E7E0D2", padding: "32px 38px" }}>
              <p style={{ color: "#B8872E", fontSize: 11, letterSpacing: "0.14em", marginBottom: 16, textTransform: "uppercase" }}>Estimated opportunity</p>
              <div style={{ alignItems: "baseline", display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
                <span style={{ color: colours.bg, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 54, lineHeight: 0.9 }}>
                  £2,400
                </span>
                <span style={{ color: "#77716A", fontSize: 14 }}>/month left on the table</span>
              </div>
            </section>

            <section style={{ padding: "32px 38px" }}>
              <p style={{ color: "#B8872E", fontSize: 11, letterSpacing: "0.14em", marginBottom: 18, textTransform: "uppercase" }}>
                What I&apos;d say
              </p>
              <p style={{ color: "#3A332C", fontSize: 15, lineHeight: 1.8, marginBottom: 22 }}>
                I spent 14 minutes here. Your reviews are strong, but the same operational issue keeps showing up:
                clients like the outcome and remember the wait. That is the kind of problem that can be fixed without changing the offer.
              </p>
              <p style={{ color: "#77716A", fontSize: 13, marginBottom: 24 }}>— Luke K.</p>
              <a className="venn-cta venn-cta-primary" href="#" onClick={(event) => event.preventDefault()}>
                Reply to Luke K.
              </a>
            </section>
          </article>
        </Reveal>
      </div>

      <style>{`
        .prospect-section .venn-eyebrow { color: #B8872E; }
        @media (max-width: 640px) {
          .prospect-card header,
          .prospect-card section,
          .analysis-row { padding-left: 22px !important; padding-right: 22px !important; }
          .analysis-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </Section>
  );
}

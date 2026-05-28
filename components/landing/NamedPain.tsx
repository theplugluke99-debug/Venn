"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Section, SectionHeader, colours } from "./system";

const TRUTHS = [
  "Apollo gives you a database. You do the thinking.",
  "Clay enriches your data. You still write every word.",
  "Templates get ignored. Prospects always know.",
];

function TruthRow({
  truth,
  index,
  progress,
  reduceMotion,
}: {
  truth: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduceMotion: boolean | null;
}) {
  const ranges: number[][] = [
    [0, 0.18, 0.32],
    [0.32, 0.48, 0.64],
    [0.64, 0.8, 1],
  ];
  const opacity = useTransform(progress, ranges[index], [0.26, 1, index === 2 ? 1 : 0.26]);

  return (
    <motion.div
      style={{
        opacity: reduceMotion ? 1 : opacity,
        borderTop: `0.5px solid ${index === 0 ? colours.goldBorder : colours.border}`,
        padding: "26px 0 8px",
      }}
    >
      <div style={{ alignItems: "flex-start", display: "grid", gap: 20, gridTemplateColumns: "36px 1fr" }}>
        <span style={{ color: colours.muted, fontSize: 12, paddingTop: 9 }}>{String(index + 1).padStart(2, "0")}</span>
        <p
          style={{
            color: colours.ivory,
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(31px, 4.2vw, 50px)",
            lineHeight: 1.05,
          }}
        >
          {truth}
        </p>
      </div>
    </motion.div>
  );
}

function StickyTruths() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.72", "end 0.42"],
  });

  return (
    <div ref={ref} className="truths-wrap" style={{ height: "154vh", position: "relative" }}>
      <div
        style={{
          display: "grid",
          gap: 18,
          margin: "0 auto",
          maxWidth: 860,
          minHeight: "72vh",
          placeContent: "center",
          position: "sticky",
          top: 64,
        }}
      >
        {TRUTHS.map((truth, index) => {
          return (
            <TruthRow key={truth} truth={truth} index={index} progress={scrollYProgress} reduceMotion={reduceMotion} />
          );
        })}
      </div>
    </div>
  );
}

export function NamedPain() {
  return (
    <Section id="how-it-works" tone="secondary" tight>
      <div className="venn-container">
        <SectionHeader
          eyebrow="02 / The named pain"
          title={
            <>
              Outreach is broken.
              <br />
              <em>You already know.</em>
            </>
          }
        />

        <div className="truths-desktop">
          <StickyTruths />
        </div>

        <div className="truths-mobile" style={{ display: "none", gap: 34 }}>
          {TRUTHS.map((truth, index) => (
            <Reveal key={truth} delay={index * 0.08}>
              <div style={{ borderTop: `0.5px solid ${index === 0 ? colours.goldBorder : colours.border}`, paddingTop: 22 }}>
                <span style={{ color: colours.muted, display: "block", fontSize: 12, marginBottom: 12 }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p style={{ color: colours.ivory, fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 32, lineHeight: 1.08 }}>
                  {truth}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .truths-desktop { display: none; }
          .truths-mobile { display: grid !important; }
        }
      `}</style>
    </Section>
  );
}

"use client";

import { ReactNode } from "react";
import { Reveal, Section, SectionHeader, VennLogo, colours } from "./system";

function Check() {
  return <span aria-label="Yes" style={{ color: colours.gold }}>✓</span>;
}

function Cross() {
  return <span aria-label="No" style={{ color: colours.muted }}>—</span>;
}

function Partial({ children }: { children: ReactNode }) {
  return <span style={{ color: colours.secondary, fontSize: 12 }}>{children}</span>;
}

const ROWS = [
  { feature: "Find businesses in real time", venn: <Check />, apollo: <Partial>Static database</Partial>, clay: <Partial>Via enrichment</Partial>, rooms: <Cross /> },
  { feature: "Analyse Google reviews", venn: <Check />, apollo: <Cross />, clay: <Cross />, rooms: <Cross /> },
  { feature: "Score intent automatically", venn: <Check />, apollo: <Cross />, clay: <Partial>Manual setup</Partial>, rooms: <Cross /> },
  { feature: "Generate opening line", venn: <Check />, apollo: <Cross />, clay: <Partial>Template logic</Partial>, rooms: <Cross /> },
  { feature: "Create a private prospect card", venn: <Check />, apollo: <Cross />, clay: <Cross />, rooms: <Partial>Manual build</Partial> },
  { feature: "Works without spreadsheets", venn: <Check />, apollo: <Cross />, clay: <Cross />, rooms: <Partial>After setup</Partial> },
];

const COLS = [
  { key: "venn", label: "Venn" },
  { key: "apollo", label: "Apollo" },
  { key: "clay", label: "Clay" },
  { key: "rooms", label: "Sales rooms" },
] as const;

export function Comparison() {
  return (
    <Section id="compare" tone="primary" className="comparison-cinema">
      <div className="venn-container">
        <SectionHeader
          eyebrow="Comparison"
          title={
            <>
              Different tools.
              <br />
              Different jobs.
            </>
          }
          subline="Apollo and Clay are useful infrastructure. Venn is the intelligence layer that decides what is worth saying."
        />

        <Reveal>
          <div className="comparison-table" style={{ border: `0.5px solid ${colours.goldBorder}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 100px rgba(196,151,63,0.10)" }}>
            <table style={{ borderCollapse: "collapse", minWidth: 720, width: "100%" }}>
              <thead>
                <tr style={{ background: colours.bgSecondary }}>
                  <th style={{ color: colours.muted, fontSize: 12, fontWeight: 400, padding: "20px 22px", textAlign: "left", width: "38%" }}>Capability</th>
                  {COLS.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        background: col.key === "venn" ? "rgba(196,151,63,0.08)" : "transparent",
                        color: col.key === "venn" ? colours.gold : colours.secondary,
                        fontSize: 12,
                        fontWeight: col.key === "venn" ? 600 : 400,
                        padding: "20px 14px",
                        textAlign: "center",
                      }}
                    >
                      {col.key === "venn" ? <VennLogo variant="wordmark" size={28} /> : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.feature} style={{ borderTop: `0.5px solid ${colours.border}` }}>
                    <td style={{ color: colours.secondary, fontSize: 13, lineHeight: 1.45, padding: "18px 22px" }}>{row.feature}</td>
                    {COLS.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          background: col.key === "venn" ? "rgba(196,151,63,0.045)" : "transparent",
                          fontSize: 15,
                          padding: "18px 14px",
                          textAlign: "center",
                        }}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>

      <style>{`
        .comparison-cinema {
          background:
            radial-gradient(circle at 50% 45%, rgba(196,151,63,0.12), transparent 32%),
            ${colours.bg} !important;
        }
        @media (max-width: 760px) {
          .comparison-table { overflow-x: auto !important; }
        }
      `}</style>
    </Section>
  );
}

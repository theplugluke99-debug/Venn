import { ReactNode } from "react";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Yes">
      <circle cx="8" cy="8" r="7.5" stroke="#4CAF50" strokeWidth="0.5" />
      <path d="M5 8l2 2 4-4" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="No">
      <circle cx="8" cy="8" r="7.5" stroke="#2A2826" strokeWidth="0.5" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="#444440" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Partial({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 11, color: "#888580", fontStyle: "italic" }}>{label}</span>
  );
}

const ROWS: Array<{
  feature: string;
  venn: ReactNode;
  apollo: ReactNode;
  clay: ReactNode;
  rooms: ReactNode;
}> = [
  {
    feature: "Find businesses in real time",
    venn: <Check />,
    apollo: <Partial label="static DB" />,
    clay: <Partial label="via enrichment" />,
    rooms: <Cross />,
  },
  {
    feature: "Analyse Google Reviews",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Cross />,
    rooms: <Cross />,
  },
  {
    feature: "Score intent automatically",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Partial label="manual setup" />,
    rooms: <Cross />,
  },
  {
    feature: "Generate personalised opening line",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Partial label="template-based" />,
    rooms: <Cross />,
  },
  {
    feature: "Digital prospect card with unique URL",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Cross />,
    rooms: <Partial label="manual, $750/mo" />,
  },
  {
    feature: "Revenue loss estimate",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Cross />,
    rooms: <Cross />,
  },
  {
    feature: "No spreadsheets required",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Cross />,
    rooms: <Check />,
  },
  {
    feature: "Works in 60 seconds per prospect",
    venn: <Check />,
    apollo: <Cross />,
    clay: <Cross />,
    rooms: <Cross />,
  },
];

const COLS = [
  { key: "venn", label: "Venn", highlight: true },
  { key: "apollo", label: "Apollo", highlight: false },
  { key: "clay", label: "Clay", highlight: false },
  { key: "rooms", label: "Sales rooms", highlight: false },
];

export function Comparison() {
  return (
    <section
      id="compare"
      style={{
        background: "#0A0907",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Honest comparison
        </p>
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 60,
            lineHeight: 1.1,
          }}
        >
          Different tools.
          <br />
          Different jobs.
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: "0 0 20px",
                    textAlign: "left",
                    fontSize: 12,
                    color: "#444440",
                    fontWeight: 400,
                    width: "40%",
                  }}
                >
                  Feature
                </th>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "0 0 20px",
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: col.highlight ? 600 : 400,
                      color: col.highlight ? "#C4973F" : "#444440",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i} style={{ borderTop: "0.5px solid #1E1C18" }}>
                  <td
                    style={{
                      padding: "16px 0",
                      fontSize: 13,
                      color: "#888580",
                      lineHeight: 1.4,
                    }}
                  >
                    {row.feature}
                  </td>
                  {COLS.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "16px 0",
                        textAlign: "center",
                        background: col.highlight ? "rgba(196, 151, 63, 0.04)" : "transparent",
                      }}
                    >
                      {row[col.key as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#444440",
            textAlign: "center",
            marginTop: 32,
            lineHeight: 1.6,
          }}
        >
          Apollo and Clay are good tools for what they do.
          <br />
          Venn does something different.
        </p>
      </div>
    </section>
  );
}

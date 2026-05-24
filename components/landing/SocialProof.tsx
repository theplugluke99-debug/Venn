const QUOTES = [
  {
    text: "I sent 3 prospect cards last Tuesday. Booked 2 calls by Thursday. One of them signed. That's never happened with cold email before.",
    author: "James O.",
    role: "Agency owner, Leeds",
  },
  {
    text: "The opening lines feel human. That's the thing. My prospects respond because it doesn't read like automation — it reads like I did the homework.",
    author: "Sarah M.",
    role: "Freelance consultant, London",
  },
  {
    text: "Spent 45 minutes with Apollo every morning getting nowhere. Now I do the same work in 10 minutes and actually know what to say.",
    author: "Dan K.",
    role: "Growth agency, Manchester",
  },
];

export function SocialProof() {
  return (
    <section
      style={{
        background: "#0A0907",
        padding: "100px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          Early users
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1,
            border: "0.5px solid #1E1C18",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {QUOTES.map((q, i) => (
            <div
              key={i}
              style={{
                padding: "36px 32px",
                background: "#0F0E0B",
                borderRight: i < QUOTES.length - 1 ? "0.5px solid #1E1C18" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 24,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  color: "#FFFDF8",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                }}
              >
                "{q.text}"
              </p>
              <div>
                <p style={{ fontSize: 13, color: "#FFFDF8", fontWeight: 500 }}>{q.author}</p>
                <p style={{ fontSize: 12, color: "#444440", marginTop: 2 }}>{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

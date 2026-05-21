export const metadata = { title: "Outreach — Venn" };

export default function OutreachPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div
        className="mb-5 flex items-center justify-center"
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: "#C4973F10",
          border: "0.5px solid #C4973F30",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 14L21 3M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3Z" />
        </svg>
      </div>
      <p
        className="mb-2"
        style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
      >
        Outreach tracking
      </p>
      <p
        style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", lineHeight: 1.5, maxWidth: 280 }}
      >
        Track replies, follow-ups, and conversion rates across your prospect cards. Coming soon.
      </p>
    </div>
  );
}

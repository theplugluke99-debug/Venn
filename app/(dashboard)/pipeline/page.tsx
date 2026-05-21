export const metadata = { title: "Pipeline — Venn" };

export default function PipelinePage() {
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
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      </div>
      <p
        className="mb-2"
        style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
      >
        Pipeline analytics
      </p>
      <p
        style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", lineHeight: 1.5, maxWidth: 280 }}
      >
        Visualise your conversion funnel, intent distribution, and revenue pipeline. Coming soon.
      </p>
    </div>
  );
}

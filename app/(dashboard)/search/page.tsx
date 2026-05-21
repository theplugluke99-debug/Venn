import { SearchForm } from "@/components/leads/SearchForm";

export const metadata = { title: "Search — Venn" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; location?: string; autostart?: string }>;
}) {
  const params = await searchParams;
  const initialNiche = typeof params.niche === "string" ? params.niche : "";
  const initialLocation = typeof params.location === "string" ? params.location : "";
  const autostart = params.autostart === "1" && !!initialNiche && !!initialLocation;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-lg text-center mb-10">
        <h1
          className="mb-3"
          style={{
            fontSize: 32,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          {autostart ? "Finding your leads…" : "Find your next clients"}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#555250",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {autostart
            ? `Searching for ${initialNiche} in ${initialLocation}`
            : "Enter a niche and location. Venn finds and scores every matching business in real time."}
        </p>
      </div>

      <SearchForm
        initialNiche={initialNiche}
        initialLocation={initialLocation}
        autostart={autostart}
      />
    </div>
  );
}

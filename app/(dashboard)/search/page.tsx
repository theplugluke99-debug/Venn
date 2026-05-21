import { SearchForm } from "@/components/leads/SearchForm";

export const metadata = { title: "New Search — Venn" };

export default function SearchPage() {
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
          Find your next clients
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#555250",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          Enter a business name, niche and location. Venn does the rest.
        </p>
      </div>

      <SearchForm />
    </div>
  );
}

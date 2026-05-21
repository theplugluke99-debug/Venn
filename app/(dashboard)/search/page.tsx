import { SearchForm } from "@/components/leads/SearchForm";

export const metadata = { title: "New Search — Venn" };

export default function SearchPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-3">
          Prospect Research
        </p>
        <h1 className="text-[2.25rem] leading-tight font-serif text-[#FFFDF8] mb-3">
          Research a business.
        </h1>
        <p className="text-sm text-[#555] leading-relaxed">
          Enter a business name and location. We'll pull their Google data, audit
          their website, and generate a complete AI intelligence profile in about
          60 seconds.
        </p>
      </div>

      <SearchForm />
    </div>
  );
}

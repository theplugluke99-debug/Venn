import { SearchForm } from "@/components/leads/SearchForm";

export const metadata = {
  title: "Search — Venn",
};

export default function SearchPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2">
          Research a Prospect
        </h1>
        <p className="text-[#555] text-sm leading-relaxed">
          Enter a business and we&apos;ll pull their Google data, audit their website,
          and build a full intelligence profile using AI.
        </p>
      </div>
      <SearchForm />
    </div>
  );
}

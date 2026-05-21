import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCardsByUser } from "@/lib/db/queries/cards";

export const metadata = { title: "Cards — Venn" };

export default async function CardsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const cards = await getCardsByUser(user.id);

  if (cards.length === 0) {
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
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20M7 15h2M14 15h3" />
          </svg>
        </div>
        <p
          className="mb-2"
          style={{ fontSize: 20, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
        >
          No cards sent yet
        </p>
        <p
          className="mb-6 max-w-xs"
          style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}
        >
          Generate your first prospect card from any lead profile
        </p>
        <Link
          href="/leads"
          className="px-4 py-2 rounded transition-opacity hover:opacity-90"
          style={{
            background: "#C4973F",
            color: "#0A0907",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Go to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1
        className="mb-6"
        style={{ fontSize: 28, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
      >
        Prospect Cards
      </h1>
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
                {card.lead?.businessName ?? "Card"}
              </p>
              <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginTop: 2 }}>
                {card.viewCount} view{card.viewCount !== 1 ? "s" : ""} ·{" "}
                {new Date(card.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </div>
            <Link
              href={`/card/${card.slug}`}
              target="_blank"
              style={{
                fontSize: 12,
                color: "#C4973F",
                fontFamily: "var(--font-inter)",
                textDecoration: "none",
              }}
            >
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getCardById } from "@/lib/db/queries/cards";
import { DeliverClient } from "./DeliverClient";

export const metadata = { title: "Deliver Card — Venn" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export default async function DeliverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const card = await getCardById(id);
  if (!card || card.userId !== user.id) notFound();

  const cardUrl = `${BASE_URL}/card/${card.slug}`;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link
            href="/cards"
            style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}
          >
            ← Cards
          </Link>
          <span style={{ color: "#1E1C18" }}>/</span>
          <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>
            Deliver
          </span>
        </div>
        <h1
          style={{
            fontSize: 24,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Deliver to {card.lead.businessName}
        </h1>
        <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 6 }}>
          Choose your channel. Every message is ready to send.
        </p>
      </div>

      <DeliverClient
        cardId={id}
        cardSlug={card.slug}
        cardUrl={cardUrl}
        businessName={card.lead.businessName}
        niche={card.lead.niche}
        location={card.lead.location}
        intentScore={card.lead.intentScore}
        phone={card.lead.phone ?? null}
        instagramHandle={card.lead.instagramHandle ?? null}
        deliveryMessages={(card.deliveryMessages as Record<string, string>) ?? null}
        personalNote={card.personalNote ?? null}
      />
    </div>
  );
}

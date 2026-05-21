import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SubscribePage } from "./SubscribePage";

export const metadata: Metadata = { title: "Choose your plan — Venn" };

export default async function Subscribe() {
  const { userId } = await auth();
  const isAuthed = !!userId;

  const starterPriceId = process.env.STRIPE_STARTER_PRICE_ID ?? null;
  const growthPriceId = process.env.STRIPE_GROWTH_PRICE_ID ?? null;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID ?? null;

  return (
    <SubscribePage
      isAuthed={isAuthed}
      starterPriceId={starterPriceId}
      growthPriceId={growthPriceId}
      proPriceId={proPriceId}
    />
  );
}

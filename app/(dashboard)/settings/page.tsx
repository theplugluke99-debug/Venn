import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, getCardIdentity } from "@/lib/db/queries/users";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings — Venn" };

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const identity = await getCardIdentity(user.id);

  return (
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="text-[11px] text-[#444] uppercase tracking-[0.1em] font-medium mb-3">
          Configuration
        </p>
        <h1 className="text-[2.25rem] leading-tight font-serif text-[#FFFDF8] mb-3">
          Card identity.
        </h1>
        <p className="text-sm text-[#555] leading-relaxed">
          This shapes how your prospect cards are written and presented. Claude
          uses this to write in your voice — every opening line, every card.
        </p>
      </div>
      <SettingsForm initialData={identity} />
    </div>
  );
}

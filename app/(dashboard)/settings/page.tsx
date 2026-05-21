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
  const plan = user.subscription?.plan ?? "starter";

  return (
    <div>
      <div className="mb-8">
        <h1
          className="mb-2"
          style={{
            fontSize: 28,
            color: "#FFFDF8",
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#555250",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          Card identity shapes how your prospect cards are written. Claude uses this to match your voice.
        </p>
      </div>
      <SettingsForm initialData={identity} plan={plan} />
    </div>
  );
}

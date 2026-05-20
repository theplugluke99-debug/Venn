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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2">
          Card Identity
        </h1>
        <p className="text-[#555] text-sm leading-relaxed">
          This shapes how your prospect cards look and how Claude writes for you.
          Every card, every outreach line — written in your voice.
        </p>
      </div>
      <SettingsForm initialData={identity} />
    </div>
  );
}

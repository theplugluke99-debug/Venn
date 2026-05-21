import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getLeadCountByUser } from "@/lib/db/queries/leads";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = { title: "Welcome to Venn" };

export default async function WelcomePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // If they've already completed onboarding, send to dashboard
  const jar = await cookies();
  if (jar.get("venn_onboarded")?.value === "1") {
    redirect("/");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  // If they have an agency name AND leads, they're onboarded
  const hasIdentity = !!(user.cardIdentity?.agencyName);
  const leadCount = await getLeadCountByUser(user.id);
  if (hasIdentity && leadCount > 0) redirect("/");

  return (
    <OnboardingFlow
      userName={user.name?.split(" ")[0] ?? null}
      existingIdentity={
        user.cardIdentity
          ? {
              agencyName: user.cardIdentity.agencyName ?? "",
              writingStyle: user.cardIdentity.writingStyle ?? "",
              defaultAngle: user.cardIdentity.defaultAngle,
            }
          : null
      }
    />
  );
}

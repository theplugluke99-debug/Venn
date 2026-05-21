import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertUser } from "@/lib/db/queries/users";
import { SidebarNav } from "./SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await currentUser();
  let userName: string | undefined;
  let userEmail: string | undefined;

  if (user) {
    await upsertUser({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: user.fullName ?? undefined,
    });
    userName = user.firstName ?? user.fullName?.split(" ")[0] ?? undefined;
    userEmail = user.emailAddresses[0]?.emailAddress;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0907]">
      <aside className="fixed inset-y-0 left-0 w-[220px] flex flex-col bg-[#0A0907] border-r border-[#131210] z-20">
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-[#131210] shrink-0">
          <div
            className="w-[28px] h-[28px] rounded flex items-center justify-center shrink-0"
            style={{ background: "#C4973F" }}
          >
            <span
              className="text-[#0A0907] font-bold text-[13px] leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              V
            </span>
          </div>
          <span className="text-[#FFFDF8] text-sm font-semibold tracking-tight">
            venn
          </span>
        </div>

        <SidebarNav userName={userName} userEmail={userEmail} />
      </aside>

      <main className="ml-[220px] flex-1 overflow-y-auto">
        <div className="px-8 py-10 min-h-screen">{children}</div>
      </main>
    </div>
  );
}

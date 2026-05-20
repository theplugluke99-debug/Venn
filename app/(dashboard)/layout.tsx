import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { upsertUser } from "@/lib/db/queries/users";

async function DashboardNav() {
  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/search", label: "Search" },
    { href: "/leads", label: "Leads" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1814] bg-[#0A0907]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            <span className="text-[#C4973F]">venn</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-[#888] hover:text-[#FFFDF8] transition-colors rounded hover:bg-[#1A1814]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (user) {
    await upsertUser({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: user.fullName ?? undefined,
    });
  }

  return (
    <div className="min-h-screen bg-[#0A0907]">
      <DashboardNav />
      <main className="pt-14 max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

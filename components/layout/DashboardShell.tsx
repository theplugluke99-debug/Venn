"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "./DashboardProvider";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { RightPanel } from "./RightPanel";

interface IntentCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface ActivityItem {
  type: "reply" | "card_sent" | "card_viewed" | "lead_added";
  text: string;
  timestamp: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  userName?: string;
  userInitials: string;
  counts: IntentCounts;
  activity: ActivityItem[];
}

export function DashboardShell({
  children,
  userName,
  userInitials,
  counts,
  activity,
}: DashboardShellProps) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const showRightPanel = pathname === "/" || pathname === "/leads";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0A0907" }}>
      <Sidebar userName={userName} userInitials={userInitials} />

      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-[250ms] ease-out"
        style={{ marginLeft: collapsed ? 52 : 200 }}
      >
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>

          {showRightPanel && (
            <RightPanel counts={counts} activity={activity} />
          )}
        </div>
      </div>
    </div>
  );
}

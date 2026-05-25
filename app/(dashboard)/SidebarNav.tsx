"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M1.5 6L7.5 1.5L13.5 6V13.5H9.5V9.5H5.5V13.5H1.5V6Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M10 10L13.5 13.5" strokeLinecap="round" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="12" height="2" rx="0.5" />
      <rect x="1.5" y="6.5" width="8.5" height="2" rx="0.5" />
      <rect x="1.5" y="10.5" width="5.5" height="2" rx="0.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="2" />
      <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.22 3.22L4.28 4.28M10.72 10.72L11.78 11.78M11.78 3.22L10.72 4.28M4.28 10.72L3.22 11.78" />
    </svg>
  );
}

function ProposalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h7a1 1 0 001-1v-11a1 1 0 00-1-1z" />
      <path d="M5 5h5M5 7.5h5M5 10h3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 11V7a4 4 0 00-8 0v4H0v2h15v-2h-.5M8 11H.5" />
      <circle cx="11.5" cy="10" r="3.5" />
      <path d="M10 10h3M11.5 8.5v3" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 13V10a2 2 0 012-2h8a2 2 0 012 2v3" />
      <rect x="4.5" y="1.5" width="6" height="5" rx="1" />
    </svg>
  );
}

function DeliverablesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="12" height="12" rx="1.5" />
      <path d="M5 7.5l2 2 3-3" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13V5.5L7.5 1.5L13 5.5V13" />
      <path d="M5 13V9h5v4" />
      <path d="M5 6h1M9 6h1M5 8h1M9 8h1" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,10.5 5,7 8,9.5 13.5,4" />
      <polyline points="10,4 13.5,4 13.5,7.5" />
    </svg>
  );
}

const prospectingItems = [
  { href: "/home", label: "Overview", Icon: HomeIcon },
  { href: "/search", label: "New Search", Icon: SearchIcon },
  { href: "/leads", label: "Leads", Icon: LeadsIcon },
  { href: "/close", label: "Close", Icon: CloseIcon, badgeKey: "close" },
  { href: "/proposals", label: "Proposals", Icon: ProposalIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
] as const;

const agencyItems = [
  { href: "/clients", label: "Clients", Icon: ClientsIcon, badgeKey: "clients" },
  { href: "/deliverables", label: "Deliverables", Icon: DeliverablesIcon, badgeKey: "deliverables" },
  { href: "/reports", label: "Reports", Icon: ReportsIcon },
  { href: "/revenue", label: "Revenue", Icon: RevenueIcon },
] as const;

interface SidebarNavProps {
  userName?: string;
  userEmail?: string;
}

interface BadgeCounts {
  close: number;
  clients: number;
  deliverables: number;
}

export function SidebarNav({ userName, userEmail }: SidebarNavProps) {
  const pathname = usePathname();
  const [badges, setBadges] = useState<BadgeCounts>({ close: 0, clients: 0, deliverables: 0 });

  useEffect(() => {
    // Fetch close sessions badge
    fetch("/api/close")
      .then((r) => r.json())
      .then((data: { sessions?: Array<{ status: string; proposalId: string | null }> }) => {
        if (!Array.isArray(data.sessions)) return;
        const count = data.sessions.filter(
          (s) => s.status === "discovery_complete" && !s.proposalId
        ).length;
        setBadges((b) => ({ ...b, close: count }));
      })
      .catch(() => {});

    // Fetch agency badges
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data: { clients?: Array<{ healthScore: number }> }) => {
        if (!Array.isArray(data.clients)) return;
        const atRisk = data.clients.filter((c) => c.healthScore < 50).length;
        setBadges((b) => ({ ...b, clients: atRisk }));
      })
      .catch(() => {});

    fetch("/api/deliverables")
      .then((r) => r.json())
      .then((data: { deliverables?: Array<{ status: string; dueDate: string | null }> }) => {
        if (!Array.isArray(data.deliverables)) return;
        const now = new Date();
        const overdue = data.deliverables.filter(
          (d) => d.status !== "complete" && d.dueDate && new Date(d.dueDate) < now
        ).length;
        setBadges((b) => ({ ...b, deliverables: overdue }));
      })
      .catch(() => {});
  }, [pathname]);

  function NavItem({ href, label, Icon, badgeKey }: { href: string; label: string; Icon: () => React.JSX.Element; badgeKey?: string }) {
    const isActive =
      href === "/home"
        ? pathname === "/home"
        : pathname === href || pathname.startsWith(`${href}/`);
    const badgeCount = badgeKey ? badges[badgeKey as keyof BadgeCounts] ?? 0 : 0;

    return (
      <Link
        href={href}
        className={[
          "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all select-none",
          isActive
            ? "bg-[#1A1814] text-[#C4973F]"
            : "text-[#666360] hover:text-[#FFFDF8] hover:bg-[#1A1814]/50",
        ].join(" ")}
      >
        <span className="shrink-0"><Icon /></span>
        <span className={isActive ? "font-medium" : ""}>{label}</span>
        {badgeCount > 0 && (
          <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
            {badgeCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {prospectingItems.map(({ href, label, Icon, ...rest }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            badgeKey={"badgeKey" in rest ? (rest as { badgeKey?: string }).badgeKey : undefined}
          />
        ))}

        {/* Agency section separator */}
        <div style={{ paddingTop: 16, paddingBottom: 8, paddingLeft: 12 }}>
          <span style={{ fontSize: 9, color: "#2A2826", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-inter)" }}>
            Agency
          </span>
        </div>

        {agencyItems.map(({ href, label, Icon, ...rest }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            badgeKey={"badgeKey" in rest ? (rest as { badgeKey?: string }).badgeKey : undefined}
          />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#1A1814]">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: "w-7 h-7 shrink-0" },
            }}
          />
          <div className="min-w-0">
            {userName ? (
              <p className="text-xs font-medium text-[#FFFDF8] truncate leading-snug">
                {userName}
              </p>
            ) : null}
            {userEmail ? (
              <p className="text-[11px] text-[#444] truncate leading-snug">
                {userEmail}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

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

const navItems = [
  { href: "/home", label: "Overview", Icon: HomeIcon },
  { href: "/search", label: "New Search", Icon: SearchIcon },
  { href: "/leads", label: "Leads", Icon: LeadsIcon },
  { href: "/close", label: "Close", Icon: CloseIcon, badgeKey: "close" },
  { href: "/proposals", label: "Proposals", Icon: ProposalIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
] as const;

interface SidebarNavProps {
  userName?: string;
  userEmail?: string;
}

export function SidebarNav({ userName, userEmail }: SidebarNavProps) {
  const pathname = usePathname();
  const [closeBadge, setCloseBadge] = useState(0);

  useEffect(() => {
    fetch("/api/close")
      .then((r) => r.json())
      .then((data: { sessions?: Array<{ status: string; proposalId: string | null }> }) => {
        if (!Array.isArray(data.sessions)) return;
        const count = data.sessions.filter(
          (s) => s.status === "discovery_complete" && !s.proposalId
        ).length;
        setCloseBadge(count);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ href, label, Icon, ...rest }) => {
          const badgeKey = "badgeKey" in rest ? (rest as { badgeKey?: string }).badgeKey : undefined;
          const isActive =
            href === "/home"
              ? pathname === "/home"
              : pathname === href || pathname.startsWith(`${href}/`);
          const badgeCount = badgeKey === "close" ? closeBadge : 0;

          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all select-none",
                isActive
                  ? "bg-[#1A1814] text-[#C4973F]"
                  : "text-[#666360] hover:text-[#FFFDF8] hover:bg-[#1A1814]/50",
              ].join(" ")}
            >
              <span className="shrink-0">
                <Icon />
              </span>
              <span className={isActive ? "font-medium" : ""}>{label}</span>
              {badgeCount > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
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

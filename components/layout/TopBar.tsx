"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar, useMode, type DashboardMode } from "./DashboardProvider";
import { IconMenu, IconSearch } from "./icons";

const PAGE_TITLES: Record<string, string> = {
  "/home": "Dashboard",
  "/search": "New Search",
  "/leads": "Leads",
  "/cards": "Cards",
  "/outreach": "Outreach",
  "/pipeline": "Pipeline",
  "/journey": "Journey",
  "/settings": "Settings",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/leads/")) return "Lead Intelligence";
  if (pathname.startsWith("/cards/")) return "Prospect Card";
  return "Venn";
}

const MODES: { key: DashboardMode; label: string }[] = [
  { key: "focus", label: "Focus" },
  { key: "today", label: "Today" },
  { key: "full", label: "Full" },
];

export function TopBar() {
  const { toggle } = useSidebar();
  const { mode, setMode } = useMode();
  const pathname = usePathname();
  const title = getTitle(pathname);
  const isDashboard = pathname === "/home";

  return (
    <header
      className="shrink-0 flex items-center justify-between px-4"
      style={{
        height: 48,
        borderBottom: "0.5px solid #1E1C18",
        background: "#0A0907",
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-7 h-7 flex items-center justify-center rounded text-[#555250] transition-colors hover:bg-[#1A1814] hover:text-[#888]"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={14} />
        </button>
        <h1
          className="text-[18px] text-[#FFFDF8] leading-none"
          style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
        >
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Focus / Today / Full mode switcher — only on dashboard */}
        {isDashboard && (
          <div
            className="flex items-center rounded-full p-0.5"
            style={{ background: "#0F0E0B", border: "0.5px solid #1E1C18" }}
          >
            {MODES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className="px-3 py-1 rounded-full text-[11px] font-medium transition-all"
                style={{
                  background: mode === key ? "#C4973F" : "transparent",
                  color: mode === key ? "#0A0907" : "#555250",
                  fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* New search button */}
        <Link
          href="/search"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all"
          style={{
            background: "#1A1814",
            border: "0.5px solid #1E1C18",
            color: "#C4973F",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C4973F40")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1C18")}
        >
          <IconSearch size={12} />
          New search
        </Link>
      </div>
    </header>
  );
}

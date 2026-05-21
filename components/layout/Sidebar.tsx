"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./DashboardProvider";
import {
  IconDashboard, IconSearch, IconUsers, IconCard,
  IconSend, IconChartBar, IconSettings, IconMenu, IconTimeline,
} from "./icons";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const topNav: NavItem[] = [
  { href: "/", label: "Dashboard", Icon: IconDashboard },
  { href: "/search", label: "Search", Icon: IconSearch },
  { href: "/leads", label: "Leads", Icon: IconUsers },
  { href: "/cards", label: "Cards", Icon: IconCard },
  { href: "/outreach", label: "Outreach", Icon: IconSend },
  { href: "/pipeline", label: "Pipeline", Icon: IconChartBar },
  { href: "/journey", label: "Journey", Icon: IconTimeline },
];

const bottomNav: NavItem[] = [
  { href: "/settings", label: "Settings", Icon: IconSettings },
];

interface SidebarProps {
  userName?: string;
  userInitials: string;
}

export function Sidebar({ userName, userInitials }: SidebarProps) {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 52 : 200 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden"
      style={{
        background: "#0A0907",
        borderRight: "0.5px solid #1E1C18",
      }}
    >
      {/* Logo row */}
      <div
        className="flex items-center gap-3 shrink-0 overflow-hidden"
        style={{ height: 48, paddingLeft: 10, paddingRight: 10, borderBottom: "0.5px solid #1E1C18" }}
      >
        <button
          onClick={toggle}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-[#1A1814] text-[#555250]"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={15} />
        </button>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  background: "#1A1206",
                  border: "0.5px solid #3A2A10",
                  borderRadius: 6,
                }}
              >
                <span
                  className="text-[#C4973F] font-bold text-[15px] leading-none"
                  style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
                >
                  V
                </span>
              </div>
              <span
                className="text-[#FFFDF8] text-[15px] leading-none whitespace-nowrap"
                style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
              >
                Venn
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-1.5 overflow-hidden">
        {topNav.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 rounded transition-all select-none overflow-hidden"
              style={{
                height: 36,
                padding: collapsed ? "0 10px" : "0 10px",
                background: active ? "#C4973F15" : "transparent",
                color: active ? "#C4973F" : "#555250",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#1A1814";
                  e.currentTarget.style.color = "#888";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#555250";
                }
              }}
            >
              <span className="shrink-0 flex items-center justify-center" style={{ width: 20 }}>
                <Icon size={15} />
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] font-medium whitespace-nowrap"
                    style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{ height: 1, background: "#1E1C18", margin: "6px 8px" }} />

        {bottomNav.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 rounded transition-all select-none overflow-hidden"
              style={{
                height: 36,
                padding: "0 10px",
                background: active ? "#C4973F15" : "transparent",
                color: active ? "#C4973F" : "#555250",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#1A1814";
                  e.currentTarget.style.color = "#888";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#555250";
                }
              }}
            >
              <span className="shrink-0 flex items-center justify-center" style={{ width: 20 }}>
                <Icon size={15} />
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div
        className="shrink-0 flex items-center gap-2.5 overflow-hidden"
        style={{ height: 52, padding: "0 12px", borderTop: "0.5px solid #1E1C18" }}
      >
        <div
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            background: "#1A1814",
            border: "0.5px solid #1E1C18",
            fontSize: 11,
            fontWeight: 500,
            color: "#888",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          }}
        >
          {userInitials}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="min-w-0"
            >
              {userName && (
                <p
                  className="text-[12px] font-medium text-[#FFFDF8] truncate leading-snug"
                  style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
                >
                  {userName}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

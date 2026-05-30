"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  closeMobile: () => void;
}

export type DashboardMode = "focus" | "today" | "full";

interface ModeContextValue {
  mode: DashboardMode;
  setMode: (m: DashboardMode) => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  isMobile: false,
  mobileOpen: false,
  toggle: () => {},
  closeMobile: () => {},
});

export const ModeContext = createContext<ModeContextValue>({
  mode: "focus",
  setMode: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function useMode() {
  return useContext(ModeContext);
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setModeState] = useState<DashboardMode>("focus");

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Restore mode from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("venn_dashboard_mode") as DashboardMode | null;
      if (saved === "focus" || saved === "today" || saved === "full") {
        setModeState(saved);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setMode = useCallback((m: DashboardMode) => {
    setModeState(m);
    try {
      localStorage.setItem("venn_dashboard_mode", m);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }, [isMobile]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider value={{ collapsed, isMobile, mobileOpen, toggle, closeMobile }}>
      <ModeContext.Provider value={{ mode, setMode }}>
        {children}
      </ModeContext.Provider>
    </SidebarContext.Provider>
  );
}

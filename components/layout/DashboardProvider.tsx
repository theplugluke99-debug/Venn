"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  closeMobile: () => void;
}

interface ModeContextValue {
  mode: "focus" | "intel";
  setMode: (m: "focus" | "intel") => void;
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
  const [mode, setMode] = useState<"focus" | "intel">("focus");

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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

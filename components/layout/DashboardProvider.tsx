"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

interface ModeContextValue {
  mode: "focus" | "intel";
  setMode: (m: "focus" | "intel") => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
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
  const [mode, setMode] = useState<"focus" | "intel">("focus");

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((v) => !v) }}>
      <ModeContext.Provider value={{ mode, setMode }}>
        {children}
      </ModeContext.Provider>
    </SidebarContext.Provider>
  );
}

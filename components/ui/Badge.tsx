interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "green" | "red" | "muted" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  gold: "bg-[#C4973F]/15 text-[#C4973F] border border-[#C4973F]/30",
  green: "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40",
  red: "bg-red-900/30 text-red-400 border border-red-800/40",
  muted: "bg-[#1A1814] text-[#888] border border-[#2A2720]",
  outline: "bg-transparent text-[#FFFDF8] border border-[#2A2720]",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "muted",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

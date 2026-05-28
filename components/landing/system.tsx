"use client";

import { type CSSProperties, type ReactNode, useId } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

export const colours = {
  bg: "#0A0907",
  bgSecondary: "#0F0E0B",
  gold: "#C4973F",
  ivory: "#FFFDF8",
  secondary: "#888580",
  muted: "#444440",
  border: "rgba(255,253,248,0.08)",
  goldBorder: "rgba(196,151,63,0.24)",
};

export const motionPresets = {
  reveal: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  } satisfies Variants,
  soft: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  slow: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
};

export function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={motionPresets.reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ ...motionPresets.soft, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  children,
  id,
  tone = "primary",
  tight = false,
  className,
  style,
}: {
  children: ReactNode;
  id?: string;
  tone?: "primary" | "secondary" | "ivory";
  tight?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const background =
    tone === "secondary" ? colours.bgSecondary : tone === "ivory" ? colours.ivory : colours.bg;
  return (
    <section
      id={id}
      className={`${tight ? "venn-section-tight" : "venn-section"} ${className ?? ""}`}
      style={{ background, fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", ...style }}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subline,
  dark = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subline?: ReactNode;
  dark?: boolean;
}) {
  return (
    <Reveal style={{ textAlign: "center", margin: "0 auto 56px", maxWidth: 760 }}>
      {eyebrow && <p className="venn-eyebrow" style={{ marginBottom: 20 }}>{eyebrow}</p>}
      <h2 className="venn-heading-md" style={{ color: dark ? colours.ivory : colours.bg }}>
        {title}
      </h2>
      {subline && (
        <p className="venn-copy" style={{ margin: "18px auto 0", maxWidth: 560, color: dark ? colours.secondary : "#555250" }}>
          {subline}
        </p>
      )}
    </Reveal>
  );
}

export function CTA({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link className={`venn-cta venn-cta-${variant}`} href={href}>
      {children}
    </Link>
  );
}

export function VennLogo({
  variant = "horizontal",
  size = 34,
  tone = "dark",
  decorative = false,
  className,
  style,
}: {
  variant?: "mark" | "wordmark" | "horizontal" | "stacked";
  size?: number;
  tone?: "dark" | "light";
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const wordColor = tone === "light" ? colours.bg : colours.ivory;
  const mark = (
    <svg
      viewBox="0 0 120 80"
      width={size * 1.5}
      height={size}
      fill="none"
      aria-hidden={decorative || variant !== "mark"}
      role={decorative ? undefined : "img"}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id={`${id}-left`}>
          <circle cx="45" cy="40" r="30" />
        </clipPath>
        <radialGradient id={`${id}-gold`} cx="50%" cy="48%" r="68%">
          <stop offset="0%" stopColor="#E5B74F" />
          <stop offset="100%" stopColor={colours.gold} />
        </radialGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.77 0 1 0 0 0.59 0 0 1 0 0.25 0 0 0 0.65 0" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>
      <circle cx="45" cy="40" r="30" stroke={colours.gold} strokeWidth="2.6" />
      <circle cx="75" cy="40" r="24" stroke={colours.gold} strokeWidth="2.6" />
      <path
        d="M65.4 18A30 30 0 0 1 65.4 62A24 24 0 0 0 65.4 18Z"
        fill={`url(#${id}-gold)`}
        filter={`url(#${id}-glow)`}
      />
    </svg>
  );

  const word = (
    <span
      style={{
        color: wordColor,
        fontFamily: "var(--font-instrument-serif), Instrument Serif, Georgia, serif",
        fontSize: Math.round(size * 0.82),
        lineHeight: 0.9,
      }}
    >
      venn
    </span>
  );

  if (variant === "mark") return <span className={className} style={style}>{mark}</span>;
  if (variant === "wordmark") return <span className={className} style={style}>{word}</span>;

  return (
    <span
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        flexDirection: variant === "stacked" ? "column" : "row",
        gap: variant === "stacked" ? size * 0.1 : size * 0.28,
        ...style,
      }}
    >
      {mark}
      {word}
    </span>
  );
}

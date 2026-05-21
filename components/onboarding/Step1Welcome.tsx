"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

function GoldParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 8,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#C4973F",
            opacity: 0.03,
          }}
          animate={{ y: [0, -window.innerHeight - 20] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function VennDiagram() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <defs>
        <clipPath id="right-circle">
          <circle cx="68" cy="40" r="32" />
        </clipPath>
      </defs>

      {/* Left circle */}
      <motion.circle
        cx="52"
        cy="40"
        r="32"
        stroke="#C4973F"
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="transparent"
        initial={{ cx: 30 }}
        animate={{ cx: 52 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />

      {/* Right circle */}
      <motion.circle
        cx="68"
        cy="40"
        r="32"
        stroke="#C4973F"
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="transparent"
        initial={{ cx: 90 }}
        animate={{ cx: 68 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />

      {/* Intersection glow — revealed after overlap */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        clipPath="url(#right-circle)"
      >
        <motion.circle
          cx="52"
          cy="40"
          r="32"
          fill="#C4973F"
          fillOpacity="0.12"
          initial={{ cx: 30 }}
          animate={{ cx: 52 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </motion.g>
    </svg>
  );
}

interface Step1Props {
  onNext: () => void;
  userName: string | null;
}

export function Step1Welcome({ onNext, userName }: Step1Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6 py-16 min-h-[500px]">
      <GoldParticles />

      {/* Logo animation */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <VennDiagram />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 36,
          color: "#FFFDF8",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          lineHeight: 1.15,
          marginBottom: 12,
        }}
      >
        Welcome to Venn{userName ? `, ${userName}` : ""}.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: 16,
          color: "#555250",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          marginBottom: 20,
        }}
      >
        The prospect engine that thinks before it speaks.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          fontSize: 14,
          color: "#444",
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          maxWidth: 420,
          lineHeight: 1.7,
          marginBottom: 36,
        }}
      >
        In the next two minutes we&apos;ll set up your agency identity, show you
        how Venn works, and find your first leads. Everything Venn generates —
        every opening line, every prospect card — will sound like you wrote it.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 6 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        onClick={onNext}
        className="px-6 py-3 rounded transition-opacity hover:opacity-90"
        style={{
          background: "#C4973F",
          color: "#0A0907",
          fontSize: 15,
          fontWeight: 500,
          fontFamily: "var(--font-inter)",
          borderRadius: 8,
          cursor: "pointer",
          border: "none",
        }}
      >
        Let&apos;s build your identity →
      </motion.button>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface Step5Props {
  onFinish: () => void;
}

const CHECKLIST = [
  "Agency identity saved",
  "Writing style calibrated",
  "Venn ready to generate",
];

export function Step5Confirmation({ onFinish }: Step5Props) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#4CAF5015",
          border: "0.5px solid #4CAF5030",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h2
        style={{
          fontSize: 32,
          color: "#FFFDF8",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        You&apos;re ready.
      </h2>
      <p style={{ fontSize: 15, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 28 }}>
        Your identity is saved. Venn is ready to work.
      </p>

      {/* Checklist */}
      <div
        style={{
          background: "#0A0907",
          border: "0.5px solid #1E1C18",
          borderRadius: 8,
          padding: 20,
          marginBottom: 28,
          textAlign: "left",
        }}
      >
        {CHECKLIST.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.3 }}
            className="flex items-center gap-3"
            style={{ paddingBottom: i < CHECKLIST.length - 1 ? 12 : 0 }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#4CAF5015",
                border: "0.5px solid #4CAF5030",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>
            <span style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)" }}>
              {item}
            </span>
          </motion.div>
        ))}
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#444",
          fontFamily: "var(--font-inter)",
          lineHeight: 1.6,
          marginBottom: 24,
          maxWidth: 360,
          margin: "0 auto 24px",
        }}
      >
        Head to Search whenever you&apos;re ready to find your first leads.
        Everything Venn generates will sound like you from day one.
      </p>

      <motion.button
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onFinish}
        className="w-full py-3 rounded transition-opacity hover:opacity-90"
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
        Open my dashboard →
      </motion.button>
    </div>
  );
}

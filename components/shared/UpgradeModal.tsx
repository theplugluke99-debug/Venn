"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const FEATURE_LABELS: Record<string, string> = {
  cards: "Prospect Cards",
  sequences: "Sequences",
  proposals: "Proposals",
  reporting: "Reporting",
  search: "more searches this month",
};

const FEATURE_PLAN: Record<string, string> = {
  cards: "Growth",
  sequences: "Growth",
  proposals: "Pro",
  reporting: "Pro",
  search: "a higher plan",
};

export function UpgradeModal({
  feature,
  onClose,
}: {
  feature: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const featureLabel = FEATURE_LABELS[feature] ?? feature;
  const planLabel = FEATURE_PLAN[feature] ?? "Growth";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,9,7,0.85)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            background: "#0F0E0B",
            border: "0.5px solid #C4973F40",
            borderRadius: 12,
            padding: 32,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#C4973F15",
              border: "0.5px solid #C4973F30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4973F" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 20,
              color: "#FFFDF8",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            {featureLabel} requires the {planLabel} plan
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#555250",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Upgrade your plan to unlock {featureLabel.toLowerCase()} and continue growing your pipeline.
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => router.push("/subscribe")}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                background: "#C4973F",
                color: "#0A0907",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-inter)",
                border: "none",
                cursor: "pointer",
              }}
            >
              View plans →
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "transparent",
                color: "#555250",
                fontSize: 14,
                fontFamily: "var(--font-inter)",
                border: "0.5px solid #1E1C18",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

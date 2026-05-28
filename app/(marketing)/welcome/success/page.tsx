"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_LINES: Record<string, string[]> = {
  starter: [
    "Your intelligence pipeline is live.",
    "Leads are waiting.",
    "The first search is on the other side of this screen.",
  ],
  growth: [
    "Prospect cards. Intelligence. Sequences.",
    "Everything you need to turn attention into revenue.",
    "Your pipeline starts now.",
  ],
  pro: [
    "Intelligence. Cards. Proposals. Close. Agency OS.",
    "The full stack.",
    "Every tool built because someone needed it.",
  ],
  solopreneur: [
    "Welcome to the cohort.",
    "You have 60 days.",
    "One deal is all it takes.",
  ],
};

function VennMark({ phase }: { phase: number }) {
  const isLoading = phase === 0;
  const separating = phase < 1;

  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      {/* Left circle */}
      <motion.div
        animate={{
          x: separating ? -24 : -14,
          scale: isLoading ? [1, 1.05, 1] : 1,
        }}
        transition={
          isLoading
            ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            : { duration: 2, ease: [0.22, 1, 0.36, 1] }
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid rgba(255,253,248,0.55)",
          background: "transparent",
        }}
      />
      {/* Right circle */}
      <motion.div
        animate={{
          x: separating ? 24 : 14,
          scale: isLoading ? [1, 1.05, 1] : 1,
        }}
        transition={
          isLoading
            ? { repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.3 }
            : { duration: 2, ease: [0.22, 1, 0.36, 1] }
        }
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid rgba(255,253,248,0.55)",
          background: "transparent",
        }}
      />
      {/* Intersection glow — ignites when circles meet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(196,151,63,0.9) 0%, rgba(196,151,63,0.3) 60%, transparent 100%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
}

function Fade({
  show,
  delay = 0,
  children,
  style,
}: {
  show: boolean;
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [phase, setPhase] = useState(0);
  const [plan, setPlan] = useState("starter");
  const [firstName, setFirstName] = useState("there");
  const [showNudge, setShowNudge] = useState(false);

  // Fetch session data then kick off animation
  useEffect(() => {
    if (!sessionId) {
      startAnimation("starter", "there");
      return;
    }

    fetch(`/api/stripe/session/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setPlan(data.plan ?? "starter");
        setFirstName(data.firstName ?? "there");
        startAnimation(data.plan ?? "starter", data.firstName ?? "there");
      })
      .catch(() => startAnimation("starter", "there"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function startAnimation(_plan: string, _firstName: string) {
    const timings = [0, 2500, 3500, 4800, 5800, 6200, 7200, 7800];
    timings.forEach((ms, i) => {
      setTimeout(() => setPhase(i + 1), ms);
    });
    // Idle nudge after 45 seconds
    setTimeout(() => setShowNudge(true), 45000);
  }

  const planLines = PLAN_LINES[plan] ?? PLAN_LINES.starter;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0A0907",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      {/* Venn mark */}
      <VennMark phase={phase} />

      {/* Phase 2: You're in. */}
      <Fade show={phase >= 2} delay={0} style={{ marginTop: 48, textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            color: "#FFFDF8",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          You&rsquo;re in.
        </p>
      </Fade>

      {/* Phase 3: not just subscribed */}
      <Fade show={phase >= 3} delay={0} style={{ marginTop: 16, textAlign: "center" }}>
        <p style={{ fontSize: 18, color: "#888580", margin: "0 0 4px", lineHeight: 1.5 }}>
          Not just subscribed.
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ fontSize: 18, color: "#888580", margin: 0, lineHeight: 1.5 }}
        >
          Actually in.
        </motion.p>
      </Fade>

      {/* Phase 4: plan-specific lines */}
      <Fade show={phase >= 4} delay={0} style={{ marginTop: 32, textAlign: "center" }}>
        <div>
          {planLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 1 : 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              style={{
                fontSize: 15,
                color: "#FFFDF8",
                margin: "0 0 6px",
                lineHeight: 1.6,
                opacity: 1 - i * 0.15,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </Fade>

      {/* Phase 5: gold rule */}
      <Fade show={phase >= 5} delay={0} style={{ marginTop: 32, textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 1,
            background: "#C4973F",
            margin: "0 auto",
          }}
        />
      </Fade>

      {/* Phase 6: gold italic quote */}
      <Fade show={phase >= 6} delay={0} style={{ marginTop: 24, textAlign: "center", maxWidth: 400 }}>
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(16px, 3vw, 22px)",
            color: "#C4973F",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Real attention is the rarest thing in the world right now.
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 6 ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(16px, 3vw, 22px)",
            color: "#C4973F",
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}
        >
          You just chose to offer it.
        </motion.p>
      </Fade>

      {/* Phase 7: CTA button */}
      <Fade show={phase >= 7} delay={0} style={{ marginTop: 40, textAlign: "center" }}>
        <motion.button
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: phase >= 7 ? 1 : 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.4 }}
          onClick={() => router.push("/search")}
          style={{
            background: "#C4973F",
            color: "#0A0907",
            border: "none",
            borderRadius: 6,
            padding: "16px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          Find your first clients →
        </motion.button>

        {/* Idle nudge after 45s */}
        <AnimatePresence>
          {showNudge && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ marginTop: 16, fontSize: 13, color: "#555" }}
            >
              Not sure where to start?{" "}
              <button
                onClick={() => router.push("/welcome")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#888580",
                  cursor: "pointer",
                  fontSize: 13,
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Your onboarding guide is waiting
              </button>
            </motion.p>
          )}
        </AnimatePresence>
      </Fade>

      {/* Phase 8: personal note notice */}
      <Fade show={phase >= 8} delay={0} style={{ marginTop: 24, textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#444440", margin: 0, letterSpacing: "0.02em" }}>
          A personal note from Luke is on its way to your inbox.
        </p>
      </Fade>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0A0907",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VennMark phase={0} />
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}

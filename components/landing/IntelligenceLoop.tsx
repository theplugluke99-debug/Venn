"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const STEPS = [
  { id: "scan", label: "Scan", detail: "Find & verify business" },
  { id: "analyse", label: "Analyse", detail: "Read reviews, score intent" },
  { id: "generate", label: "Generate", detail: "Draft opening + card" },
  { id: "deliver", label: "Deliver", detail: "Send across channels" },
];

function ElapsedTimer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span style={{ fontFamily: "monospace", fontSize: 13, color: "#C4973F" }}>
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

const LIVE_EVENTS = [
  { time: "0:00", event: "Scan started", location: "Manchester → Aesthetic Clinics", step: 0 },
  { time: "0:07", event: "23 businesses found", location: "Pulling Google data", step: 0 },
  { time: "0:19", event: "Reviews loaded", location: "847 reviews processed", step: 1 },
  { time: "0:31", event: "Intent scored", location: "Glow Aesthetics — HIGH", step: 1 },
  { time: "0:44", event: "Opening line written", location: "Claude AI · personalised", step: 2 },
  { time: "0:52", event: "Card generated", location: "venn.agency/card/glow-aesthetics-mx7k", step: 2 },
  { time: "1:03", event: "Email queued", location: "Ready to send", step: 3 },
];

export function IntelligenceLoop() {
  const [activeStep, setActiveStep] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [startedAt] = useState(() => new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inView = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true;
          let i = 0;
          timerRef.current = setInterval(() => {
            i++;
            if (i < LIVE_EVENTS.length) {
              setEventIndex(i);
              setActiveStep(LIVE_EVENTS[i].step);
            } else {
              clearInterval(timerRef.current!);
            }
          }, 900);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const visibleEvents = LIVE_EVENTS.slice(0, eventIndex + 1);

  return (
    <section
      id="intelligence"
      ref={sectionRef}
      style={{
        background: "#0A0907",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          06 / The intelligence loop
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          Scan. Analyse.
          <br />
          Generate. Deliver.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: 15,
            color: "#888580",
            textAlign: "center",
            marginBottom: 64,
            lineHeight: 1.6,
          }}
        >
          Four steps. Sixty seconds. Every time you search.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="loop-grid"
        >
          {/* Step pipeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: "28px 24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map((step, i) => {
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <div key={step.id} style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                    {/* Left: dot + line */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                        width: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: isDone ? "#C4973F" : isActive ? "#C4973F" : "#1E1C18",
                          border: isActive ? "2px solid #C4973F" : "1.5px solid transparent",
                          boxShadow: isActive ? "0 0 8px rgba(196,151,63,0.5)" : "none",
                          transition: "all 0.4s",
                          marginTop: 18,
                        }}
                      />
                      {i < STEPS.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            minHeight: 24,
                            background: isDone ? "#C4973F" : "#1E1C18",
                            transition: "background 0.4s",
                            opacity: isDone ? 0.6 : 0.3,
                          }}
                        />
                      )}
                    </div>

                    {/* Right: text */}
                    <div style={{ paddingTop: 12, paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: isActive || isDone ? "#FFFDF8" : "#444440",
                          marginBottom: 2,
                          transition: "color 0.4s",
                        }}
                      >
                        {step.label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: isDone ? "#888580" : isActive ? "#888580" : "#2A2826",
                          transition: "color 0.4s",
                        }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: "0.5px solid #1E1C18",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#444440" }}>Elapsed</span>
              <ElapsedTimer startedAt={startedAt} />
            </div>
          </motion.div>

          {/* Live event feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              background: "#0F0E0B",
              border: "0.5px solid #1E1C18",
              borderRadius: 8,
              padding: "24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                className="pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#C4973F",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#444440",
                  textTransform: "uppercase",
                }}
              >
                Live feed
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {visibleEvents.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    opacity: i === visibleEvents.length - 1 ? 1 : 0.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: "#444440",
                      minWidth: 32,
                      paddingTop: 1,
                    }}
                  >
                    {ev.time}
                  </span>
                  <div>
                    <p style={{ fontSize: 13, color: "#FFFDF8", margin: 0 }}>{ev.event}</p>
                    <p style={{ fontSize: 11, color: "#444440", margin: 0 }}>{ev.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontSize: 13,
            color: "#444440",
            textAlign: "center",
            marginTop: 40,
            lineHeight: 1.6,
          }}
        >
          The entire loop runs automatically. You just decide who to contact.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .loop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

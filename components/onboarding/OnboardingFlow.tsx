"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StepDots } from "./StepDots";
import { Step1Welcome } from "./Step1Welcome";
import { Step2Identity } from "./Step2Identity";
import { Step3HowItWorks } from "./Step3HowItWorks";
import { Step4Search } from "./Step4Search";
import { Step5Confirmation } from "./Step5Confirmation";

const LS_STEP_KEY = "venn_onboarding_step";

interface ExistingIdentity {
  agencyName: string;
  writingStyle: string;
  defaultAngle: string;
}

interface OnboardingFlowProps {
  userName: string | null;
  existingIdentity: ExistingIdentity | null;
}

const TOTAL_STEPS = 5;

interface IdentityData {
  agencyName: string;
  yourName: string;
  whatYouSell: string;
  whoYouSellTo: string;
  writingStyle: string;
  defaultAngle: string;
}

export function OnboardingFlow({ userName, existingIdentity }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Restore progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_STEP_KEY);
      if (saved) {
        const n = parseInt(saved, 10);
        if (n > 0 && n < TOTAL_STEPS) setStep(n);
      }
    } catch {}
  }, []);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(LS_STEP_KEY, String(step));
    } catch {}
  }, [step]);

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function handleIdentitySave(data: IdentityData) {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyName: data.agencyName,
          agencyTagline: data.whatYouSell,
          writingStyle: [
            data.yourName ? `Name: ${data.yourName}` : "",
            data.whatYouSell ? `Product: ${data.whatYouSell}` : "",
            data.whoYouSellTo ? `Target: ${data.whoYouSellTo}` : "",
            data.writingStyle ? `\nVoice:\n${data.writingStyle}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          defaultAngle: data.defaultAngle,
        }),
      });

      if (res.ok) {
        goTo(2);
      }
    } catch {
      // Continue anyway
      goTo(2);
    } finally {
      setSaving(false);
    }
  }

  async function handleFinish() {
    setFinishing(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      localStorage.removeItem(LS_STEP_KEY);
      localStorage.removeItem("venn_onboarding_identity");
    } catch {}
    router.push("/");
    router.refresh();
  }

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({
      x: d > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "#0A0907" }}
    >
      {/* Step dots — always visible (hidden on step 0) */}
      {step > 0 && (
        <div className="mb-6">
          <StepDots total={TOTAL_STEPS} current={step} />
        </div>
      )}

      {/* Content card */}
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: step === 0 ? "transparent" : "#0F0E0B",
          border: step === 0 ? "none" : "0.5px solid #1E1C18",
          borderRadius: 8,
          padding: step === 0 ? 0 : 40,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {step === 0 && (
              <Step1Welcome onNext={() => goTo(1)} userName={userName} />
            )}
            {step === 1 && (
              <Step2Identity
                onNext={handleIdentitySave}
                onBack={() => goTo(0)}
                saving={saving}
              />
            )}
            {step === 2 && (
              <Step3HowItWorks
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}
            {step === 3 && (
              <Step4Search
                onSkip={() => goTo(4)}
                onBack={() => goTo(2)}
              />
            )}
            {step === 4 && (
              <Step5Confirmation onFinish={handleFinish} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back button — steps 1+ */}
      {step > 0 && step < 4 && (
        <button
          onClick={() => goTo(step - 1)}
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "#444",
            fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      )}

      {/* Loading overlay for finish */}
      {finishing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0A0907",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="animate-spin mx-auto mb-4"
              style={{
                width: 32,
                height: 32,
                border: "1.5px solid #1E1C18",
                borderTop: "1.5px solid #C4973F",
                borderRadius: "50%",
              }}
            />
            <p style={{ fontSize: 14, color: "#555250", fontFamily: "var(--font-inter)" }}>
              Opening your dashboard…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

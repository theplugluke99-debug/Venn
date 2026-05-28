"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CTA, VennLogo, colours, motionPresets } from "./system";

export function TheClose() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="close"
      className="venn-section"
      style={{
        background: colours.bg,
        borderTop: `0.5px solid ${colours.border}`,
        overflow: "hidden",
        position: "relative",
        textAlign: "center",
      }}
    >
      <div className="venn-container-narrow" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={motionPresets.slow}
          style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}
        >
          <VennLogo variant="mark" size={170} decorative />
        </motion.div>

        <motion.h2
          className="venn-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ ...motionPresets.slow, delay: 0.08 }}
          style={{ marginBottom: 22 }}
        >
          Your next client
          <br />
          is already out there.
        </motion.h2>

        <motion.p
          className="venn-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ ...motionPresets.soft, delay: 0.18 }}
          style={{ margin: "0 auto 42px", maxWidth: 520 }}
        >
          Venn knows who they are. What&apos;s broken in their business.
          And exactly what you should say.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ ...motionPresets.soft, delay: 0.26 }}
          style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "18px 28px", justifyContent: "center" }}
        >
          <CTA href="/sign-up">Start finding clients today</CTA>
          <CTA href="/solopreneur" variant="secondary">Apply for solopreneur access →</CTA>
        </motion.div>
      </div>
    </section>
  );
}

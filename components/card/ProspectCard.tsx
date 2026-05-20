"use client";

import { motion } from "framer-motion";
import { CardSection } from "./CardSection";
import { CardCTA } from "./CardCTA";

interface Observation {
  title: string;
  detail: string;
}

interface ProspectCardProps {
  businessName: string;
  headline: string;
  observations: Observation[];
  revenueLoss: string | null;
  ctaText: string;
  ctaType: string;
  ctaValue: string | null;
  brandColour: string;
  logoUrl: string | null;
  agencyName: string | null;
  niche: string;
  location: string;
}

export function ProspectCard({
  businessName,
  headline,
  observations,
  revenueLoss,
  ctaText,
  ctaType,
  ctaValue,
  brandColour,
  logoUrl,
  agencyName,
  niche,
  location,
}: ProspectCardProps) {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-2xl mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-14 pb-8 flex items-center justify-between"
        >
          {logoUrl ? (
            <img src={logoUrl} alt={agencyName ?? "Agency"} className="h-8 object-contain" />
          ) : (
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: brandColour }}
            >
              {agencyName ?? "Agency"}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {niche} · {location}
          </span>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-10 border-b border-gray-100"
        >
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">
            Prepared for
          </p>
          <h1 className="text-4xl font-serif text-gray-900 leading-tight mb-4">
            {businessName}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed font-serif">
            {headline}
          </p>
        </motion.div>

        {observations.length > 0 ? (
          <CardSection title="What we found" accentColour={brandColour}>
            <div className="space-y-6">
              {observations.map((obs, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex gap-4"
                >
                  <div
                    className="w-0.5 shrink-0 mt-1 rounded-full"
                    style={{ backgroundColor: brandColour, height: "auto", minHeight: "100%" }}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {obs.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {obs.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardSection>
        ) : null}

        {revenueLoss ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="py-8 border-y border-gray-100"
          >
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Estimated monthly impact
            </p>
            <p
              className="text-3xl font-serif"
              style={{ color: brandColour }}
            >
              {revenueLoss}
            </p>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardCTA
            ctaText={ctaText}
            ctaType={ctaType}
            ctaValue={ctaValue}
            brandColour={brandColour}
            agencyName={agencyName}
          />
        </motion.div>

        <footer className="py-8 border-t border-gray-100">
          <p className="text-xs text-center text-gray-300">
            This analysis was prepared specifically for {businessName}.
          </p>
        </footer>
      </div>
    </div>
  );
}

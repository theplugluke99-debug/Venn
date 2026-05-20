"use client";

import { motion } from "framer-motion";
import { IntentBadge } from "./IntentBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import type { IntentScore, Observation, WebsiteAudit, ReviewSummary } from "@/types";

interface IntelligenceProfileProps {
  businessName: string;
  businessBio: string | null;
  intentScore: IntentScore;
  intentSignals: string[] | null;
  observations: Observation[] | null;
  openingLine: string | null;
  recommendedChannel: string | null;
  suggestedAngle: string | null;
  googleRating: number | null;
  reviewCount: number | null;
  reviewSummary: ReviewSummary | null;
  websiteAudit: WebsiteAudit | null;
  website: string | null;
}

const channelIcons: Record<string, string> = {
  email: "✉",
  whatsapp: "✓",
  instagram: "◈",
  linkedin: "in",
};

export function IntelligenceProfile({
  businessName,
  businessBio,
  intentScore,
  intentSignals,
  observations,
  openingLine,
  recommendedChannel,
  suggestedAngle,
  googleRating,
  reviewCount,
  reviewSummary,
  websiteAudit,
  website,
}: IntelligenceProfileProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <div className="flex-1">
          <h1 className="text-2xl font-serif text-[#FFFDF8] mb-1">
            {businessName}
          </h1>
          {businessBio ? (
            <p className="text-sm text-[#888] leading-relaxed">{businessBio}</p>
          ) : null}
        </div>
        <IntentBadge score={intentScore} />
      </motion.div>

      {openingLine ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#1A1814] border border-[#C4973F]/20 rounded-lg p-5"
        >
          <p className="text-xs text-[#C4973F] uppercase tracking-wider mb-2">
            Recommended Opening Line
          </p>
          <p className="text-[#FFFDF8] text-sm leading-relaxed">
            &ldquo;{openingLine}&rdquo;
          </p>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedChannel ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4"
          >
            <p className="text-xs text-[#555] mb-1">Channel</p>
            <p className="text-sm text-[#FFFDF8] capitalize">
              {channelIcons[recommendedChannel] ?? "→"}&nbsp;{recommendedChannel}
            </p>
          </motion.div>
        ) : null}

        {suggestedAngle ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4"
          >
            <p className="text-xs text-[#555] mb-1">Angle</p>
            <p className="text-sm text-[#FFFDF8] capitalize">{suggestedAngle}</p>
          </motion.div>
        ) : null}

        {googleRating != null ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-4"
          >
            <p className="text-xs text-[#555] mb-1">Google Rating</p>
            <p className="text-sm text-[#FFFDF8]">
              ★ {googleRating.toFixed(1)}{" "}
              <span className="text-[#555]">({reviewCount ?? 0} reviews)</span>
            </p>
          </motion.div>
        ) : null}
      </div>

      {intentSignals && intentSignals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <h2 className="text-xs text-[#555] uppercase tracking-wider mb-3">
            Intent Signals
          </h2>
          <div className="flex flex-wrap gap-2">
            {intentSignals.map((signal) => (
              <Badge key={signal} variant="gold" size="sm">
                {signal}
              </Badge>
            ))}
          </div>
        </motion.div>
      ) : null}

      {observations && observations.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <h2 className="text-xs text-[#555] uppercase tracking-wider mb-3">
            Observations
          </h2>
          <div className="space-y-3">
            {observations.map((obs, i) => (
              <Card key={i}>
                <CardBody className="py-4">
                  <h3 className="text-sm font-medium text-[#FFFDF8] mb-1">
                    {obs.title}
                  </h3>
                  <p className="text-xs text-[#888] mb-2">{obs.detail}</p>
                  <p className="text-xs text-[#C4973F]">{obs.signal}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>
      ) : null}

      {(reviewSummary?.negativeThemes.length || reviewSummary?.positiveThemes.length) ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <h2 className="text-xs text-[#555] uppercase tracking-wider mb-3">
            Review Analysis
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {reviewSummary!.positiveThemes.length > 0 ? (
              <Card>
                <CardBody className="py-4">
                  <p className="text-xs text-emerald-400 mb-2">Positive Themes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewSummary!.positiveThemes.map((t) => (
                      <Badge key={t} variant="green" size="sm">{t}</Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ) : null}
            {reviewSummary!.negativeThemes.length > 0 ? (
              <Card>
                <CardBody className="py-4">
                  <p className="text-xs text-red-400 mb-2">Negative Themes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewSummary!.negativeThemes.map((t) => (
                      <Badge key={t} variant="red" size="sm">{t}</Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      {websiteAudit ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <h2 className="text-xs text-[#555] uppercase tracking-wider mb-3">
            Website Audit
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 normal-case text-[#C4973F] hover:underline"
              >
                {website.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            ) : null}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "SSL", value: websiteAudit.hasSSL },
              { label: "Mobile", value: websiteAudit.hasMobileOptimisation },
              { label: "Booking", value: websiteAudit.hasBookingLink },
              { label: "Contact Form", value: websiteAudit.hasContactForm },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-[#1A1814] border border-[#2A2720] rounded-lg p-3 flex items-center justify-between"
              >
                <span className="text-xs text-[#555]">{label}</span>
                <span
                  className={`text-xs font-medium ${
                    value ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-xs text-[#555]">
              Load speed:{" "}
              <span className="text-[#888] capitalize">
                {websiteAudit.loadSpeed ?? "unknown"}
              </span>
            </span>
            <span className="text-xs text-[#555]">
              Quality score:{" "}
              <span className="text-[#888]">{websiteAudit.qualityScore}/100</span>
            </span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

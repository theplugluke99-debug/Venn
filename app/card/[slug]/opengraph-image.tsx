import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/db/queries/cards";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  const businessName = card?.lead.businessName ?? "Your Business";
  const mins = card?.minutesAnalysing ?? 14;

  let agencyName: string | null = null;
  if (card) {
    agencyName = card.agencyName ?? null;
    if (!agencyName) {
      const u = await db.user.findUnique({
        where: { id: card.userId },
        include: { cardIdentity: { select: { agencyName: true } } },
      });
      agencyName = u?.cardIdentity?.agencyName ?? null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0907",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top: label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4973F" }} />
          <span style={{ fontSize: 13, color: "#C4973F", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Prospect Card
          </span>
        </div>

        {/* Middle: business name */}
        <div>
          <div style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>
            WE SPENT {mins} MINUTES ANALYSING
          </div>
          <div style={{ fontSize: 72, color: "#FFFDF8", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 20 }}>
            {businessName}
          </div>
          {agencyName && (
            <div style={{ fontSize: 18, color: "#C4973F", fontFamily: "system-ui, sans-serif" }}>
              Prepared by {agencyName}
            </div>
          )}
        </div>

        {/* Bottom: venn mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#2A2826", fontFamily: "system-ui, sans-serif" }}>
            ⊙ venn
          </span>
        </div>
      </div>
    ),
    size
  );
}

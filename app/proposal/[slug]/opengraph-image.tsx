import { ImageResponse } from "next/og";
import { getProposalBySlug } from "@/lib/db/queries/proposals";
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
  const proposal = await getProposalBySlug(slug);

  const businessName = proposal?.lead.businessName ?? "A Prospective Client";
  const title = proposal?.title ?? "A Growth Proposal";

  let agencyName: string | null = null;
  if (proposal) {
    const u = await db.user.findUnique({
      where: { id: proposal.userId },
      include: { cardIdentity: { select: { agencyName: true } } },
    });
    agencyName = u?.cardIdentity?.agencyName ?? null;
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4973F" }} />
          <span style={{ fontSize: 13, color: "#C4973F", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "system-ui, sans-serif" }}>
            Proposal
          </span>
        </div>

        <div>
          <div style={{ fontSize: 11, color: "#444440", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui, sans-serif" }}>
            Prepared for {businessName}
          </div>
          <div style={{ fontSize: 56, color: "#FFFDF8", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 20 }}>
            {title}
          </div>
          {agencyName && (
            <div style={{ fontSize: 18, color: "#C4973F", fontFamily: "system-ui, sans-serif" }}>
              by {agencyName}
            </div>
          )}
        </div>

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

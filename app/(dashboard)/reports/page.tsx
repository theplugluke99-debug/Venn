import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getReportsByUser } from "@/lib/db/queries/clientReports";

export const metadata = { title: "Reports — Venn" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export default async function ReportsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const reports = await getReportsByUser(user.id);

  if (reports.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400, marginBottom: 24 }}>
          Reports
        </h1>
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 16, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
            No reports generated yet
          </p>
          <p style={{ fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)", lineHeight: 1.6, maxWidth: 320, margin: "0 auto 24px" }}>
            Generate your first report from a client page. Claude writes it in your voice.
          </p>
          <Link href="/clients" style={{ fontSize: 13, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
            Go to clients →
          </Link>
        </div>
      </div>
    );
  }

  // Group by client
  const byClient: Record<string, { businessName: string; reports: typeof reports }> = {};
  for (const r of reports) {
    const cid = r.clientId;
    if (!byClient[cid]) {
      byClient[cid] = { businessName: r.client.businessName, reports: [] };
    }
    byClient[cid].reports.push(r);
  }

  const unsent = reports.filter((r) => !r.sentAt).length;

  return (
    <div className="max-w-2xl">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400 }}>
          Reports
        </h1>
        {unsent > 0 && (
          <span style={{
            fontSize: 11, color: "#C4973F", background: "#1a1808", border: "0.5px solid #C4973F30",
            borderRadius: 4, padding: "4px 10px", fontFamily: "var(--font-inter)",
          }}>
            {unsent} unsent
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(byClient).map(([clientId, { businessName, reports: clientReports }]) => (
          <div key={clientId}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
                {businessName}
              </p>
              <Link href={`/clients/${clientId}`} style={{ fontSize: 10, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}>
                View client →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clientReports.map((r) => (
                <div key={r.id} style={{
                  background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6,
                  padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "var(--font-inter)", fontWeight: 500, marginBottom: 3 }}>{r.title}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                      <span>{r.sentAt
                        ? `Sent ${new Date(r.sentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                        : "Draft — not sent"
                      }</span>
                      <span>{r.viewCount} view{r.viewCount !== 1 ? "s" : ""}</span>
                      {r.viewedAt && <span style={{ color: "#4CAF50" }}>✓ Viewed</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a
                      href={`${BASE_URL}/reports/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
                    >
                      Preview →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

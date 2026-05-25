import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getProposalById } from "@/lib/db/queries/proposals";
import { AnswerClient } from "./AnswerClient";

export const metadata = { title: "Answer Questions — Venn" };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";

export default async function ProposalAnswerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const proposal = await getProposalById(id);
  if (!proposal || proposal.userId !== user.id) notFound();

  return (
    <div className="max-w-2xl">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link
            href="/proposals"
            style={{ fontSize: 12, color: "#444440", textDecoration: "none", fontFamily: "var(--font-inter)" }}
          >
            ← Proposals
          </Link>
          <span style={{ color: "#1E1C18" }}>/</span>
          <span style={{ fontSize: 12, color: "#888580", fontFamily: "var(--font-inter)" }}>
            Questions
          </span>
        </div>
        <h1 style={{
          fontSize: 24, color: "#FFFDF8",
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          fontWeight: 400, margin: 0,
        }}>
          {proposal.lead.businessName}
        </h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
          <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)" }}>
            {proposal.title}
          </p>
          <a
            href={`${BASE_URL}/proposal/${proposal.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#C4973F", fontFamily: "var(--font-inter)", textDecoration: "none" }}
          >
            View proposal →
          </a>
        </div>
      </div>

      <AnswerClient
        proposalSlug={proposal.slug}
        questions={proposal.questions.map((q) => ({
          ...q,
          answeredAt: q.answeredAt?.toISOString() ?? null,
          createdAt: q.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

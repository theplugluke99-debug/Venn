import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, email, agency, teamSize, niche, monthlySpend, notes } = body;

  if (!name || !email || !niche) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Prefer authed user id; guest applications are also accepted
  const { userId: clerkId } = await auth();
  let dbUserId = "";

  if (clerkId) {
    const user = await db.user.findUnique({ where: { clerkId } });
    if (user) dbUserId = user.id;
  }

  await db.solopreneurApplication.create({
    data: {
      userId: dbUserId,
      email,
      name,
      agency: agency ?? null,
      teamSize: teamSize ?? null,
      niche,
      monthlySpend: monthlySpend ?? null,
      notes: notes ?? null,
    },
  });

  // Send admin notification email (non-blocking)
  sendAdminNotification({ name, email, agency, niche, teamSize, monthlySpend, notes }).catch(
    (err) => console.error("[apply] admin email failed:", err)
  );

  return Response.json({ success: true });
}

async function sendAdminNotification(data: {
  name: string;
  email: string;
  agency?: string;
  niche: string;
  teamSize?: string;
  monthlySpend?: string;
  notes?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: "Venn <noreply@venn.so>",
    to: adminEmail,
    subject: `New solopreneur application — ${data.name}`,
    html: `
      <p><strong>${data.name}</strong> (${data.email}) applied for the Solopreneur Programme.</p>
      <ul>
        <li><strong>Agency:</strong> ${data.agency || "—"}</li>
        <li><strong>Team size:</strong> ${data.teamSize || "—"}</li>
        <li><strong>Niche:</strong> ${data.niche}</li>
        <li><strong>Monthly spend:</strong> ${data.monthlySpend || "—"}</li>
      </ul>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/solopreneur">Review applications →</a></p>
    `,
  });
}

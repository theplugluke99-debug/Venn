import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { clientName, dealValue, leadId } = await request.json();
  if (!clientName || !dealValue) {
    return Response.json({ error: "Missing clientName or dealValue" }, { status: 400 });
  }

  await db.subscription.update({
    where: { userId: user.id },
    data: {
      dealClosed: true,
      dealClosedAt: new Date(),
      dealValue: parseFloat(String(dealValue)),
      dealClientName: clientName,
      dealLeadId: leadId ?? null,
    },
  });

  // Notify admin of deal close
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && process.env.RESEND_API_KEY) {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: adminEmail,
      subject: `Deal closed — ${user.name ?? user.email}`,
      html: `
        <p><strong>${user.name ?? user.email}</strong> just closed a deal on the Solopreneur Programme.</p>
        <ul>
          <li><strong>Client:</strong> ${clientName}</li>
          <li><strong>Value:</strong> £${dealValue}</li>
        </ul>
        <p>They should now be upgraded to Growth. <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/solopreneur">View admin panel →</a></p>
      `,
    }).catch(() => null);
  }

  return Response.json({ success: true });
}

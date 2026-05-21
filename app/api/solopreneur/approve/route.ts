import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { solopreneurApprovedHtml } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const { userId: clerkId } = await auth();

  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId } });
  if (!admin || admin.email !== adminEmail) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { applicationId } = await request.json();
  if (!applicationId) return Response.json({ error: "Missing applicationId" }, { status: 400 });

  const application = await db.solopreneurApplication.findUnique({ where: { id: applicationId } });
  if (!application) return Response.json({ error: "Not found" }, { status: 404 });

  await db.solopreneurApplication.update({
    where: { id: applicationId },
    data: { status: "approved" },
  });

  // Grant access if we can find the user
  if (application.userId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await db.subscription.upsert({
      where: { userId: application.userId },
      create: {
        userId: application.userId,
        plan: "solopreneur",
        status: "active",
        isSolopreneur: true,
        solopreneurApproved: true,
        solopreneurExpiry: expiryDate,
      },
      update: {
        plan: "solopreneur",
        status: "active",
        isSolopreneur: true,
        solopreneurApproved: true,
        solopreneurExpiry: expiryDate,
      },
    });
  }

  // Send approval email
  if (process.env.RESEND_API_KEY) {
    const expiryFormatted = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" })
      .format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: application.email,
      subject: "You're in — Venn Solopreneur Programme",
      html: solopreneurApprovedHtml(application.name, expiryFormatted),
    }).catch((err) => console.error("[approve] email failed:", err));
  }

  return Response.json({ success: true });
}

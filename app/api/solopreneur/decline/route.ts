import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";
import { solopreneurDeclinedHtml } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
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
    data: { status: "declined" },
  });

  if (process.env.RESEND_API_KEY) {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: application.email,
      subject: "Your Venn Solopreneur application",
      html: solopreneurDeclinedHtml(application.name),
    }).catch((err) => console.error("[decline] email failed:", err));
  }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/solopreneur/decline]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

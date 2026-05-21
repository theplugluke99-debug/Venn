import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getResend, FROM_ADDRESS } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  const { message } = await request.json();
  if (!message?.trim()) return Response.json({ error: "Message required" }, { status: 400 });

  await db.feedback.create({
    data: { userId: user.id, message: message.trim() },
  });

  // Notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && process.env.RESEND_API_KEY) {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: adminEmail,
      subject: `Feedback from ${user.name ?? user.email}`,
      html: `<p><strong>${user.name ?? user.email}</strong> sent feedback:</p><blockquote>${message}</blockquote>`,
    }).catch(() => null);
  }

  return Response.json({ success: true });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId } });
  if (!admin || admin.email !== process.env.ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const feedback = await db.feedback.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ feedback });
}

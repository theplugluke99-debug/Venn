import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminSolopreneurClient } from "./AdminSolopreneurClient";

export default async function AdminSolopreneurPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) redirect("/home");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.email !== adminEmail) redirect("/home");

  const applications = await db.solopreneurApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminSolopreneurClient applications={applications} />;
}

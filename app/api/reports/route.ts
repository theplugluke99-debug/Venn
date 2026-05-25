import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientById } from "@/lib/db/queries/clients";
import { createClientReport, getReportsByUser } from "@/lib/db/queries/clientReports";
import { logClientActivity } from "@/lib/db/queries/clients";
import { generateClientReport } from "@/lib/intelligence";
import type { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const reports = await getReportsByUser(user.id);
    return Response.json({ reports });
  } catch (err) {
    console.error("[GET /api/reports]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const body = await request.json() as {
      clientId: string;
      period: string;
      metrics?: Record<string, string>;
      nextPriorities?: string[];
    };

    if (!body.clientId || !body.period) {
      return Response.json({ error: "clientId and period required" }, { status: 400 });
    }

    const client = await getClientById(body.clientId);
    if (!client || client.userId !== user.id) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    const cardIdentity = user.cardIdentity;

    // Completed deliverables this period
    const periodStart = new Date();
    periodStart.setDate(1); // start of this month
    const completedDeliverables = client.deliverables.filter(
      (d) => d.status === "complete" && d.completedAt && new Date(d.completedAt) >= periodStart
    );

    // Check-in notes this period
    const checkInNotes = client.checkIns
      .filter((c) => c.completedAt && new Date(c.completedAt) >= periodStart && c.notes)
      .map((c) => c.notes!)
      .slice(0, 5);

    // Lead intel if connected
    const leadIntel = client.lead
      ? {
          googleRating: client.lead.googleRating,
          reviewCount: client.lead.reviewCount,
          observations: client.lead.observations,
        }
      : null;

    const content = await generateClientReport({
      client: {
        businessName: client.businessName,
        niche: client.niche,
        startDate: client.startDate,
      },
      period: body.period,
      completedDeliverables: completedDeliverables.map((d) => ({
        title: d.title,
        category: d.category,
        completedAt: d.completedAt,
      })),
      checkInNotes,
      metrics: body.metrics ?? {},
      nextPriorities: body.nextPriorities ?? [],
      cardIdentity: {
        agencyName: cardIdentity?.agencyName,
        agencyOwnerName: cardIdentity?.agencyOwnerName,
        writingStyle: cardIdentity?.writingStyle,
      },
      leadIntel,
    });

    const slug = nanoid(10);
    const title = `${body.period} — ${client.businessName}`;

    const report = await createClientReport({
      clientId: body.clientId,
      userId: user.id,
      slug,
      title,
      period: body.period,
      content: content as unknown as Prisma.InputJsonValue,
    });

    await logClientActivity({
      clientId: body.clientId,
      userId: user.id,
      type: "report_generated",
      title: `Report generated: ${title}`,
    }).catch(console.error);

    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://venn.so";
    return Response.json({ report, reportUrl: `${BASE_URL}/reports/${slug}` }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reports]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

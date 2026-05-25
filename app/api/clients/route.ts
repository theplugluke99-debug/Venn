import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientsByUser, createClient } from "@/lib/db/queries/clients";
import { calculateClientHealth } from "@/lib/agency/health";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const clients = await getClientsByUser(user.id);
    return Response.json({ clients });
  } catch (err) {
    console.error("[GET /api/clients]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const {
      businessName, ownerName, email, phone, website, niche, location,
      contractValue, billingCycle, startDate, contractEndDate, notes, leadId, proposalId,
    } = body as {
      businessName: string;
      ownerName?: string;
      email?: string;
      phone?: string;
      website?: string;
      niche?: string;
      location?: string;
      contractValue?: number;
      billingCycle?: string;
      startDate?: string;
      contractEndDate?: string;
      notes?: string;
      leadId?: string;
      proposalId?: string;
    };

    if (!businessName) return Response.json({ error: "businessName required" }, { status: 400 });

    const client = await createClient({
      userId: user.id,
      businessName,
      ownerName,
      email,
      phone,
      website,
      niche,
      location,
      contractValue,
      billingCycle,
      startDate: startDate ? new Date(startDate) : undefined,
      contractEndDate: contractEndDate ? new Date(contractEndDate) : undefined,
      notes,
      leadId,
      proposalId,
    });

    // Calculate initial health score
    await calculateClientHealth(client.id).catch(console.error);

    return Response.json({ client }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/clients]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

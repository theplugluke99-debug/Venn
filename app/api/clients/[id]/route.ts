import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getClientById, updateClient, deleteClient } from "@/lib/db/queries/clients";
import { calculateClientHealth } from "@/lib/agency/health";
import type { Prisma } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const client = await getClientById(id);
    if (!client || client.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Refresh health score
    const { score, signals } = await calculateClientHealth(id);
    return Response.json({ client: { ...client, healthScore: score, healthSignals: signals } });
  } catch (err) {
    console.error("[GET /api/clients/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const existing = await getClientById(id);
    if (!existing || existing.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json() as Prisma.ClientUpdateInput;
    const client = await updateClient(id, body);
    return Response.json({ client });
  } catch (err) {
    console.error("[PATCH /api/clients/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const existing = await getClientById(id);
    if (!existing || existing.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await deleteClient(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/clients/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

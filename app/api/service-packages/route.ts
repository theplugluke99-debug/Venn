import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getServicePackagesByUser, createServicePackage } from "@/lib/db/queries/servicePackages";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });
    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    const packages = await getServicePackagesByUser(user.id);
    return Response.json({ packages });
  } catch (err) {
    console.error("[GET /api/service-packages]", err);
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
    const { name, description, price, currency, features, isDefault } = body as {
      name: string;
      description?: string;
      price: number;
      currency?: string;
      features?: import("@prisma/client").Prisma.InputJsonValue;
      isDefault?: boolean;
    };

    if (!name || typeof price !== "number") {
      return Response.json({ error: "name and price are required" }, { status: 400 });
    }

    const pkg = await createServicePackage({
      userId: user.id,
      name,
      description,
      price,
      currency: currency ?? "GBP",
      features,
      isDefault: isDefault ?? false,
    });

    return Response.json({ package: pkg }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/service-packages]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

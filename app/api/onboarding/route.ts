import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { getUserByClerkId, upsertCardIdentity } from "@/lib/db/queries/users";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { agencyName, yourName, whatYouSell, whoYouSellTo, writingStyle, defaultAngle } = body;

    // Save the identity
    await upsertCardIdentity(user.id, {
      agencyName: agencyName?.trim(),
      agencyTagline: whatYouSell?.trim(),
      writingStyle: [
        yourName ? `Name: ${yourName}` : "",
        whatYouSell ? `Product: ${whatYouSell}` : "",
        whoYouSellTo ? `Target: ${whoYouSellTo}` : "",
        writingStyle ? `\nVoice: ${writingStyle}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      defaultAngle: defaultAngle ?? "pain",
    });

    // Mark onboarding complete via cookie
    const jar = await cookies();
    jar.set("venn_onboarded", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/onboarding]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

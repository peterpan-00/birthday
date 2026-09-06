import { NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";
import { songs } from "@/config/songs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authorization = await checkAuthorization();

    if (!authorization.isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!authorization.isAuthorized) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

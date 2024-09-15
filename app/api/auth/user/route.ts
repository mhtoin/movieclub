import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, session } = await validateRequest();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  return NextResponse.json(user, { status: 200 });
}

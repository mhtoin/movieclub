import { getCurrentSession } from "@/lib/authentication/session"
import { NextResponse } from "next/server"

export async function GET() {
  const { user } = await getCurrentSession()

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated" },
      { status: 401 },
    )
  }
  return NextResponse.json(user, { status: 200 })
}

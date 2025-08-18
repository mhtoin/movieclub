import { type NextRequest, NextResponse } from "next/server"
import { createShortlist, getAllShortLists } from "@/lib/shortlist"
import { getCurrentSession } from "@/lib/authentication/session"
export const dynamic = "force-dynamic"
export async function GET(_request: NextRequest) {
  try {
    const shortlists = await getAllShortLists()

    return NextResponse.json(shortlists, { status: 200 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 },
      )
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 },
  )
}

export async function POST() {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not authenticated" },
        { status: 401 },
      )
    }
    const shortlist = await createShortlist(user.id)

    return NextResponse.json(shortlist, { status: 201 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 },
      )
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 },
  )
}

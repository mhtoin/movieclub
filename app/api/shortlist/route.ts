import { type NextRequest, NextResponse } from 'next/server'
import { getAllShortLists } from '@/lib/shortlist'
export const dynamic = 'force-dynamic'
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
    { ok: false, message: 'Something went wrong!' },
    { status: 500 },
  )
}

import { updateShortlistState } from "@/lib/shortlist"
import { getCurrentSession } from "@/lib/authentication/session"
import { sseEmitter } from "@/lib/sse-events"
import type { Shortlist } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse<Shortlist>> {
  const params = await props.params
  const { isReady } = await request.json()

  // Get current user session
  const { user } = await getCurrentSession()

  // Update the shortlist state
  const res = await updateShortlistState(isReady, params.id)

  // Send SSE event to notify all connected clients about the ready status change
  if (user) {
    console.log("sending")
    sseEmitter.sendReadyStatusUpdate(params.id, user.id, isReady)
  }

  return NextResponse.json(res)
}

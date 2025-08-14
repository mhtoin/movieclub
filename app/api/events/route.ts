import { sseEmitter, type SSEEvent } from "@/lib/sse-events"

export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  const eventResponse = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = JSON.stringify({
        message: "SSE connection established",
      })
      controller.enqueue(encoder.encode(`data: ${initialMessage}\n\n`))

      // Listen for broadcast events
      const handleBroadcast = (event: SSEEvent) => {
        try {
          const eventData = JSON.stringify(event)
          controller.enqueue(encoder.encode(`event: ${event.eventType}\n`))
          controller.enqueue(encoder.encode(`data: ${eventData}\n\n`))
        } catch (error) {
          console.error("Error encoding SSE event:", error)
        }
      }

      // Subscribe to the SSE event emitter
      sseEmitter.on("broadcast", handleBroadcast)

      // Clean up when the connection is closed
      return () => {
        sseEmitter.off("broadcast", handleBroadcast)
      }
    },
  })

  return new Response(eventResponse, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  })
}

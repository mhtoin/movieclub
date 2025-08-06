import { NextRequest } from 'next/server'

// Define message types
interface SSEMessage {
  type: string
  queryKey?: string[]
  message?: string
  userId?: string
  [key: string]: unknown
}

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new Response('Missing userId parameter', { status: 400 })
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Store this controller so we can send events later
      connections.set(userId, controller)
      
      // Send initial connection message
      const data = JSON.stringify({ type: 'connected', userId })
      controller.enqueue(`data: ${data}\n\n`)
      
      console.log(`SSE connection established for user: ${userId}`)
    },
    cancel() {
      // Clean up when client disconnects
      connections.delete(userId)
      console.log(`SSE connection closed for user: ${userId}`)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}

// Function to broadcast messages to specific users or all users
export function broadcastToUser(userId: string, message: SSEMessage) {
  const controller = connections.get(userId)
  if (controller) {
    try {
      const data = JSON.stringify(message)
      controller.enqueue(`data: ${data}\n\n`)
      return true
    } catch (error) {
      console.error(`Failed to send message to user ${userId}:`, error)
      // Remove dead connection
      connections.delete(userId)
      return false
    }
  }
  return false
}

// Function to broadcast to all connected users
export function broadcastToAll(message: SSEMessage) {
  let successCount = 0
  for (const [userId, controller] of connections.entries()) {
    try {
      const data = JSON.stringify(message)
      controller.enqueue(`data: ${data}\n\n`)
      successCount++
    } catch (error) {
      console.error(`Failed to send message to user ${userId}:`, error)
      // Remove dead connection
      connections.delete(userId)
    }
  }
  return successCount
}

// Function to get active connections count
export function getActiveConnectionsCount() {
  return connections.size
}

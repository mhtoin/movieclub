import { EventEmitter } from "events"

// Simple in-memory event emitter for SSE
// In production, you might want to use Redis or another pub/sub system
class SSEEventEmitter extends EventEmitter {
  private static instance: SSEEventEmitter

  static getInstance(): SSEEventEmitter {
    if (!SSEEventEmitter.instance) {
      SSEEventEmitter.instance = new SSEEventEmitter()
    }
    return SSEEventEmitter.instance
  }

  // Send an event to all connected clients
  broadcast(eventType: string, data: Record<string, unknown>) {
    this.emit("broadcast", {
      eventType,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  // Send ready status update event
  sendReadyStatusUpdate(shortlistId: string, userId: string, isReady: boolean) {
    console.log("broadcasting", { shortlistId, userId, isReady })
    this.broadcast("ready-status-update", {
      shortlistId,
      userId,
      isReady,
    })
  }
}

export const sseEmitter = SSEEventEmitter.getInstance()

// Type definitions for SSE events
export interface SSEEvent {
  eventType: string
  data: Record<string, unknown>
  timestamp: string
}

export interface ReadyStatusUpdateEvent {
  shortlistId: string
  userId: string
  isReady: boolean
}

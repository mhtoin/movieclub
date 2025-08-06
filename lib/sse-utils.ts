// Utility functions for broadcasting SSE events
// Import this in your API routes to send real-time updates

interface SSEMessage {
  type: string
  queryKey?: string[]
  message?: string
  userId?: string
  [key: string]: unknown
}

// These functions will only work if the SSE route is imported somewhere
// The functions are re-exported from the events route to maintain the connection map

let broadcastToUser: (userId: string, message: SSEMessage) => boolean
let broadcastToAll: (message: SSEMessage) => number
let getActiveConnectionsCount: () => number

// Dynamically import the functions to avoid circular dependencies
const initializeBroadcast = async () => {
  try {
    const eventsModule = await import('../app/api/events/route')
    broadcastToUser = eventsModule.broadcastToUser
    broadcastToAll = eventsModule.broadcastToAll
    getActiveConnectionsCount = eventsModule.getActiveConnectionsCount
  } catch (error) {
    console.error('Failed to initialize SSE broadcast functions:', error)
  }
}

// Initialize on module load
initializeBroadcast()

// Wrapper functions that handle the async initialization
export const notifyUser = (userId: string, message: SSEMessage): boolean => {
  if (!broadcastToUser) {
    console.warn('SSE broadcast not initialized yet')
    return false
  }
  return broadcastToUser(userId, message)
}

export const notifyAll = (message: SSEMessage): number => {
  if (!broadcastToAll) {
    console.warn('SSE broadcast not initialized yet')
    return 0
  }
  return broadcastToAll(message)
}

export const getConnectionCount = (): number => {
  if (!getActiveConnectionsCount) {
    console.warn('SSE broadcast not initialized yet')
    return 0
  }
  return getActiveConnectionsCount()
}

// Helper functions for common use cases
export const notifyQueryInvalidation = (userId: string, queryKey: string[]) => {
  return notifyUser(userId, {
    type: 'query_invalidation',
    queryKey
  })
}

export const notifySuccess = (userId: string, message: string) => {
  return notifyUser(userId, {
    type: 'success',
    message
  })
}

export const notifyShortlistUpdate = (userIds: string[], queryKey: string[] = ['shortlists']) => {
  let successCount = 0
  for (const userId of userIds) {
    if (notifyQueryInvalidation(userId, queryKey)) {
      successCount++
    }
  }
  return successCount
}

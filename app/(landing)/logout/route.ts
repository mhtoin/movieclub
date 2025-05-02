import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from '@/lib/authentication/session'

export async function GET(): Promise<Response> {
  const { session } = await getCurrentSession()
  if (!session) {
    return new Response(null, { status: 401 })
  }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()
  return new Response(null, {
    status: 302,
    headers: { Location: '/' },
  })
}

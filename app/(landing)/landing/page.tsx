import { getCurrentSession } from '@/lib/authentication/session'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="no-scrollbar flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-2xl">You are logged in</p>
      </div>
    </main>
  )
}

import { getCurrentSession } from '@/lib/authentication/session'
import { Button } from 'components/ui/Button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { user } = await getCurrentSession()

  if (user) {
    redirect('/home')
  }
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-center text-4xl font-bold">
          Welcome to the Movie Club
        </h1>
        <Button asChild variant={'outline'}>
          <Link href={'/login/discord'}>Login with Discord</Link>
        </Button>
      </div>
    </div>
  )
}

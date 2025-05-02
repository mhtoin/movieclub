import Results from 'components/search/Results'
import { getCurrentSession } from 'lib/authentication/session'
import { redirect } from 'next/navigation'

export default async function SearchPage() {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/')
  }
  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-5 p-2">
      <Results />
    </main>
  )
}

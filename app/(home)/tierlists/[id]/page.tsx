import { getCurrentSession } from '@/lib/authentication/session'
import { getQueryClient } from '@/lib/getQueryClient'
import { getTierlist } from '@/lib/tierlists'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import TierContainer from 'components/tierlist/TierContainer'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { user } = await getCurrentSession()
  if (!user) {
    redirect('/')
  }
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['tierlists', params.id],
    queryFn: () => getTierlist(params.id),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="flex flex-col items-center gap-10 py-20 md:gap-5">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>Loading...</div>}>
          <TierContainer
            tierlistId={params.id}
            authorized={user.tierlistId === params.id}
          />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

import ExpandableSidebar from '@/components/common/ExpandableSidebar'
import ShortlistSidebarContent from '@/components/shortlist/ShortlistSidebarContent'
import { getQueryClient } from '@/lib/getQueryClient'
import { getAllShortlistsGroupedById } from '@/lib/shortlist'
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'

export default function ShortlistLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['shortlists'],
    queryFn: getAllShortlistsGroupedById,
  })
  return (
    <div className="flex h-screen flex-row overflow-hidden pt-16">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ExpandableSidebar>
            <ShortlistSidebarContent />
          </ExpandableSidebar>
        </Suspense>
        <Suspense>{children}</Suspense>
      </HydrationBoundary>
    </div>
  )
}

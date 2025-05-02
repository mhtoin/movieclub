import ExpandableSidebar from '@/components/common/ExpandableSidebar'
import SearchSidebarContent from '@/components/search/SearchSidebarContent'
import { getQueryClient } from '@/lib/getQueryClient'
import { searchMovies } from '@/lib/movies/queries'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'

export default async function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  void queryClient.prefetchInfiniteQuery({
    queryKey: ['search', 'with_watch_providers=8'],
    queryFn: async ({ pageParam = 1 }) => {
      return await searchMovies(pageParam, 'with_watch_providers=8')
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages: totalPages } = lastPage

      return page < totalPages ? page + 1 : undefined
    },
    pages: 2,
  })

  return (
    <div className="pt-16 flex flex-row h-screen overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ExpandableSidebar width="w-[36rem]">
            <SearchSidebarContent />
          </ExpandableSidebar>
        </Suspense>
        <Suspense>{children}</Suspense>
      </HydrationBoundary>
    </div>
  )
}

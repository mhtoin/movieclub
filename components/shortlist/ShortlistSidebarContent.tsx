'use client'
import { ParticipationButton } from 'components/raffle/ParticipationButton'
import { useGetWatchlistQuery, useValidateSession } from 'lib/hooks'

import {
  useSuspenseShortlistsQuery,
  useUpdateReadyStateMutation,
} from '@/lib/hooks'

import ShortListItem from '@/components/shortlist/ShortlistItem'
import UserAvatar from '@/components/shortlist/UserAvatar'
import { useUpdateParticipationMutation } from '@/lib/hooks'
import { InfoIcon } from 'lucide-react'

export default function ShortlistSidebarContent() {
  const { data: user } = useValidateSession()

  const { data: allShortlists } = useSuspenseShortlistsQuery()
  const userShortlist = user?.shortlistId
    ? allShortlists?.[user?.shortlistId]
    : null
  const readyStateMutation = useUpdateReadyStateMutation()
  const participationMutation = useUpdateParticipationMutation()
  const { data: watchlist } = useGetWatchlistQuery(user || null)
  return (
    <div className="flex flex-col items-center justify-center gap-5 ">
      <div className="bg-background flex flex-col items-center justify-center gap-10 z-20 w-full py-5">
        <div className="w-1/2 h-[1px] bg-secondary relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
            {userShortlist?.user?.name}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 bg-background ">
          <UserAvatar
            userShortlist={userShortlist}
            readyStateMutation={readyStateMutation}
          />
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-xs font-semibold">Participating</h3>
              <ParticipationButton
                checked={userShortlist?.participating}
                onChange={(e) => {
                  participationMutation.mutate({
                    userId: user?.id || '',
                    shortlistId: userShortlist?.id || '',
                    participating: e.target.checked,
                  })
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-xs font-semibold">Ready</h3>
              <ParticipationButton
                checked={userShortlist?.isReady}
                onChange={(e) => {
                  readyStateMutation.mutate({
                    userId: user?.id || '',
                    shortlistId: userShortlist?.id || '',
                    isReady: e.target.checked,
                  })
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 h-[1px] bg-secondary relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
            Movies
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar pb-10">
        {userShortlist?.requiresSelection &&
          userShortlist.selectedIndex === null && (
            <div className="flex flex-row items-center justify-center gap-2 bg-secondary p-2 rounded-md">
              <InfoIcon className="w-4 h-4" />
              <span>You can only have 1 candidate</span>
            </div>
          )}
        {userShortlist
          ? userShortlist.movies.map((movie, index) => (
              <ShortListItem
                key={`${userShortlist.id}-${movie.id}`}
                movie={movie}
                shortlistId={userShortlist.id}
                highlight={
                  (userShortlist.requiresSelection &&
                    userShortlist.selectedIndex === index) ||
                  false
                }
                requiresSelection={userShortlist.requiresSelection || false}
                removeFromShortList={user?.id === userShortlist.userId}
                index={index}
                showActions={true}
                isInWatchlist={watchlist?.some(
                  (watchlistItem) => watchlistItem.id === movie.tmdbId,
                )}
              />
            ))
          : null}
      </div>
    </div>
  )
}

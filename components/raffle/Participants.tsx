import UserAvatar from '@/components/shortlist/UserAvatar'
import {
  useShortlistsQuery,
  useUpdateParticipationMutation,
  useUpdateReadyStateMutation,
  useValidateSession,
} from '@/lib/hooks'
import { Lock, LockOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { ParticipationButton } from './ParticipationButton'

export default function Participants({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}) {
  const updateReadyState = useUpdateReadyStateMutation()
  const { mutate: updateParticipation } = useUpdateParticipationMutation()
  const { data: allShortlists } = useShortlistsQuery()
  const { data: currentUser } = useValidateSession()
  return (
    <div className="flex h-full w-full flex-col items-center gap-10 overflow-y-auto py-5">
      <div className="flex flex-col items-center justify-center gap-5">
        <h3 className="text-lg font-bold">Participants</h3>
        <Button
          variant={'outline'}
          size={'default'}
          onClick={() => setIsEditing(!isEditing)}
          className="flex flex-row items-center justify-center gap-2 py-5"
        >
          <span className="text-md">{!isEditing ? 'Edit' : 'Done'}</span>
          {isEditing ? (
            <Lock className="h-4 w-4" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        {allShortlists &&
          Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
            const participating = shortlist?.participating
            const user = shortlist?.user

            return (
              <div
                key={`avatar-${user?.id}-${participating}`}
                className="relative flex flex-col items-center justify-center gap-3 rounded-md border px-10 py-5"
              >
                <div className="absolute top-2 right-2">
                  {!isEditing ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <LockOpen className="h-5 w-5" />
                  )}
                </div>
                <span className={'text-center text-xs font-semibold'}>
                  {user?.name}
                </span>
                <UserAvatar
                  userShortlist={shortlist}
                  readyStateMutation={updateReadyState}
                  disabled={!isEditing}
                />
                <ParticipationButton
                  checked={participating}
                  disabled={!isEditing}
                  onChange={(e) => {
                    updateParticipation({
                      userId: currentUser?.id || '',
                      shortlistId: shortlistId,
                      participating: e.target.checked,
                    })
                  }}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

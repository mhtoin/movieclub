import { Button } from '@/components/ui/Button'
import type { UserShortlist } from '@/types/shortlist.type'
import type { UseMutationResult } from '@tanstack/react-query'

export default function UserAvatar({
  userShortlist,
  readyStateMutation,
  disabled = false,
}: {
  userShortlist: UserShortlist | null
  readyStateMutation: UseMutationResult<
    unknown,
    Error,
    { shortlistId: string; isReady: boolean; userId: string },
    unknown
  >
  disabled?: boolean
}) {
  return (
    <Button
      variant={'outline'}
      size={'avatar'}
      className={`h-14 w-14 flex justify-center transition-colors ${
        disabled ? '' : 'hover:opacity-70'
      } ${readyStateMutation.isPending ? 'animate-pulse' : ''} relative`}
      key={`avatar-${userShortlist?.userId}`}
      onClick={() => {
        if (userShortlist && !disabled) {
          readyStateMutation.mutate({
            shortlistId: userShortlist.id,
            isReady: !userShortlist.isReady,
            userId: userShortlist.userId,
          })
        }
      }}
    >
      <svg
        className={'absolute z-50 inset-0 w-full h-full text-success'}
        viewBox="0 0 100 100"
      >
        <title>Ready</title>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={userShortlist?.isReady ? '0' : '1'}
          style={{
            transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease',
          }}
        />
      </svg>
      <svg
        className={'absolute z-40 inset-0 w-full h-full text-error'}
        viewBox="0 0 100 100"
      >
        <title>Ready</title>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          pathLength="1"
        />
      </svg>
      <img
        src={userShortlist?.user?.image}
        alt=""
        key={`profile-img-${userShortlist?.userId}`}
        className="relative z-10"
      />
    </Button>
  )
}

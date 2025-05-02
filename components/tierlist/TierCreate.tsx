import { useMutation } from '@tanstack/react-query'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { getQueryClient } from 'lib/getQueryClient'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function TierCreate({ tierlistId }: { tierlistId: string }) {
  const queryClient = getQueryClient()
  const [tierName, setTierName] = useState('')
  const [createFormState, setCreateFormState] = useState<'closed' | 'open'>(
    'closed',
  )
  const tierlistMutate = useMutation({
    mutationFn: async (tierName: string) => {
      await fetch(`/api/tierlists/${tierlistId}`, {
        method: 'POST',
        body: JSON.stringify({ tierName }),
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tierlists', tierlistId] })
      setCreateFormState('closed')
      setTierName('')
    },
  })

  const handleCreateTier = () => {
    if (createFormState === 'open') {
      tierlistMutate.mutate(tierName)
    } else {
      setCreateFormState('open')
    }
  }
  return (
    <div
      className={`bg-accent/80 hidden w-24 items-center justify-center rounded-tl-md rounded-bl-md border p-2 transition-all duration-300 md:flex ${
        createFormState === 'open' ? 'h-[300px]' : 'h-24'
      }`}
    >
      <form
        className="flex flex-col items-center justify-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        {createFormState === 'open' && (
          <>
            <label
              htmlFor="tier-name"
              className="text-muted-foreground text-sm"
            >
              Tier name
            </label>
            <Input
              id="tier-name"
              className="w-full max-w-xs text-center"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
            />
          </>
        )}
        <Button
          variant={createFormState === 'open' ? 'outline' : 'ghost'}
          size={createFormState === 'open' ? 'sm' : 'icon'}
          onClick={handleCreateTier}
          disabled={tierlistMutate.isPending}
          isLoading={tierlistMutate.isPending}
        >
          {createFormState === 'open' ? (
            <span className="text-sm">Create</span>
          ) : (
            <Plus />
          )}
        </Button>
      </form>
    </div>
  )
}

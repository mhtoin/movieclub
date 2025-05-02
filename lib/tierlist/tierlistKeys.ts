import type { TierlistWithTiers } from '@/types/tierlist.type'
import { queryOptions } from '@tanstack/react-query'

export const tierlistKeys = {
  all: () => ['tierlists'] as const,
  byId: (id: string) =>
    queryOptions({
      queryKey: ['tierlists', id],
      queryFn: async (): Promise<TierlistWithTiers> => {
        const res = await fetch(`/api/tierlists/${id}`)
        return res.json()
      },
    }),
}

'use client'
import { ProviderCheckbox } from '@/components/search/ProviderCheckbox'
import { useGetWatchProvidersQuery } from '@/lib/hooks'
import type { Provider } from '@/types/tmdb.type'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
export default function Providers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const watchProviders =
    searchParams.get('with_watch_providers')?.split('|') || []
  const { data: providers, status: providersStatus } =
    useGetWatchProvidersQuery()

  const handleProviderSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('query')
    const providers = params.get('with_watch_providers')?.split('|') || []

    if (providers.includes(value)) {
      const newProviders = providers.filter((provider) => provider !== value)

      if (newProviders.length === 0) {
        params.delete('with_watch_providers')
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        })
        return
      }

      params.set('with_watch_providers', newProviders.join('|'))
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
    } else {
      const newProviders = [...providers, value]
      params.set('with_watch_providers', newProviders.join('|'))
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
    }
  }
  return (
    <div className="no-scrollbar flex h-full w-full flex-row flex-wrap gap-4 overflow-visible overflow-x-scroll px-1 py-2">
      {providers && providersStatus === 'success'
        ? providers?.map((provider: Provider) => {
            return (
              <ProviderCheckbox
                provider={provider}
                key={provider.provider_id}
                handleClick={handleProviderSelect}
                defaultChecked={watchProviders.includes(
                  provider.provider_id.toString(),
                )}
              />
            )
          })
        : Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="bg-card h-10 w-10 animate-pulse rounded-md lg:h-12 lg:w-12"
            />
          ))}
    </div>
  )
}

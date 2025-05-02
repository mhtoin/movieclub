import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useViewMode() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const viewMode = searchParams.get('viewMode')

  const setViewMode = useCallback(
    (mode: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('viewMode', mode)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return { viewMode, setViewMode }
}

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export function useViewMode() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [viewMode, setLocalViewMode] = useState(
    searchParams.get("viewMode") || "details",
  )

  const setViewMode = useCallback(
    (mode: string) => {
      setLocalViewMode(mode) // Update local state immediately
      const params = new URLSearchParams(searchParams.toString())
      params.set("viewMode", mode)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  useEffect(() => {
    // Sync local state with URL changes
    setLocalViewMode(searchParams.get("viewMode") || "details")
  }, [searchParams])

  return { viewMode, setViewMode }
}

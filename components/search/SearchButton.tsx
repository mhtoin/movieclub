'use client'

import RecommendedTab from '@/components/search/RecommendedTab'
import ResultTab from '@/components/search/ResultTab'
import SkeletonRecommendedTab from '@/components/search/SkeletonRecommendedTab'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { getQueryClient } from '@/lib/getQueryClient'
import { SEARCH_ROUTE } from '@/lib/globals'
import { useDebounce, useIsMobile, useValidateSession } from '@/lib/hooks'
import { userKeys } from '@/lib/users/userKeys'
import { useDialogStore } from '@/stores/useDialogStore'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Button } from 'components/ui/Button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

export default function SearchButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { data: user } = useValidateSession()
  const { setInitialRoute } = useDialogStore()
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState(searchParams.get('query') || '')
  const showOnlyAvailable = searchParams.get('showOnlyAvailable') === 'true'
  const [activeTab, setActiveTab] = useState<'results' | 'recommended'>(
    (searchParams.get('query')?.length ?? 0) > 0 ? 'results' : 'recommended',
  )
  const modalRef = useRef<HTMLDivElement>(null)
  const queryClient = getQueryClient()

  useEffect(() => {
    const currentQuery = searchParams.get('query') || ''
    setInputValue(currentQuery)

    // Maintain focus after URL parameter updates
    if (inputRef.current?.matches(':focus')) {
      inputRef.current.focus()
    }
  }, [searchParams])

  // Effect to invalidate the search query when showOnlyAvailable changes
  useEffect(() => {
    if (inputValue.length > 0) {
      // Invalidate and refetch the search query
      queryClient.invalidateQueries({
        queryKey: ['search', inputValue, showOnlyAvailable.toString()],
      })
    }
  }, [showOnlyAvailable, inputValue, queryClient])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        params.set('showOnlyAvailable', 'true')
        setOpen(true)

        inputRef.current?.focus()
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    document.addEventListener('keyup', up)
    return () => document.removeEventListener('keydown', down)
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('showOnlyAvailable', 'true')
        setOpen(true)

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }
  }, [pathname, router, searchParams])

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('query', value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleClose = () => {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('query')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleShowOnlyAvailable = (value: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('showOnlyAvailable', value.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const debouncedSearch = useDebounce(handleSearch, 500)

  if (isMobile) {
    return (
      <Button
        onClick={() => {
          setInitialRoute(pathname)
          router.push(`/${SEARCH_ROUTE}`)
        }}
        variant={'ghost'}
        size={'icon'}
        className="rounded-full p-0"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      <div
        ref={modalRef}
        className={`bg-input hover:bg-input/80 fixed top-4 left-1/2 z-20 flex h-10 w-[300px] -translate-x-1/2 flex-col gap-5 rounded-md border px-4 transition-all duration-300 ${
          open ? 'h-[90vh] max-h-[90vh] w-[600px] py-2' : ''
        }`}
      >
        <div className="relative flex h-full flex-col gap-2">
          <div
            className={`flex h-[38px] items-center justify-center bg-transparent px-2 ${
              open ? 'rounded-md border' : ''
            } ${inputRef.current?.matches(':focus') ? 'border-2' : ''}`}
          >
            <Input
              placeholder="Search movies..."
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                const nextValue = e.target.value

                setInputValue(nextValue)
                debouncedSearch(nextValue)
                if (activeTab !== 'results' && nextValue.length > 0) {
                  setActiveTab('results')
                }

                if (activeTab === 'results' && nextValue.length === 0) {
                  setActiveTab('recommended')
                }
              }}
              onFocus={() => setOpen(true)}
              onMouseEnter={() => {
                // prefetch recommended movies
                queryClient.prefetchQuery(userKeys.recommended(user?.id ?? ''))
              }}
              className="z-20 w-full flex-1 border-none bg-transparent outline-hidden focus:outline-hidden focus:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <kbd className="bg-muted text-muted-foreground pointer-events-none z-20 inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          {open && (
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as 'results' | 'recommended')
              }}
              activationMode="automatic"
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center gap-2 overflow-hidden bg-transparent">
                <div className="flex h-full w-full overflow-hidden bg-transparent">
                  <TabsList className="flex h-[38px] w-full flex-row items-center justify-between bg-transparent">
                    <div className="flex flex-row gap-2 bg-transparent">
                      <TabsTrigger
                        value="recommended"
                        className="bg-background/40 data-[state=active]:bg-accent border-border data-[state=active]:text-accent-foreground border-b"
                      >
                        Recommended
                      </TabsTrigger>
                      <TabsTrigger
                        value="results"
                        className="bg-background/40 data-[state=active]:bg-accent border-border data-[state=active]:text-accent-foreground border-b"
                      >
                        Results
                      </TabsTrigger>
                    </div>
                    <div className="flex flex-row items-center gap-2 bg-transparent">
                      <Input
                        type="checkbox"
                        className="accent-accent h-4 w-4"
                        checked={showOnlyAvailable}
                        onChange={(e) => {
                          handleShowOnlyAvailable(e.target.checked)
                        }}
                      />
                      <span className="text-muted-foreground text-sm">
                        Show only available
                      </span>
                    </div>
                  </TabsList>
                </div>
                <div className="bg-accent h-0.5 w-full" />
                <Suspense fallback={null}>
                  <ResultTab />
                </Suspense>
                <Suspense fallback={<SkeletonRecommendedTab />}>
                  <RecommendedTab />
                </Suspense>
              </div>
            </Tabs>
          )}
        </div>
      </div>

      {open && (
        <div
          className="bg-background/50 fixed top-0 left-0 z-10 h-screen w-screen backdrop-blur-xs"
          onClick={handleClose}
          onKeyDown={handleClose}
        />
      )}
    </>
  )
}

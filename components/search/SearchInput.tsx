'use client'

import { getKeyWord } from '@/lib/movies/queries'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import KeywordCombobox from './KeywordCombobox'
import KeywordTag from './KeywordTag'

export default function SearchInput({ type }: { type: 'discover' | 'search' }) {
  const router = useRouter()
  const pathname = usePathname()

  /**
   * Get the query params for each part of the search
   */
  const searchParams = useSearchParams()
  const keywordArr = useMemo(
    () => searchParams.get('with_keywords')?.split(',') ?? [],
    [searchParams],
  )
  const [value, setValue] = useState('')

  /**
   * Will contain the ids for keywords
   */

  /**
   * Holds the names of the keywords, mapped from the ids and used to display the selected keywords
   */
  const [keywords, setKeywords] = useState<Array<{ id: number; name: string }>>(
    [],
  )

  const queryClient = useQueryClient()

  useEffect(() => {
    const fetchKeywords = async () => {
      // Reset keywords state to match URL parameters
      const newKeywords: Array<{ id: number; name: string }> = []

      for (const keyword of keywordArr) {
        if (keyword) {
          // Skip empty strings
          const data = await queryClient.ensureQueryData({
            queryKey: ['keywordSearch', keyword],
            queryFn: () => getKeyWord(keyword),
          })

          if (data && !newKeywords.find((kw) => kw.id === data?.id)) {
            newKeywords.push(data)
          }
        }
      }

      // Replace the entire keywords state with the new array
      setKeywords(newKeywords)
    }

    fetchKeywords()
  }, [keywordArr, queryClient]) // Remove 'keywords' from dependency array

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    /**
     * Since searching by title uses a different endpoint, we need to wipe the search params clean and just provide the query
     */
    const params = new URLSearchParams()
    if (type === 'search') {
      params.set('query', value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeywordSelect = async (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentKeywords = searchParams.get('with_keywords')?.split(',') ?? []
    params.set('with_keywords', [...currentKeywords, value].join(','))
    const data = await queryClient.ensureQueryData({
      queryKey: ['keywordSearch', value],
      queryFn: () => getKeyWord(value),
    })

    if (data) {
      setKeywords([...keywords, data])
    }
    //setKeywords([...keywords, value]);

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeywordRemove = (keyword: { id: number; name: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentKeywords = searchParams.get('with_keywords')?.split(',') ?? []

    // Convert string IDs to numbers for comparison
    const updatedKeywords = currentKeywords.filter(
      (kw) => Number(kw) !== keyword.id,
    )

    if (updatedKeywords.length === 0) {
      params.delete('with_keywords')
    } else {
      params.set('with_keywords', updatedKeywords.join(','))
    }
    const updatedState = keywords.filter((kw) => kw.id !== keyword.id)

    setKeywords(updatedState)

    router.push(`${pathname}?${params.toString()}`)
  }

  if (type === 'discover') {
    return (
      <form
        onSubmit={handleSubmit}
        className="relative w-full min-h-12 flex flex-col gap-2 border border-border/80 rounded-lg transition-all duration-300 bg-input p-2"
      >
        <div className="flex items-center">
          <div className="grow">
            <KeywordCombobox handleSelect={handleKeywordSelect} />
          </div>
          {keywords.length > 0 && (
            <Button variant={'ghost'} type="submit" className="ml-2">
              <MagnifyingGlassIcon />
            </Button>
          )}
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 pb-1">
            {keywords.map((keyword) => (
              <KeywordTag
                key={keyword.id}
                keyword={keyword}
                handleClick={handleKeywordRemove}
              />
            ))}
          </div>
        )}
      </form>
    )
  }

  return (
    <form
      className="lg:py-7 relative lg:h-12 flex gap-2 border border-border/80 rounded-lg rounded-tl-none items-center group focus-visible:ring-offset-2 bg-input"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        placeholder="Search movies by title"
        className="border-none ring-0 outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 bg-input text-sm placeholder:text-sm w-full text-foreground"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button variant={'ghost'} type="submit">
        <MagnifyingGlassIcon />
      </Button>
    </form>
  )
}

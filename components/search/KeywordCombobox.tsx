import { searchKeywords } from '@/lib/movies/queries'
import * as Ariakit from '@ariakit/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function KeywordCombobox({
  handleSelect,
}: {
  handleSelect: (value: string) => void
}) {
  const combobox = Ariakit.useComboboxStore()
  const searchValue = Ariakit.useStoreState(combobox, 'value')
  const { data: keywords } = useInfiniteQuery({
    queryKey: ['keywords', searchValue],
    enabled: searchValue.length > 2,
    queryFn: () => searchKeywords(searchValue),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
    },
    initialPageParam: 1,
  })

  const [inputValue, setInputValue] = useState('')

  const handleSelectionComplete = (value: string) => {
    handleSelect(value)
    setInputValue('')
  }

  return (
    <Ariakit.ComboboxProvider
      setSelectedValue={(value) => {
        handleSelectionComplete(value.toString())
      }}
    >
      <Ariakit.Combobox
        value={inputValue}
        setValueOnChange={(value) => {
          const target = value.target as HTMLInputElement

          combobox.setValue(target.value)
          setInputValue(target.value)
          return true
        }}
        placeholder="Search for a keyword"
        className="text-foreground placeholder:text-foreground/70 bg-input h-10 w-full rounded-md border border-none px-3 py-2 text-xs ring-0 outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 lg:text-sm"
      />

      <Ariakit.ComboboxPopover
        gutter={4}
        sameWidth
        className="popover bg-background max-h-[min(var(--popover-available-height, 300px), 300px)] text-foreground z-50 flex flex-col items-start gap-2 overflow-auto overscroll-contain rounded-lg border border-solid p-2 [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
      >
        {keywords?.pages.map((page) =>
          page.results.map((keyword: { id: number; name: string }) => (
            <Ariakit.ComboboxItem
              key={keyword.id}
              value={keyword.id.toString()}
              className="hover:bg-secondary flex cursor-default items-center gap-2 rounded p-2 outline-[none]!"
            >
              {keyword.name}
            </Ariakit.ComboboxItem>
          )),
        ) ?? 'No results'}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  )
}

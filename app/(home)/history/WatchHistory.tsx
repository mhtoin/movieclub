"use client"
import { Search } from "lucide-react"
import { Suspense, useState } from "react"

import { Input } from "components/ui/Input"
import WatchHistoryItems from "./WatchHistoryItems"
import WatchHistorySkeleton from "./WatchHistorySkeleton"
import { useDebouncedValue } from "@/lib/hooks"

interface WatchHistoryProps {
  search: string
  setSearch: (search: string) => void
  debouncedSearch: string
}

function WatchHistoryContent({
  search,
  setSearch,
  debouncedSearch,
}: WatchHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {debouncedSearch.trim() && (
        <div className="border-l-4 border-primary pl-4">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <p className="text-sm text-muted-foreground">
            Showing results for &ldquo;{debouncedSearch}&rdquo;
          </p>
        </div>
      )}

      <Suspense fallback={<WatchHistorySkeleton />}>
        <WatchHistoryItems search={debouncedSearch} />
      </Suspense>
    </div>
  )
}

export default function WatchHistory() {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebouncedValue(search, 300)

  return (
    <WatchHistoryContent
      search={search}
      setSearch={setSearch}
      debouncedSearch={debouncedSearch}
    />
  )
}

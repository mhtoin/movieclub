'use client'

import { useWatchedMoviesQuery } from '@/lib/hooks'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'
import HistoryList from './HistoryList'

export default function HistoryContainer() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: movies, isLoading, error } = useWatchedMoviesQuery(searchTerm)

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading watch history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movies List */}
      {!isLoading && movies && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {movies.length} movie{movies.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <HistoryList movies={movies} />
        </>
      )}

      {/* Empty State */}
      {!isLoading && movies && movies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No movies found matching your search.' : 'No movies watched yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
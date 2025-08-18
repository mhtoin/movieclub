'use client'

import type { MovieWithUser } from '@/types/movie.type'
import HistoryMovieCard from './HistoryMovieCard'

interface HistoryListProps {
  movies: MovieWithUser[]
}

export default function HistoryList({ movies }: HistoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <HistoryMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
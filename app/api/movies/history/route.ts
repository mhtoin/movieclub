import { getWatchedMovies } from '@/lib/movies/movies'
import type { MovieWithUser } from '@/types/movie.type'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<{ movies: MovieWithUser[]; total: number; page: number; totalPages: number } | { ok: boolean; message: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const movies = await getWatchedMovies()
    
    // Filter by search term if provided
    let filteredMovies = movies
    if (search) {
      const searchLower = search.toLowerCase()
      filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.original_title.toLowerCase().includes(searchLower)
      )
    }

    // Sort by watchDate descending (most recent first)
    const sortedMovies = filteredMovies.sort((a, b) => {
      if (!a.watchDate) return 1
      if (!b.watchDate) return -1
      return b.watchDate.localeCompare(a.watchDate)
    })

    // Pagination
    const total = sortedMovies.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedMovies = sortedMovies.slice(offset, offset + limit)

    return NextResponse.json({
      movies: paginatedMovies,
      total,
      page,
      totalPages
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching watched movies:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { ok: false, message: 'An unknown error occurred' },
      { status: 500 },
    )
  }
}
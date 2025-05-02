import type { Video } from '@/types/tmdb.type'
import { getCurrentSession } from './authentication/session'

export const revalidate = 10

export async function getAdditionalInfo(tmdbId: number) {
  const tmdbDetailsRes = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=${'en-US'}&append_to_response=videos,watch/providers`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
      },
    },
  )

  const tmdbDetails = await tmdbDetailsRes.json()

  const trailers = tmdbDetails.videos?.results
    .filter(
      (video: Video) =>
        video.type === 'Trailer' && video.official && video.site === 'YouTube',
    )
    .map((trailer: Video) => {
      return {
        name: trailer.name,
        id: trailer.id,
        key: trailer.key,
      }
    })

  const watchProviders = tmdbDetails['watch/providers']?.results?.FI

  return {
    trailers: trailers,
    watchProviders: watchProviders,
    tagline: tmdbDetails.tagline,
  }
}

export async function getWatchlist() {
  const { user } = await getCurrentSession()

  if (!user) {
    throw new Error('User not authenticated')
  }

  let pagesLeft = true
  let page = 1
  const movies = []

  do {
    const watchlist = await fetch(
      `https://api.themoviedb.org/3/account/${user.accountId}/watchlist/movies?language=en-US&page=${page}&session_id=${user.sessionId}&sort_by=created_at.asc`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
        },
        cache: 'no-store',
      },
    )

    const data = await watchlist.json()
    const results = data?.results ? data.results : []
    movies.push(results)

    const pages = data?.total_pages ? data.total_pages : ''

    if (pages && pages >= page) {
      page++
    } else {
      pagesLeft = false
    }
  } while (pagesLeft)

  return movies.flat()
}

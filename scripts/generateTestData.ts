import { createDbMovie } from '@/lib/createDbMovie'
import { formatISO, previousWednesday } from 'date-fns'
import prisma from '../lib/prisma'
import type { TMDBMovieResponse } from '../types/tmdb.type'
function generateWatchDates(count: number) {
  // get wednesday of current week
  const dates: Array<string> = []
  const today = new Date()
  let startDate = previousWednesday(today)
  for (let i = 0; i < count; i++) {
    dates.push(formatISO(startDate, { representation: 'date' }))
    startDate = previousWednesday(startDate)
  }
  return dates
}

async function generateTestData() {
  const users = await prisma.user.findMany()
  // delete all movies
  await prisma.movie.deleteMany()
  await prisma.shortlist.deleteMany()
  const movies: TMDBMovieResponse[] = []

  for (let i = 1; i < 5; i++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8%7C323%7C496`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      },
    )
    const data = await response.json()
    movies.push(...data.results)
  }

  const watchDates = generateWatchDates(movies.length)

  // take 3 * users.length movies out of the movies array and allocate them to shortlists
  const shortlistMovies = movies.slice(0, 3 * users.length)

  const shortlists: Array<Array<string>> = Array.from(
    { length: users.length },
    () => [],
  )
  for (const [index, movie] of shortlistMovies.entries()) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      },
    )
    const data = await res.json()
    const dbMovie = await createDbMovie(data)

    const createdMovie = await prisma.movie.create({
      data: dbMovie,
    })

    shortlists[index % users.length].push(createdMovie.id)
  }

  const createdShortlists: Array<{
    id: string
    userId: string
    movieIDs: string[]
    isReady: boolean
    requiresSelection: boolean | null
    selectedIndex: number | null
    participating: boolean
  }> = []

  for (const [index, shortlist] of shortlists.entries()) {
    const createdShortlist = await prisma.shortlist.create({
      data: {
        movieIDs: shortlist,
        userId: users[index].id,
      },
    })
    createdShortlists.push(createdShortlist)
  }

  for (const shortlist of createdShortlists) {
    await prisma.user.update({
      where: { id: shortlist.userId },
      data: { shortlistId: shortlist.id },
    })
  }
  const watchedMovies = movies.slice(3 * users.length + 1)

  for (const [index, movie] of watchedMovies.entries()) {
    // get the details
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      },
    )
    const data = await res.json()
    const dbMovie = await createDbMovie(data)
    const randomUser = users[Math.floor(Math.random() * users.length)]
    dbMovie.watchDate = watchDates[index]
    dbMovie.user = { connect: { id: randomUser.id } }

    // save to db
    try {
      await prisma.movie.create({
        data: dbMovie,
      })
    } catch (error) {
      console.log('error', error)
    }
  }
}

generateTestData()

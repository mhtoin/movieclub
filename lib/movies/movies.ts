"use server"
import type { UserChartData } from "@/types/common.type"
import type { MovieWithUser } from "@/types/movie.type"
import type { Movie, User } from "@prisma/client"
import { Prisma } from "@prisma/client"
import { format, formatISO, isWednesday, nextWednesday, set } from "date-fns"
import prisma from "lib/prisma"
import { addMovieToUserRadarr } from "../radarr"
import {
  getAllShortLists,
  removeMovieFromShortlist,
  updateShortlistSelectionStatus,
  updateShortlistState,
} from "../shortlist"
import {
  countByKey,
  getNextMonth,
  groupBy,
  sample,
  sendNotification,
  shuffle,
  sortByISODate,
} from "../utils"

type ChosenMovie = {
  user: User
  shortlistId: string
  movie: Movie
}

export async function getMostRecentMovieOfTheWeek() {
  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
    orderBy: {
      watchDate: "desc",
    },
    include: {
      user: true,
      reviews: {
        select: {
          id: true,
          content: true,
          user: true,
          rating: true,
          userId: true,
          timestamp: true,
          movieId: true,
        },
      },
    },
    take: 1,
  })

  return movies[0]
}

export async function getMoviesOfOfTheWeekByMonthGrouped() {
  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
    orderBy: {
      watchDate: "desc",
    },
    include: {
      user: true,
      reviews: true,
    },
  })

  const grouped = groupBy(movies.slice(1), (movie) =>
    movie.watchDate?.split("-").splice(0, 2).join("-"),
  )

  return grouped
}

export async function getLastMonth() {
  const lastMovie = await prisma.movie.findFirst({
    where: {
      watchDate: {
        not: null,
      },
    },
    orderBy: {
      watchDate: "asc",
    },
    select: {
      watchDate: true,
    },
  })

  if (!lastMovie?.watchDate) {
    return null
  }

  return lastMovie.watchDate.split("-").splice(0, 2).join("-")
}

export async function getMoviesOfTheWeekByMonth(month: string) {
  const currentMonth = format(new Date(), "yyyy-MM")
  const targetMonth = month || currentMonth

  const lastMonth = await getLastMonth()

  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        contains: targetMonth,
      },
    },
    orderBy: {
      watchDate: "desc",
    },
    include: {
      user: true,
      reviews: {
        select: {
          id: true,
          content: true,
          user: true,
          rating: true,
          userId: true,
          timestamp: true,
          movieId: true,
        },
      },
    },
  })

  if (!movies) {
    return {
      month: null,
      movies: null,
      lastMonth: null,
    }
  }

  if (currentMonth === targetMonth && movies.length === 1) {
    // most recent is the same as all of the movies of the month
    // so we need to skip ahead
    const nextMonth = getNextMonth(targetMonth)
    const nextMonthMovies = await prisma.movie.findMany({
      where: {
        watchDate: {
          contains: nextMonth,
        },
      },
      orderBy: {
        watchDate: "desc",
      },
      include: {
        user: true,
        reviews: {
          select: {
            id: true,
            content: true,
            user: true,
            rating: true,
            userId: true,
            timestamp: true,
            movieId: true,
          },
        },
      },
    })

    return {
      month: nextMonth,
      movies: nextMonthMovies,
      lastMonth: lastMonth,
    }
  }

  // check if the most recent movie would be included in the movies of the month
  const mostRecentMovie = await prisma.movie.findFirst({
    where: {
      watchDate: {
        not: null,
      },
    },
    orderBy: {
      watchDate: "desc",
    },
  })

  if (movies.some((movie) => movie.id === mostRecentMovie?.id)) {
    return {
      month: targetMonth,
      movies: movies.slice(1),
      lastMonth: lastMonth,
    }
  }

  return {
    month: targetMonth,
    movies: movies,
    lastMonth: lastMonth,
  }
}

export async function getMoviesUntil(date: string) {
  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        lte: date,
      },
    },
    include: {
      user: true,
      reviews: {
        select: {
          id: true,
          content: true,
          user: true,
          rating: true,
          userId: true,
          timestamp: true,
          movieId: true,
        },
      },
    },
  })

  const sorted = movies.sort((a, b) =>
    sortByISODate(a.watchDate ?? "", b.watchDate ?? "", "desc"),
  )

  const grouped = groupBy(
    sorted,
    (movie) => movie?.watchDate?.split("-").splice(0, 2).join("-") ?? "",
  )

  return grouped
}

export async function getAllMoviesOfTheWeek() {
  const nextMovieDate = set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  const now = isWednesday(new Date())
    ? set(new Date(), { hours: 19, minutes: 0, seconds: 0, milliseconds: 0 })
    : nextMovieDate

  const movies = await prisma.movie.findMany({
    where: {
      movieOfTheWeek: {
        lte: now,
      },
    },
    include: {
      reviews: {
        select: {
          id: true,
          content: true,
          user: true,
          rating: true,
          userId: true,
          timestamp: true,
          movieId: true,
        },
      },
      user: true,
    },
  })

  return movies
}

export async function getWatchedMovies() {
  return await prisma.movie.findMany({
    where: {
      watchDate: { not: null },
    },
    include: {
      user: true,
    },
  })
}

export async function getMoviesOfTheWeek() {
  return await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
    include: {
      user: true,
      reviews: {
        select: {
          id: true,
          content: true,
          user: true,
          rating: true,
          userId: true,
          timestamp: true,
          movieId: true,
        },
      },
    },
  })
}

export async function createReview(
  review: string,
  userId: string,
  movieId: string,
) {
  const data = await prisma.review.create({
    data: {
      content: review,
      userId: userId,
      movieId: movieId,
      timestamp: format(new Date(), "dd/MM/yyyy H:m"),
      rating: 0,
    },
  })

  return data
}

export async function simulateRaffle(repetitions: number) {
  const shortlists = await getAllShortLists()
  const resultArr: ChosenMovie[] = []
  let lastChosen: User
  for (let i = 0; i < repetitions; i++) {
    const movies = shortlists.flatMap((shortlist) => {
      if (i > 15 && shortlist.user.id === lastChosen?.id) {
        return {
          user: shortlist.user,
          shortlistId: shortlist.id,
          movie: shortlist.movies[0],
        }
      }
      if (shortlist.movies.length < 3) {
        const movie = shortlist.movies[0]
        return [
          {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: { ...movie },
          },
          {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: { ...movie },
          },
          {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: { ...movie },
          },
        ]
      }
      return shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: movie,
          },
        ),
      )
    })
    const shuffledMovies = shuffle(movies)

    const chosen = sample(shuffledMovies, true)

    if (chosen) {
      resultArr.push(chosen as unknown as ChosenMovie)
      lastChosen = chosen.user
    }
  }

  const moviesByUser = countByKey(resultArr, (movie) => {
    return movie?.user?.name ?? ""
  })

  const dataObj = {
    label: "Movies by user",
    data: [],
  } as UserChartData

  for (const user in moviesByUser) {
    dataObj.data.push({
      user: user,
      movies: moviesByUser[user],
    })
  }
  return dataObj
}

export async function postRaffleWork({
  movies,
  winner,
  watchDate,
}: {
  movies: MovieWithUser[]
  winner: MovieWithUser
  watchDate: string
}) {
  // estimate the time it takes to run the raffle
  // 200ms per movie * 4 rounds + 500ms per movie for the last round is the absolute maximum
  const runtime = movies.length * 4 * 200 + movies.length * 500

  // await the timeout
  await new Promise((resolve) => setTimeout(resolve, runtime))

  const participants = [...new Set(movies.map((movie) => movie.user?.id ?? ""))]

  // create a raffle record
  await prisma.raffle.create({
    data: {
      participants: {
        connect: participants.map((participant) => ({ id: participant })),
      },
      movies: {
        connect: movies.map((movie) => ({ id: movie.id })),
      },
      winningMovieID: winner.id ?? "",
      date: formatISO(new Date(), {
        representation: "date",
      }),
    },
  })

  // Get all participants with their Radarr settings
  const participantsWithRadarr = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      radarrUrl: true,
      radarrApiKey: true,
      radarrRootFolder: true,
      radarrQualityProfileId: true,
      radarrMonitored: true,
      radarrEnabled: true,
    },
  })

  for (const user of participantsWithRadarr) {
    if (user.radarrEnabled && user.radarrUrl && user.radarrApiKey) {
      await addMovieToUserRadarr(
        winner.tmdbId,
        winner.title,
        winner.release_date,
        {
          radarrUrl: user.radarrUrl,
          radarrApiKey: user.radarrApiKey,
          radarrRootFolder: user.radarrRootFolder,
          radarrQualityProfileId: user.radarrQualityProfileId,
          radarrMonitored: user.radarrMonitored,
          radarrEnabled: user.radarrEnabled,
        },
      )
    } else {
      console.log(`${user.name} does not have Radarr configured. Skipping.`)
    }
  }

  // update the winner with the watch date
  await updateChosenMovie(winner, winner.user?.id ?? "", watchDate)

  // reset the selection status of everyone
  await prisma.shortlist.updateMany({
    data: {
      requiresSelection: false,
      selectedIndex: null,
    },
  })

  // update shortlist states, remove the winning movie from all shortlists
  for (const participant of participants) {
    const shortlist = await prisma.shortlist.findUnique({
      where: {
        userId: participant,
      },
      include: {
        movies: true,
      },
    })
    const movieInShortlist = shortlist?.movies.find(
      (movie) => movie.id === winner.id,
    )

    await updateShortlistState(false, shortlist?.id ?? "")
    await updateShortlistSelectionStatus(
      participant === winner?.user?.id,
      shortlist?.id ?? "",
    )
    if (movieInShortlist) {
      await removeMovieFromShortlist(movieInShortlist.id, shortlist?.id ?? "")
    }

    // need to update each user's unranked tier to add the winning movie
    const tierlists = await prisma.tierlist.findMany({
      where: {
        userId: participant,
      },
      include: {
        tiers: {
          select: {
            id: true,
            value: true,
            movies: true,
          },
        },
      },
    })

    for (const tierlist of tierlists) {
      for (const tier of tierlist.tiers) {
        if (tier.value === 0) {
          await prisma.moviesOnTiers.create({
            data: {
              movieId: winner.id,
              tierId: tier.id,
              position: tier.movies.length + 1,
            },
          })
          break
        }
      }
    }
  }
}

export async function addChosenForUser(chosen: MovieWithUser, user: User) {
  try {
    const radarrResult = await addMovieToUserRadarr(
      chosen.tmdbId,
      chosen.title,
      chosen.release_date,
      {
        radarrUrl: user.radarrUrl,
        radarrApiKey: user.radarrApiKey,
        radarrRootFolder: user.radarrRootFolder,
        radarrQualityProfileId: user.radarrQualityProfileId,
        radarrMonitored: user.radarrMonitored,
        radarrEnabled: user.radarrEnabled,
      },
    )
    if (radarrResult) {
      console.log(
        `Added winning movie "${chosen.title}" to ${user.name}'s Radarr for download`,
      )
      sendNotification(
        `Added winning movie "${chosen.title}" to your Radarr for download.`,
        user.id,
      )
    } else {
      console.log(
        `Could not add winning movie "${chosen.title}" to ${user.name}'s Radarr`,
      )
      sendNotification(
        `Could not add winning movie "${chosen.title}" to your Radarr.`,
        user.id,
      )
    }
  } catch (error) {
    console.error(
      `Failed to add winning movie "${chosen.title}" to ${user.name}'s Radarr:`,
      error,
    )
    sendNotification(
      `Failed to add winning movie "${chosen.title}" to your Radarr.`,
      user.id,
    )
    // Continue execution even if Radarr fails for this user
  }
}

export async function updateChosenMovie(
  movie: Movie,
  userId: string,
  watchDate: string,
) {
  //const nextDate = getNextDate();

  const updatedMovie = await prisma.movie.update({
    where: {
      id: movie.id,
    },
    data: {
      watchDate: watchDate,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return updatedMovie
}

export async function connectChosenMovies(movies: ChosenMovie[]) {
  const users: Record<string, string> = {
    Juhani: "64aec109b56d6dd5a8489cb4",
    Jussi: "64b825e750ebc52d19bc72e7",
    Miika: "648875d9b274755f19862cbf",
    Niko: "64b7c8d13be96d82bde4a930",
  }
  for (const movie of movies) {
    const username = movie.user

    if (username) {
      // retrieve the movie
      const movieData = await prisma.movie.findUnique({
        where: {
          tmdbId: movie.movie.tmdbId,
        },
      })

      if (!movieData?.userId) {
        await prisma.movie.update({
          where: {
            id: movieData?.id,
          },
          data: {
            user: {
              connect: {
                id: users[username.name],
              },
            },
          },
        })
      }
    }
  }

  return movies
}

export async function getStatistics() {
  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
    include: {
      user: true,
    },
  })

  const moviesByUser = countByKey(movies, (movie) => {
    return movie.user?.name ?? ""
  })

  const dataArr = []
  const dataObj = {
    label: "Movies by user",
    data: [],
  } as UserChartData

  for (const user in moviesByUser) {
    dataObj.data.push({
      user: user,
      movies: moviesByUser[user],
    })
  }
  dataArr.push(dataObj)
  return dataObj
}

export async function getAllMonths() {
  const movies = await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
    orderBy: {
      watchDate: "desc",
    },
    select: {
      watchDate: true,
    },
  })

  const monthsSet = new Set<string>()

  for (const movie of movies) {
    if (movie.watchDate) {
      monthsSet.add(movie.watchDate.substring(0, 7))
    }
  }

  return Array.from(monthsSet).map((month) => {
    return {
      month: month,
      label: format(new Date(month), "MMMM yyyy"),
    }
  })
}

export async function getWatchHistoryByMonth(
  month: string | null,
  search: string = "",
) {
  // Get the most recent month if no month is provided
  const startMonth = month || (await getAllMonths())[0]?.month

  if (!startMonth) {
    return {
      month: startMonth,
      movies: [],
      nextMonth: null,
      hasMore: false,
    }
  }
  // Build where clause for the query
  const whereClause: {
    watchDate: {
      not: null
      contains: string
    }
    title?: {
      contains: string
      mode: Prisma.QueryMode
    }
  } = {
    watchDate: {
      not: null,
      contains: startMonth,
    },
  }

  // Add search filter if provided
  if (search.trim()) {
    whereClause.title = {
      contains: search.trim(),
      mode: Prisma.QueryMode.insensitive,
    }
  }

  const movies = await prisma.movie.findMany({
    where: whereClause,
    orderBy: {
      watchDate: "desc",
    },
    include: {
      user: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  })

  // Get next month for pagination
  const allMonths = await getAllMonths()
  const currentIndex = allMonths.findIndex((m) => m.month === startMonth)
  const nextMonth =
    currentIndex < allMonths.length - 1
      ? allMonths[currentIndex + 1]?.month
      : null

  return {
    month: startMonth,
    movies,
    nextMonth,
    hasMore: !!nextMonth,
  }
}

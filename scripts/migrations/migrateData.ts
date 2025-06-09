/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import { readFile } from "node:fs/promises"

async function migrateData() {
  const connectionString = `${process.env.DATABASE_URL}`
  console.log("Connection String:", connectionString)
  const adapter = new PrismaNeon({ connectionString })
  console.log("Adapter:", adapter)
  const db = new PrismaClient({ adapter })

  const userData = await readFile("./data//MovieClub/users-*.json", "utf-8")
  const accountData = await readFile("./data/accounts-*.json", "utf-8")
  const users = JSON.parse(userData)
  const accounts = JSON.parse(accountData)

  const movieData = await readFile("./data/movies-*.json", "utf-8")
  const shortlistData = await readFile("./data/shortlist-*.json", "utf-8")

  const movies = JSON.parse(movieData)
  const shortlists = JSON.parse(shortlistData)

  const tierlistData = await readFile("./data/Tierlists-*.json", "utf-8")
  const tierlists = JSON.parse(tierlistData)

  const tierData = await readFile("./data/Tier-*.json", "utf-8")
  const tiers = JSON.parse(tierData)

  const tierMovieData = await readFile("./data/tier_movies-*.json", "utf-8")
  const tierMovies = JSON.parse(tierMovieData)

  const raffleData = await readFile("./data/Raffle-*.json", "utf-8")
  const raffles = JSON.parse(raffleData)

  const siteconfigData = await readFile("./data/SiteConfig-*.json", "utf-8")
  const siteConfig = JSON.parse(siteconfigData)

  const recommendedData = await readFile(
    "./data/RecommendedMovie-*.json",
    "utf-8",
  )
  const recommendedMovies = JSON.parse(recommendedData)

  console.log("Users:", users)

  const createdUsersMap = createMapFromData(users)
  const createdAccountsMap = createMapFromData(accounts)
  const createdMoviesMap = createMapFromData(movies)
  const createdShortlistsMap = createMapFromData(shortlists)

  const createdTierlistsMap = createMapFromData(tierlists)
  const createdTiersMap = createMapFromData(tiers)
  const createdTierMoviesMap = createMapFromData(tierMovies)

  const createdRafflesMap = createMapFromData(raffles)

  const createdRecommendedMoviesMap = createMapFromData(recommendedMovies)

  const createdSiteConfigMap = createMapFromData(siteConfig)

  console.log("Created Users Map:", createdUsersMap)
  console.log("Created Accounts Map:", createdAccountsMap)
  console.log("Created Movies Map:", createdMoviesMap)
  console.log("Created Shortlists Map:", createdShortlistsMap)

  console.log("starting migration...")

  await db.account.deleteMany({})
  await db.user.deleteMany({})
  await db.movie.deleteMany({})
  await db.shortlist.deleteMany({})
  await db.tierlist.deleteMany({})
  await db.tier.deleteMany({})
  await db.moviesOnTiers.deleteMany({})
  await db.raffle.deleteMany({})
  await db.recommendedMovie.deleteMany({})
  await db.siteConfig.deleteMany({})

  console.log("Deleted existing data, starting migration...")

  for (const [userId, user] of createdUsersMap) {
    const createdUser = await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    createdUsersMap.set(userId, {
      ...user,
      neonId: createdUser.id,
    })
  }

  for (const [accountId, account] of createdAccountsMap) {
    const createdAccount = await db.account.create({
      data: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
        user: {
          connect: {
            id: createdUsersMap.get(account.userId["$oid"]).neonId,
          },
        },
      },
    })
    createdAccountsMap.set(accountId, {
      ...account,
      neonId: createdAccount.id,
    })
  }

  for (const [movieId, movie] of createdMoviesMap) {
    try {
      const createdMovie = await db.movie.create({
        data: {
          adult: movie.adult,
          tmdbId: movie.tmdbId,
          original_language: movie.original_language,
          popularity: movie.popularity,
          video: movie.video,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          title: movie.title,
          original_title: movie.original_title,
          release_date: movie.release_date,
          overview: movie.overview,
          watchDate: movie.watchDate,
          imdbId: movie.imdbId,
          runtime: movie.runtime,
          genres: movie.genres.map(
            (genre: { id: number; name: string }) => genre.name,
          ),
          tagline: movie.tagline,
          watchProviders: movie.watchProviders,
          images: movie.images,
          videos: movie.videos,
          cast: movie.cast,
          crew: movie.crew,
        },
      })
      createdMoviesMap.set(movieId, {
        ...movie,
        neonId: createdMovie.id,
      })

      if (movie.userId && movie.userId["$oid"]) {
        const userId = createdUsersMap.get(movie.userId["$oid"]).neonId
        await db.movie.update({
          where: { id: createdMovie.id },
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
          },
        })
      }
    } catch (error) {
      console.error("Error creating movie:", movie, error)
    }
  }

  for (const [shortlistId, shortlist] of createdShortlistsMap) {
    const createdShortlist = await db.shortlist.create({
      data: {
        user: {
          connect: {
            id: createdUsersMap.get(shortlist.userId["$oid"]).neonId,
          },
        },
        movies: {
          connect: shortlist.movieIDs.map((movieId: { $oid: string }) => ({
            id: createdMoviesMap.get(movieId["$oid"]).neonId,
          })),
        },
        isReady: shortlist.isReady,
        requiresSelection: shortlist.requiresSelection,
        participating: shortlist.participating,
        selectedIndex: shortlist.selectedIndex,
      },
    })
    createdShortlistsMap.set(shortlistId, {
      ...shortlist,
      neonId: createdShortlist.id,
    })

    await db.user.update({
      where: { id: createdUsersMap.get(shortlist.userId["$oid"]).neonId },
      data: {
        shortlistId: createdShortlist.id,
      },
    })
  }

  for (const [tierlistId, tierlist] of createdTierlistsMap) {
    const createdTierlist = await db.tierlist.create({
      data: {
        user: {
          connect: {
            id: createdUsersMap.get(tierlist.userId["$oid"]).neonId,
          },
        },
      },
    })
    createdTierlistsMap.set(tierlistId, {
      ...tierlist,
      neonId: createdTierlist.id,
    })
  }

  for (const [tierId, tier] of createdTiersMap) {
    const createdTier = await db.tier.create({
      data: {
        label: tier.label,
        value: tier.value,
        tierlist: {
          connect: {
            id: createdTierlistsMap.get(tier.tierlistId["$oid"]).neonId,
          },
        },
      },
    })
    createdTiersMap.set(tierId, {
      ...tier,
      neonId: createdTier.id,
    })

    if (tier.movieIds) {
      const createdTierlistId = createdTierlistsMap.get(
        tier.tierlistId["$oid"],
      ).neonId
      const tierMovies: { id: string; position: number }[] = tier.movieIds?.map(
        (movieId: { $oid: string }, index: number) => {
          return {
            id: createdMoviesMap.get(movieId["$oid"]).neonId,
            position: index,
          }
        },
      )

      console.log("Created Tierlist ID:", createdTierlistId)
      console.log("Tier Movies:", tierMovies)
      console.log("tier", tier)

      await db.tier.update({
        where: { id: createdTier.id },
        data: {
          movies: {
            create: tier?.movieIds?.map(
              (movieId: { $oid: string }, index: number) => {
                return {
                  movie: {
                    connect: {
                      id: createdMoviesMap.get(movieId["$oid"]).neonId,
                    },
                  },
                  position: index,
                }
              },
            ),
          },
        },
      })
    }
  }

  for (const [tierMovieId, tierMovie] of createdTierMoviesMap) {
    try {
      const createdTierMovie = await db.moviesOnTiers.create({
        data: {
          movie: {
            connect: {
              id: createdMoviesMap.get(tierMovie.movieId["$oid"]).neonId,
            },
          },
          tier: {
            connect: {
              id: createdTiersMap.get(tierMovie.tierId["$oid"]).neonId,
            },
          },
          position: tierMovie.position,
        },
      })
      createdTierMoviesMap.set(tierMovieId, {
        ...tierMovie,
        neonId: createdTierMovie.movieId,
      })
    } catch (error) {
      console.error("Error creating tier movie:", tierMovie, error)
      console.error("Created Movies Map:", createdMoviesMap)
    }
  }

  for (const [raffleId, raffle] of createdRafflesMap) {
    const createdRaffle = await db.raffle.create({
      data: {
        participants: {
          connect: raffle.participantIDs.map((userId: { $oid: string }) => ({
            id: createdUsersMap.get(userId["$oid"]).neonId,
          })),
        },
        movies: {
          connect: raffle.movieIDs.map((movieId: { $oid: string }) => ({
            id: createdMoviesMap.get(movieId["$oid"]).neonId,
          })),
        },
        winningMovieID: createdMoviesMap.get(raffle?.winningMovieID["$oid"])
          .neonId,
        date: raffle.date,
      },
    })
    createdRafflesMap.set(raffleId, {
      ...raffle,
      neonId: createdRaffle.id,
    })
  }

  for (const [
    recommendedMovieId,
    recommendedMovie,
  ] of createdRecommendedMoviesMap) {
    const createdRecommendedMovie = await db.recommendedMovie.create({
      data: {
        user: {
          connect: {
            id: createdUsersMap.get(recommendedMovie.userId["$oid"]).neonId,
          },
        },
        movie: {
          connect: {
            id: createdMoviesMap.get(recommendedMovie.movieId["$oid"]).neonId,
          },
        },
        sourceMovie: {
          connect: {
            id: createdMoviesMap.get(recommendedMovie.sourceMovieId["$oid"])
              .neonId,
          },
        },
      },
    })
    createdRecommendedMoviesMap.set(recommendedMovieId, {
      ...recommendedMovie,
      neonId: createdRecommendedMovie.id,
    })
  }

  for (const [siteConfigId, siteConfig] of createdSiteConfigMap) {
    const createdSiteConfig = await db.siteConfig.create({
      data: {
        watchWeekDay: siteConfig.watchWeekDay,
        watchProviders: siteConfig.watchProviders,
      },
    })
    createdSiteConfigMap.set(siteConfigId, {
      ...siteConfig,
      neonId: createdSiteConfig.id,
    })
  }
}

function createMapFromData(data: any[]) {
  const map = new Map()
  for (const item of data) {
    const id = item._id["$oid"]
    map.set(id, item)
  }
  return map
}

migrateData()

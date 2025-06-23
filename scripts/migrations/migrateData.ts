/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import { readFile, readdir } from "node:fs/promises"
import { join, extname, basename } from "node:path"

/**
 * Finds the latest version of a file based on timestamp in filename
 * @param directory - The directory to search in
 * @param filePattern - The base name pattern (e.g., "users" for files like "users-2025-06-22.json")
 * @param extension - The file extension (defaults to ".json")
 * @returns The full path to the latest file, or null if no matching files found
 */
async function findLatestFile(
  directory: string,
  filePattern: string,
  extension: string = ".json",
): Promise<string | null> {
  try {
    const files = await readdir(directory)
    console.log("files in directory:", files)

    // Filter files that match the pattern and extension
    const matchingFiles = files.filter((file) => {
      const fileExt = extname(file)
      const fileName = basename(file, fileExt)

      // Check if file has correct extension and starts with the pattern
      return fileExt === extension && fileName.startsWith(filePattern + "-")
    })

    if (matchingFiles.length === 0) {
      return null
    }

    // Sort files by timestamp (assuming YYYY-MM-DD format after the pattern)
    const sortedFiles = matchingFiles.sort((a, b) => {
      const getTimestamp = (filename: string) => {
        const nameWithoutExt = basename(filename, extname(filename))
        const timestampPart = nameWithoutExt.replace(filePattern + "-", "")
        return timestampPart
      }

      const timestampA = getTimestamp(a)
      const timestampB = getTimestamp(b)

      // Sort in descending order (latest first)
      return timestampB.localeCompare(timestampA)
    })

    return join(directory, sortedFiles[0])
  } catch (error) {
    console.error(`Error searching for files in ${directory}:`, error)
    return null
  }
}

async function migrateData() {
  const connectionString = `${process.env.DATABASE_URL}`
  const adapter = new PrismaNeon({ connectionString })
  const db = new PrismaClient({ adapter })

  // Find latest versions of each data file
  const usersFile = await findLatestFile("./data/MovieClub", "users")
  const accountsFile = await findLatestFile("./data/MovieClub", "accounts")
  const moviesFile = await findLatestFile("./data/MovieClub", "movies")
  const shortlistFile = await findLatestFile("./data/MovieClub", "shortlist")
  const tierlistFile = await findLatestFile("./data/MovieClub", "Tierlists")
  const tierFile = await findLatestFile("./data/MovieClub", "Tier")
  const tierMovieFile = await findLatestFile("./data/MovieClub", "tier_movies")
  const raffleFile = await findLatestFile("./data/MovieClub", "Raffle")
  const siteconfigFile = await findLatestFile("./data/MovieClub", "SiteConfig")
  const recommendedFile = await findLatestFile(
    "./data/MovieClub",
    "RecommendedMovie",
  )

  // Check if all required files were found
  if (
    !usersFile ||
    !accountsFile ||
    !moviesFile ||
    !shortlistFile ||
    !tierlistFile ||
    !tierFile ||
    !tierMovieFile ||
    !raffleFile ||
    !siteconfigFile ||
    !recommendedFile
  ) {
    throw new Error("Could not find all required data files")
  }

  console.log("Found data files:")
  console.log("Users:", usersFile)
  console.log("Accounts:", accountsFile)
  console.log("Movies:", moviesFile)
  console.log("Shortlist:", shortlistFile)
  console.log("Tierlists:", tierlistFile)
  console.log("Tiers:", tierFile)
  console.log("TierMovies:", tierMovieFile)
  console.log("Raffles:", raffleFile)
  console.log("SiteConfig:", siteconfigFile)
  console.log("Recommended:", recommendedFile)

  // Read the files
  const userData = await readFile(usersFile, "utf-8")
  const accountData = await readFile(accountsFile, "utf-8")
  const users = JSON.parse(userData)
  const accounts = JSON.parse(accountData)

  const movieData = await readFile(moviesFile, "utf-8")
  const shortlistData = await readFile(shortlistFile, "utf-8")

  const movies = JSON.parse(movieData)
  const shortlists = JSON.parse(shortlistData)

  const tierlistData = await readFile(tierlistFile, "utf-8")
  const tierlists = JSON.parse(tierlistData)

  const tierData = await readFile(tierFile, "utf-8")
  const tiers = JSON.parse(tierData)

  const tierMovieData = await readFile(tierMovieFile, "utf-8")
  const tierMovies = JSON.parse(tierMovieData)

  const raffleData = await readFile(raffleFile, "utf-8")
  const raffles = JSON.parse(raffleData)

  const siteconfigData = await readFile(siteconfigFile, "utf-8")
  const siteConfig = JSON.parse(siteconfigData)

  const recommendedData = await readFile(recommendedFile, "utf-8")
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
    try {
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
    } catch (error) {
      console.error("Error creating account:", account, error)
    }
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

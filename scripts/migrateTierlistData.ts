import prisma from '@/lib/prisma'

const createUnrankedTier = async (tierlistId: string, movies: string[]) => {
  const unrankedTier = await prisma.tier.create({
    data: {
      label: 'Unranked',
      value: 0,
      tierlist: {
        connect: { id: tierlistId },
      },
      movies: {
        connect: movies.map((movie) => ({ id: movie })),
      },
    },
  })

  return unrankedTier
}

const createTier = async (
  tierlistId: string,
  label: string,
  value: number,
  movies: string[],
) => {
  const newTier = await prisma.tier.create({
    data: {
      label: label,
      value: value,
      tierlist: {
        connect: { id: tierlistId },
      },
      tierMovies: {
        create: movies.map((movie, index) => ({
          movie: {
            connect: { id: movie },
          },
          position: index,
        })),
      },
    },
  })

  return newTier
}

export const migrateTierlistData = async () => {
  const tierlist = await prisma.tierlists.findUnique({
    where: {
      id: '6539332947d18fb57c3e31bc',
    },
  })

  if (!tierlist) {
    console.log('Tierlist not found')
    return
  }

  console.dir(tierlist, { depth: null })

  const watchedMovies = await prisma.movie.findMany({
    where: {
      watchDate: {
        not: null,
      },
    },
  })

  const watchedMoviesIds = watchedMovies.map((movie) => movie.id)

  console.log('watchedMoviesIds', watchedMoviesIds)

  const rankedMovies = tierlist.tiers.flatMap((tier) => tier.movies)

  console.log('rankedMovies', rankedMovies)

  const unrankedMovies = watchedMoviesIds.filter(
    (movie) => !rankedMovies.includes(movie),
  )

  console.log('unrankedMovies', unrankedMovies)

  const unrankedTier = await createUnrankedTier(tierlist.id, unrankedMovies)

  console.log('unrankedTier', unrankedTier)

  for (const tier of tierlist.tiers) {
    console.log('tier', tier.label)
    console.log('tier.movies', tier.movies)

    const newTier = await createTier(
      tierlist.id,
      tier.label,
      tier.value,
      tier.movies,
    )

    console.log('newTier', newTier)
  }
}

migrateTierlistData()

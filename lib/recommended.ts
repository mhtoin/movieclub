import { createDbMovie } from "@/lib/createDbMovie"
import { getQueryClient } from "@/lib/getQueryClient"
import prisma from "@/lib/prisma"
import type {
  TMDBMovieResponse,
  TMDBRecommendationResponse,
} from "@/types/tmdb.type"
import type { Movie, User } from "@prisma/client"
import { QueryClient } from "@tanstack/react-query"
export async function updateRecommended(sourceMovie: Movie, user: User) {
  const queryClient = getQueryClient()

  const siteConfig = await prisma.siteConfig.findUnique({
    where: {
      id: process.env.SITE_CONFIG_ID,
    },
  })
  const recomendedMovies = []
  let page = 1

  while (recomendedMovies.length < 5) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${sourceMovie.tmdbId}/recommendations?page=${page}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      },
    )
    const data: TMDBRecommendationResponse = await response.json()
    if (data.results.length === 0) break

    for (const movie of data.results) {
      const existingMovie = await prisma.movie.findUnique({
        where: {
          tmdbId: movie.id,
        },
      })

      if (existingMovie) {
        const watchProviderExists =
          existingMovie.watchProviders?.providers?.find((provider) =>
            siteConfig?.watchProviders?.find(
              (p) => p.provider_id === provider.provider_id,
            ),
          )
        if (watchProviderExists) {
          recomendedMovies.push(existingMovie)
          await prisma.movie.update({
            where: {
              id: existingMovie.id,
            },
            data: {
              recommendations: {
                create: {
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                  sourceMovie: {
                    connect: {
                      id: sourceMovie.id,
                    },
                  },
                },
              },
            },
          })
        }
        if (recomendedMovies.length >= 5) break
      } else {
        // fetch details from tmdb
        const detailsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
            },
          },
        )
        const movieDetails: TMDBMovieResponse = await detailsRes.json()

        // check that the movie is available on the currently used streaming services
        const streamingServices = movieDetails["watch/providers"]?.results.FI
        if (streamingServices) {
          let hasStreamingService = false
          if (streamingServices.flatrate) {
            for (const service of streamingServices.flatrate) {
              const provider = siteConfig?.watchProviders?.find(
                (provider) => provider.provider_id === service.provider_id,
              )
              if (provider) {
                hasStreamingService = true
              }
            }
          }
          if (streamingServices.free) {
            for (const service of streamingServices.free) {
              const provider = siteConfig?.watchProviders?.find(
                (provider) => provider.provider_id === service.provider_id,
              )
              if (provider) {
                hasStreamingService = true
              }
            }
          }
          if (hasStreamingService) {
            const movieObject = await createDbMovie(movieDetails)
            await prisma.movie.create({
              data: {
                ...movieObject,
                recommendations: {
                  create: {
                    user: {
                      connect: {
                        id: user.id,
                      },
                    },
                    sourceMovie: {
                      connect: {
                        id: sourceMovie.id,
                      },
                    },
                  },
                },
              },
            })
            recomendedMovies.push(movieDetails)
            if (recomendedMovies.length >= 5) break
          }
        }
      }
    }
    if (recomendedMovies.length >= 5) break
    if (data.total_pages === page) break
    page++
  }
  queryClient.invalidateQueries({
    queryKey: ["users", user.id, "recommendedMovies"],
  })
}

export async function removeRecommended(sourceMovieId: string, user: User) {
  const queryClient = new QueryClient()

  const recommendedMovies = await prisma.recommendedMovie.deleteMany({
    where: {
      userId: user.id,
      sourceMovieId: sourceMovieId,
    },
  })

  queryClient.invalidateQueries({
    queryKey: ["users", user.id, "recommendedMovies"],
  })

  return recommendedMovies
}

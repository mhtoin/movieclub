import type { MovieWithUser } from '@/types/movie.type'
import { Calendar, Clock, Star, TrendingUp, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaImdb } from 'react-icons/fa'
import { SiThemoviedatabase } from 'react-icons/si'
import CastPopover from './CastPopover'
import CastPortrait from './CastPortrait'
import TrailerLink from './TrailerLink'
import UserPortrait from './UserPortrait'

export default function ResultCard({ movie }: { movie: MovieWithUser }) {
  const watchproviders = movie?.watchProviders?.providers
  const backdrop = movie?.images?.backdrops[0]
  const poster = movie?.images?.posters[0]

  return (
    <div className="grid h-full grid-rows-6">
      <div className="relative row-span-4 flex">
        <div className="absolute right-1/2 bottom-10 flex h-40 w-full translate-x-1/2 items-center justify-center">
          <div className="grid h-full w-full grid-cols-12 items-center justify-center">
            <div className="col-span-6 flex flex-col items-center justify-center" />
            <div className="col-span-6 flex flex-col justify-center gap-2">
              <h1 className="bg-accent/50 w-fit rounded-md px-1 text-[24px] font-bold text-white">
                {movie.title}
              </h1>

              <div className="flex flex-col gap-2">
                <div className="bg-accent/50 flex w-fit flex-row gap-2 rounded-md p-2">
                  <span className="flex flex-row items-center gap-1 text-sm">
                    <Star className="h-6 w-6" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="flex flex-row items-center gap-1 text-sm">
                    <Users className="h-6 w-6" />
                    {movie.vote_count}
                  </span>
                  <span className="flex flex-row items-center gap-1 text-sm">
                    <TrendingUp className="h-6 w-6" />
                    {movie.popularity.toFixed(1)}
                  </span>
                </div>
                <div className="bg-accent/50 flex w-fit flex-row gap-2 rounded-md p-2">
                  <span className="flex flex-row items-center gap-1 text-sm">
                    <Clock className="h-6 w-6" />
                    {`${
                      movie?.runtime ? Math.floor(movie?.runtime / 60) : 0
                    } h ${movie?.runtime ? movie?.runtime % 60 : 0} min`}
                  </span>
                  <span className="flex flex-row items-center gap-1 text-sm">
                    <Calendar className="h-6 w-6" />
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex w-fit flex-row gap-2 rounded-md">
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                    target="_blank"
                    className="bg-accent/50 rounded-md p-2"
                  >
                    <SiThemoviedatabase className="h-6 w-6" />
                  </Link>
                  <Link
                    href={`https://www.imdb.com/title/${movie?.imdbId}`}
                    target="_blank"
                    className="bg-accent/50 rounded-md p-2"
                  >
                    <FaImdb className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop?.file_path}`}
          alt={movie.title}
          width={backdrop?.width}
          height={backdrop?.height}
          className={`object-cover aspect-[${backdrop?.aspect_ratio}]`}
          quality={100}
          priority
        />
      </div>
      <div className="row-span-2 grid grid-cols-3 items-center justify-center gap-5 px-10">
        <div className="relative col-span-1 flex h-full flex-col">
          <div className="absolute -top-[85%] left-0 flex flex-col items-center justify-center gap-5 py-2">
            <Image
              src={`https://image.tmdb.org/t/p/original${poster?.file_path}`}
              alt={movie.title}
              width={poster?.width}
              height={poster?.height}
              className="aspect-[${poster?.aspect_ratio}] w-4/5 rounded-sm object-contain"
              priority
            />
            <div className="flex max-w-40 flex-row flex-wrap items-center justify-center gap-2">
              {watchproviders?.map((provider) => {
                return (
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    width={50}
                    height={50}
                    className="rounded-sm"
                    key={provider.provider_id}
                  />
                )
              })}
            </div>
            <div className="flex max-w-40 flex-row flex-wrap items-center justify-center gap-2">
              {movie?.genres?.map((genre) => {
                return (
                  <div
                    className="text-foreground/50 bg-foreground/10 rounded-md px-2 py-1 text-sm"
                    key={genre.id}
                  >
                    {genre.name}
                  </div>
                )
              })}
            </div>
            <div className="flex max-w-40 flex-row flex-wrap items-center justify-center gap-2">
              {movie?.videos?.slice(0, 3).map((video) => {
                return <TrailerLink video={video} key={video.id} />
              })}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex h-full flex-col gap-2 pt-10">
          <span className="text-foreground/50 text-md font-bold italic">
            {movie?.tagline}
          </span>
          <div className="flex flex-row items-center justify-start gap-2">
            {movie?.cast?.slice(0, 6).map((cast) => {
              return (
                <CastPortrait
                  cast={{
                    ...cast,
                    profile_path: cast?.profile_path || undefined,
                  }}
                  key={cast.id}
                />
              )
            })}
            {movie?.cast && (
              <CastPopover
                cast={movie.cast.map((cast) => ({
                  ...cast,
                  profile_path: cast?.profile_path || undefined,
                }))}
              />
            )}
          </div>
          <p className="text-foreground/50">{movie.overview}</p>
          <div className="flex flex-row gap-2">
            {movie?.user && <UserPortrait user={movie.user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

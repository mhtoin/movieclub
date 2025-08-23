import type { MovieWithReviews } from "@/types/movie.type"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Star, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { FaImdb } from "react-icons/fa"
import { SiThemoviedatabase } from "react-icons/si"
import { cn } from "@/lib/utils"
import ReviewDialog from "components/tierlist/ReviewDialog"
import { useValidateSession } from "@/lib/hooks"

export default React.memo(
  function DetailsView({
    movie,
    isExpanded = true,
    colors,
  }: {
    movie: MovieWithReviews
    isExpanded?: boolean
    colors?: string[]
  }) {
    const { data: user, isLoading: isUserLoading } = useValidateSession()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isWrapped, setIsWrapped] = useState(false)
    const [containerWidth, setContainerWidth] = useState(0)

    // Calculate if text will wrap BEFORE rendering animation
    useEffect(() => {
      const updateContainerWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth
          setContainerWidth(width)
        }
      }

      updateContainerWidth()
      const resizeObserver = new ResizeObserver(updateContainerWidth)

      const currentRef = containerRef.current

      if (currentRef) {
        resizeObserver.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          resizeObserver.unobserve(currentRef)
        }
      }
    }, [])

    const titleParts = React.useMemo(() => {
      const title = movie.title
      const words = title.split(" ")
      let firstHalf = ""
      let secondHalf = ""

      if (words.length <= 1) {
        const midpoint = Math.ceil(title.length / 2)
        firstHalf = title.substring(0, midpoint)
        secondHalf = title.substring(midpoint)
      } else {
        const midWordIndex = Math.floor(words.length / 2)
        firstHalf = words.slice(0, midWordIndex).join(" ")
        secondHalf = words.slice(midWordIndex).join(" ")
      }

      return {
        firstHalf,
        secondHalf,
        hasMultipleWords: words.length > 1,
      }
    }, [movie.title])

    useEffect(() => {
      if (containerWidth > 0) {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (context) {
          context.font = "bold clamp(0.5rem,calc(0.05*100vw),3rem) monospace"

          const firstHalfWidth = context.measureText(
            titleParts.firstHalf.toLocaleUpperCase(),
          ).width
          const secondHalfWidth = context.measureText(
            titleParts.secondHalf.toLocaleUpperCase(),
          ).width
          const spaceWidth = titleParts.hasMultipleWords
            ? context.measureText(" ").width
            : 0

          // Account for padding (p-10 = 2.5rem = 40px on each side)
          const availableWidth = containerWidth - 80

          // Check if text will wrap - this considers the flex-wrap behavior
          const willWrap =
            firstHalfWidth + spaceWidth + secondHalfWidth > availableWidth

          setIsWrapped(willWrap)
        }
      }
    }, [titleParts, containerWidth])

    const titleFontSize = "text-[clamp(2.5rem,calc(0.05*100vw),3rem)]"
    const animationVariants = React.useMemo(
      () => ({
        firstHalf: {
          initial: isWrapped
            ? { opacity: 0, x: -100 }
            : { opacity: 0, y: -100 },
          animate: isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 },
          exit: isWrapped ? { opacity: 0, x: 100 } : { opacity: 0, y: 100 },
        },
        secondHalf: {
          initial: isWrapped ? { opacity: 0, x: 100 } : { opacity: 0, y: 100 },
          animate: isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 },
          exit: isWrapped ? { opacity: 0, x: -100 } : { opacity: 0, y: -100 },
        },
      }),
      [isWrapped],
    )

    return (
      <div className="relative h-full w-full flex flex-row items-center justify-center gap-10 container mx-auto">
        <div
          className="relative flex flex-col justify-center overflow-hidden gap-6"
          ref={containerRef}
        >
          <AnimatePresence mode="wait" propagate>
            <motion.div
              className="flex w-full flex-col gap-6 px-8"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full max-w-full flex-col flex-wrap">
                  <AnimatePresence mode="wait" propagate>
                    <div
                      className={`flex flex-wrap ${titleFontSize} font-mono font-bold bg-gradient-to-r from-peach via-flamingo to-rosewater bg-clip-text text-transparent`}
                    >
                      <motion.span
                        key={`first-${isWrapped ? "wrapped" : "unwrapped"}`}
                        className="whitespace-nowrap"
                        {...animationVariants.firstHalf}
                        transition={{ duration: 0.3 }}
                      >
                        {titleParts.firstHalf.toLocaleUpperCase()}
                      </motion.span>
                      {titleParts.hasMultipleWords && (
                        <span className="whitespace-nowrap">&nbsp;</span>
                      )}
                      <motion.span
                        key={`second-${isWrapped ? "wrapped" : "unwrapped"}`}
                        className="whitespace-nowrap"
                        {...animationVariants.secondHalf}
                        transition={
                          isWrapped
                            ? { duration: 0.3, delay: 0 }
                            : { duration: 0.3 }
                        }
                      >
                        {titleParts.secondHalf.toLocaleUpperCase()}
                      </motion.span>
                    </div>
                  </AnimatePresence>
                </div>
                <div
                  className={`flex flex-col gap-2 h-0.25 w-full ${colors?.[colors.length - 2]}`}
                />
              </div>
              <div className="flex min-h-10 flex-row flex-wrap gap-4">
                {movie?.genres?.map((genre, i) => {
                  return (
                    <div
                      key={genre}
                      className={cn(
                        "text-md text-accent-foreground bg-[length:150%_100%] bg-top-left flex h-10 items-center justify-center rounded-md px-4 py-4 backdrop-blur-md",
                        colors?.[i] || "",
                      )}
                    >
                      {genre}
                    </div>
                  )
                })}
              </div>
              <div className="4xl:gap-4 flex flex-row flex-wrap items-center gap-4 px-1">
                <span className="md:text-md 4xl:text-lg text-primary-foreground/60 flex max-w-[500px] flex-row items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 md:h-6 md:w-6" />
                  {movie.watchDate
                    ? new Date(movie?.watchDate).toLocaleDateString("fi-FI")
                    : ""}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="md:text-md 4xl:text-lg text-primary-foreground/60 flex max-w-[500px] flex-row items-center gap-2 text-sm">
                  <Star className="h-4 w-4 md:h-6 md:w-6" />
                  {movie?.vote_average.toFixed(1)}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="md:text-md 4xl:text-lg text-primary-foreground/60 flex max-w-[500px] flex-row items-center gap-2 text-sm">
                  <Users className="h-4 w-4 md:h-6 md:w-6" />
                  {movie?.vote_count}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="md:text-md 4xl:text-lg text-primary-foreground/60 flex max-w-[500px] flex-row items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 md:h-6 md:w-6" />
                  {movie?.popularity.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-6">
                <div className="flex flex-row flex-wrap items-center gap-4">
                  {movie?.watchProviders?.providers?.map((provider) => {
                    return (
                      <Link
                        href={movie?.watchProviders?.link || ""}
                        target="_blank"
                        key={provider.provider_id}
                        className="hover:bg-accent/50 border-accent/50 rounded-md border transition-all duration-300"
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={50}
                          height={50}
                          className="h-8 w-8 rounded-md md:h-10 md:w-10"
                        />
                      </Link>
                    )
                  })}
                </div>
                <div className="bg-primary-foreground/60 h-4/5 w-[1px]" />
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                    target="_blank"
                  >
                    <SiThemoviedatabase className="text-primary-foreground hover:text-accent h-8 w-8" />
                  </Link>
                  <Link
                    href={`https://www.imdb.com/title/${movie?.imdbId}`}
                    target="_blank"
                  >
                    <FaImdb className="text-primary-foreground hover:text-accent h-8 w-8" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {movie.user && (
            <div
              className={`flex flex-row gap-4 items-center py-1 px-8 rounded-md w-fit`}
            >
              <img
                src={movie.user.image}
                alt={movie.user.name ? movie.user.name.split("")[0] : ""}
                className="h-10 w-10 rounded-full border border-white flex items-center justify-center text-white"
              />
              <span className="text-white text-sm">{movie.user.name}</span>
            </div>
          )}
          {!movie.reviews.find((review) => review.user.id !== user?.id) && (
            <div className="flex items-end px-8">
              <ReviewDialog
                movie={movie}
                userId={user?.id}
                key={movie.reviews.length}
              />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait" propagate>
          {isExpanded && (
            <motion.div
              className="hidden md:flex h-full flex-none w-[280px] lg:w-[420px] xl:w-[450px] 2xl:w-[500px] flex-col gap-4 items-center justify-center pl-4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -100,
                transition: { duration: 0.5, delay: 0 },
              }}
              transition={{ duration: 0.3, delay: 0 }}
            >
              <div className="relative rounded-lg overflow-hidden w-full aspect-[2/3]">
                <Image
                  src={
                    movie.images?.posters[0]?.file_path
                      ? `https://image.tmdb.org/t/p/original/${movie.images.posters[0].file_path}`
                      : `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                  }
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 0px, (max-width: 1024px) 280px, (max-width: 1280px) 320px, (max-width: 1536px) 360px, 400px"
                  className="object-cover"
                  placeholder={
                    movie.images?.posters[0]?.blurDataUrl ? "blur" : "empty"
                  }
                  blurDataURL={movie.images?.posters[0]?.blurDataUrl || ""}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-rosewater/40 to-transparent" />
                {movie.overview && (
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                      <p className="text-white text-sm leading-relaxed line-clamp-4">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if the movie ID changes or if it's the same movie with different reviews
    return (
      prevProps.movie.id === nextProps.movie.id &&
      prevProps.isExpanded === nextProps.isExpanded
    )
  },
)

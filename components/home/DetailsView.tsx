import type { MovieWithReviews } from "@/types/movie.type"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Star, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { FaImdb } from "react-icons/fa"
import { SiThemoviedatabase } from "react-icons/si"
import { cn } from "@/lib/utils"

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
    const containerRef = useRef<HTMLDivElement>(null)
    const [isWrapped, setIsWrapped] = useState(false)
    const [containerWidth, setContainerWidth] = useState(0)

    // Calculate if text will wrap BEFORE rendering animation
    useEffect(() => {
      // Get container width on mount and when it changes
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

    // Calculate wrapping whenever title or container width changes
    useEffect(() => {
      if (containerWidth > 0) {
        // Calculate text width using canvas (pre-render measurement)
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (context) {
          context.font = "bold clamp(0.5rem,calc(0.05*100vw),3rem) monospace"

          const words = movie.title.split(" ")
          let firstHalf = ""
          let secondHalf = ""

          if (words.length <= 1) {
            const midpoint = Math.ceil(movie.title.length / 2)
            firstHalf = movie.title.substring(0, midpoint)
            secondHalf = movie.title.substring(midpoint)
          } else {
            const midWordIndex = Math.floor(words.length / 2)
            firstHalf = words.slice(0, midWordIndex).join(" ")
            secondHalf = words.slice(midWordIndex).join(" ")
          }

          // Get text metrics
          const firstHalfWidth = context.measureText(
            firstHalf.toLocaleUpperCase(),
          ).width
          const secondHalfWidth = context.measureText(
            secondHalf.toLocaleUpperCase(),
          ).width
          const spaceWidth =
            words.length > 1 ? context.measureText(" ").width : 0

          // Account for padding (p-10 = 2.5rem = 40px on each side)
          const availableWidth = containerWidth - 80

          // Check if text will wrap - this considers the flex-wrap behavior
          const willWrap =
            firstHalfWidth + spaceWidth + secondHalfWidth > availableWidth

          setIsWrapped(willWrap)
        }
      }
    }, [movie.title, containerWidth])

    return (
      <div className="relative h-full w-full flex flex-row items-center justify-center gap-10 container mx-auto">
        <div
          className="relative flex flex-col justify-center overflow-hidden"
          ref={containerRef}
        >
          <AnimatePresence mode="wait" propagate>
            <motion.div
              className="flex w-full flex-col gap-4 p-8"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              {movie.user && (
                <div className="flex flex-col gap-2">
                  <img
                    src={movie.user.image}
                    alt={movie.user.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="text-accent/60 text-sm">
                    {movie.user.name}
                  </span>
                </div>
              )}
              <div className="flex min-h-10 flex-row flex-wrap gap-2">
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
              <div className="4xl:gap-4 flex flex-row flex-wrap items-center gap-2 px-1">
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
                <div className="flex flex-row flex-wrap items-center gap-2">
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
                <div className="flex flex-row flex-wrap items-center gap-2">
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
          {(() => {
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

            const titleFontSize = "text-[clamp(2.5rem,calc(0.05*100vw),3rem)]"
            return (
              <div className="flex w-full max-w-full flex-col flex-wrap">
                <AnimatePresence mode="wait" propagate>
                  <div className="flex flex-wrap px-8">
                    <motion.span
                      key={`first-${isWrapped ? "wrapped" : "unwrapped"}`}
                      className={`${titleFontSize} text-primary-foreground font-mono font-bold whitespace-nowrap`}
                      initial={
                        isWrapped
                          ? { opacity: 0, x: -100 }
                          : { opacity: 0, y: -100 }
                      }
                      animate={
                        isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
                      }
                      exit={
                        isWrapped
                          ? { opacity: 0, x: 100 }
                          : { opacity: 0, y: 100 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {firstHalf.toLocaleUpperCase()}
                    </motion.span>
                    {words.length > 1 && (
                      <span
                        className={`${titleFontSize} font-mono font-bold whitespace-nowrap`}
                      >
                        &nbsp;
                      </span>
                    )}
                    <motion.span
                      key={`second-${isWrapped ? "wrapped" : "unwrapped"}`}
                      className={`${titleFontSize} font-mono font-bold whitespace-nowrap bg-gradient-to-r from-peach via-flamingo to-rosewater bg-clip-text text-transparent`}
                      initial={
                        isWrapped
                          ? { opacity: 0, x: 100 }
                          : { opacity: 0, y: 100 }
                      }
                      animate={
                        isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
                      }
                      exit={
                        isWrapped
                          ? { opacity: 0, x: -100 }
                          : { opacity: 0, y: -100 }
                      }
                      transition={
                        isWrapped
                          ? { duration: 0.3, delay: 0 }
                          : { duration: 0.3 }
                      }
                    >
                      {secondHalf.toLocaleUpperCase()}
                    </motion.span>
                  </div>
                </AnimatePresence>
              </div>
            )
          })()}
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

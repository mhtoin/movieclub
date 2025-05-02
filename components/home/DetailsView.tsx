import type { MovieWithReviews } from '@/types/movie.type'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, TrendingUp, Users } from 'lucide-react'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { FaImdb } from 'react-icons/fa'
import { SiThemoviedatabase } from 'react-icons/si'

export default React.memo(
  function DetailsView({
    movie,
    isExpanded = true,
  }: {
    movie: MovieWithReviews
    isExpanded?: boolean
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

      // Use ResizeObserver for more accurate detection of container size changes
      const resizeObserver = new ResizeObserver(updateContainerWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current)
        }
      }
    }, [])

    // Calculate wrapping whenever title or container width changes
    useEffect(() => {
      if (containerWidth > 0) {
        // Calculate text width using canvas (pre-render measurement)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (context) {
          context.font = 'bold clamp(0.5rem,calc(0.05*100vw),3rem) monospace'

          const words = movie.title.split(' ')
          let firstHalf = ''
          let secondHalf = ''

          if (words.length <= 1) {
            const midpoint = Math.ceil(movie.title.length / 2)
            firstHalf = movie.title.substring(0, midpoint)
            secondHalf = movie.title.substring(midpoint)
          } else {
            const midWordIndex = Math.floor(words.length / 2)
            firstHalf = words.slice(0, midWordIndex).join(' ')
            secondHalf = words.slice(midWordIndex).join(' ')
          }

          // Get text metrics
          const firstHalfWidth = context.measureText(
            firstHalf.toLocaleUpperCase(),
          ).width
          const secondHalfWidth = context.measureText(
            secondHalf.toLocaleUpperCase(),
          ).width
          const spaceWidth =
            words.length > 1 ? context.measureText(' ').width : 0

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
      <div className="grid grid-cols-8 w-full h-full mt-20 relative">
        <div
          className="col-span-6 relative flex flex-col justify-center overflow-hidden"
          ref={containerRef}
        >
          <AnimatePresence mode="wait" propagate>
            <motion.div
              className="flex flex-col w-full p-8  gap-4"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {movie.user && (
                <div className="flex flex-col gap-2">
                  <img
                    src={movie.user.image}
                    alt={movie.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-sm text-accent-foreground/60">
                    {movie.user.name}
                  </span>
                </div>
              )}
              <div className="flex flex-row gap-2 h-10">
                {movie.genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="text-md text-accent-foreground bg-accent/50 backdrop-blur-md rounded-md px-4 py-4 h-full flex items-center justify-center"
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
              <div className="flex flex-row gap-2 4xl:gap-4 flex-wrap items-center px-1">
                <span className="text-sm md:text-md 4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6" />
                  {movie.watchDate
                    ? new Date(movie?.watchDate).toLocaleDateString('fi-FI')
                    : ''}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="text-sm md:text-md 4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-2">
                  <Star className="w-4 h-4 md:w-6 md:h-6" />
                  {movie?.vote_average.toFixed(1)}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="text-sm md:text-md 4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-2">
                  <Users className="w-4 h-4 md:w-6 md:h-6" />
                  {movie?.vote_count}
                </span>
                <span className="text-primary-foreground/60">|</span>
                <span className="text-sm md:text-md 4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-2">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
                  {movie?.popularity.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-6">
                <div className="flex flex-row gap-2 flex-wrap items-center">
                  {movie?.watchProviders?.providers?.map((provider) => {
                    return (
                      <Link
                        href={movie?.watchProviders?.link || ''}
                        target="_blank"
                        key={provider.provider_id}
                        className="rounded-md hover:bg-accent/50 transition-all duration-300 border border-accent/50"
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={50}
                          height={50}
                          className="rounded-md w-8 h-8 md:w-10 md:h-10"
                        />
                      </Link>
                    )
                  })}
                </div>
                <div className="h-4/5 w-[1px] bg-primary-foreground/60" />
                <div className="flex flex-row gap-2 flex-wrap items-center">
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                    target="_blank"
                  >
                    <SiThemoviedatabase className="w-8 h-8 text-primary-foreground hover:text-accent" />
                  </Link>
                  <Link
                    href={`https://www.imdb.com/title/${movie?.imdbId}`}
                    target="_blank"
                  >
                    <FaImdb className="w-8 h-8 text-primary-foreground hover:text-accent" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {(() => {
            const title = movie.title
            const words = title.split(' ')
            let firstHalf = ''
            let secondHalf = ''

            if (words.length <= 1) {
              const midpoint = Math.ceil(title.length / 2)
              firstHalf = title.substring(0, midpoint)
              secondHalf = title.substring(midpoint)
            } else {
              const midWordIndex = Math.floor(words.length / 2)
              firstHalf = words.slice(0, midWordIndex).join(' ')
              secondHalf = words.slice(midWordIndex).join(' ')
            }

            const titleFontSize = 'text-[clamp(0.5rem,calc(0.05*100vw),3rem)]'
            return (
              <div className="w-full max-w-full flex flex-col flex-wrap">
                <AnimatePresence mode="wait" propagate>
                  <div className="flex flex-wrap px-10">
                    <motion.span
                      key={`first-${isWrapped ? 'wrapped' : 'unwrapped'}`}
                      className={`${titleFontSize} font-bold font-mono whitespace-nowrap text-primary-foreground`}
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
                      transition={{ duration: 0.5 }}
                    >
                      {firstHalf.toLocaleUpperCase()}
                    </motion.span>
                    {words.length > 1 && (
                      <span
                        className={`${titleFontSize} font-bold font-mono whitespace-nowrap`}
                      >
                        &nbsp;
                      </span>
                    )}
                    <motion.span
                      key={`second-${isWrapped ? 'wrapped' : 'unwrapped'}`}
                      className={`${titleFontSize} font-bold font-mono whitespace-nowrap`}
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
                          ? { duration: 0.5, delay: 0.2 }
                          : { duration: 0.5 }
                      }
                      style={{
                        font: 'Arial',
                        WebkitTextStroke: '1px',
                        WebkitTextStrokeColor: 'white',
                        WebkitTextFillColor: 'transparent',
                      }}
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
              className="col-span-2 gap-2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -100,
                transition: { duration: 0.5, delay: 0 },
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full h-full p-10 flex flex-col gap-4">
                <div className="flex flex-col gap-1 bg-accent/60 drop-shadow-md backdrop-blur-md rounded-md p-2 overflow-y-auto max-h-[250px]">
                  <h2 className="text-2xl font-bold text-accent-foreground/60">
                    Overview
                  </h2>
                  <p className="text-xs text-accent-foreground/60 ">
                    {movie.overview}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie?.images?.posters[0]?.file_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
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
      prevProps.isExpanded === nextProps.isExpanded &&
      JSON.stringify(prevProps.movie.tierMovies) ===
        JSON.stringify(nextProps.movie.tierMovies)
    )
  },
)

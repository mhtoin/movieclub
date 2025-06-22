"use client"
import { useRaffle, useShortlistsQuery } from "@/lib/hooks"
import type { MovieWithUser } from "@/types/movie.type"
import * as Ariakit from "@ariakit/react"
import type { SiteConfig } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Dices } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../ui/Button"
import ActionButtons from "./ActionButtons"
import Participants from "./Participants"
import RaffleItems from "./RaffleItems"
import ResultCard from "./ResultCard"

export default function RaffleDialog({
  siteConfig,
}: {
  siteConfig: SiteConfig
}) {
  const dialog = Ariakit.useDialogStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { data: allShortlists } = useShortlistsQuery()
  const [shuffledMovies, setShuffledMovies] = useState<MovieWithUser[]>([])
  const { data, mutate: raffle } = useRaffle()

  const movies: MovieWithUser[] = useMemo(() => {
    return allShortlists
      ? Object.entries(allShortlists)
          .filter(([_, shortlist]) => shortlist.participating)
          .flatMap(([_shortlistId, shortlist]) => {
            return shortlist.requiresSelection &&
              shortlist.selectedIndex !== null &&
              shortlist.selectedIndex !== undefined
              ? {
                  ...shortlist?.movies[shortlist?.selectedIndex],
                  user: shortlist?.user,
                }
              : shortlist?.movies?.map((movie) => ({
                  ...movie,
                  user: shortlist?.user,
                }))
          })
      : []
  }, [allShortlists])

  const allReady = useMemo(() => {
    return allShortlists
      ? Object.values(allShortlists)
          .filter((shortlist) => shortlist.participating)
          .every(
            (shortlist) =>
              shortlist.isReady &&
              (shortlist.requiresSelection
                ? shortlist.selectedIndex !== null &&
                  shortlist.selectedIndex !== undefined
                : true),
          )
      : false
  }, [allShortlists])

  const raffleItemsContainerRef = useRef<HTMLDivElement>(null)

  const nextIndex = useCallback(() => {
    const nextIndex = (currentIndex + 1) % movies.length
    setCurrentIndex(nextIndex)
    const nextMovie = document.getElementById(
      `movie-${shuffledMovies[nextIndex].id}-${shuffledMovies[nextIndex].user?.id}`,
    )

    if (nextMovie && raffleItemsContainerRef.current) {
      const containerRect =
        raffleItemsContainerRef.current.getBoundingClientRect()
      const nextMovieRect = nextMovie.getBoundingClientRect()

      const isVisible =
        nextMovieRect.top >= containerRect.top &&
        nextMovieRect.bottom <= containerRect.bottom

      if (!isVisible) {
        nextMovie.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [currentIndex, movies, shuffledMovies])

  const resetRaffle = useCallback(() => {
    setCurrentIndex(0)
    setCount(0)

    setIsPlaying(false)
    setStarted(false)
    setFinished(false)
  }, [])

  useEffect(() => {
    setShuffledMovies(movies)
  }, [movies])

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex === data?.chosenIndex && count >= 2) {
        setIsPlaying(false)

        setTimeout(() => {
          setFinished(true)
        }, 1000)
      }
      // if the count is greater than 3, then we need start slowing down the interval

      const interval = setInterval(
        () => {
          if (currentIndex === movies.length - 1) {
            const nextCount = count + 1
            setCount(nextCount)
          }
          nextIndex()
        },
        (() => {
          const targetIndex =
            movies.length * 3 - (movies.length - (data?.chosenIndex ?? 0))

          const currentPosition = movies.length * count + currentIndex

          const distanceToTarget = Math.abs(targetIndex - currentPosition)

          const baseTiming = 200

          const smallSlowdown = distanceToTarget <= movies.length / 2 ? 100 : 0

          const mediumSlowdown = distanceToTarget <= movies.length / 4 ? 200 : 0

          const largeSlowdown = distanceToTarget <= movies.length / 8 ? 300 : 0

          const dramaticSlowdown = distanceToTarget <= 3 ? 400 : 0

          return (
            baseTiming +
            largeSlowdown +
            mediumSlowdown +
            smallSlowdown +
            dramaticSlowdown
          )
        })(),
      )
      return () => clearInterval(interval)
    }
  }, [
    isPlaying,
    nextIndex,
    count,
    currentIndex,
    data?.chosenIndex,
    movies.length,
  ])

  return (
    <>
      <Button
        onClick={dialog.show}
        variant={"outline"}
        size={"iconLg"}
        className="rounded-full"
      >
        <Dices className="h-6 w-6" />
      </Button>
      <Ariakit.Dialog
        store={dialog}
        onClose={resetRaffle}
        backdrop={
          <div className="bg-black/5 opacity-0 backdrop-blur-none transition-all duration-300 data-enter:opacity-100 data-enter:backdrop-blur-xs" />
        }
        className="bg-background/80 fixed inset-3 z-9999 m-auto flex max-w-[80vw] origin-bottom-right scale-95 flex-col gap-1 overflow-auto rounded-md border opacity-0 backdrop-blur-md transition-all duration-300 data-enter:scale-100 data-enter:opacity-100 lg:max-w-[70vw] 2xl:max-w-[60vw]"
      >
        {finished && data ? (
          <AnimatePresence mode="wait" presenceAffectsLayout>
            <motion.div
              key="result-view"
              className="flex flex-col items-center justify-center gap-5"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <ResultCard movie={data?.movie} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait" presenceAffectsLayout>
            <motion.div
              key="raffle-view"
              className="flex h-full w-full flex-row items-center justify-center gap-5"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`border-border relative flex h-full flex-col justify-start gap-5 border-r pt-5 transition-all duration-300 ${
                  sidebarExpanded ? "w-[250px]" : "w-[0px]"
                }`}
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    sidebarExpanded ? "-right-3" : "-right-5"
                  }`}
                >
                  <Button
                    variant={"outline"}
                    size={"iconSm"}
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        sidebarExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div
                  className={`overflow-hidden ${
                    sidebarExpanded ? "opacity-100" : "opacity-100"
                  }`}
                >
                  <Participants
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                </div>
              </div>
              <div className="@container/items flex h-full flex-1 flex-col items-center gap-5 pt-5">
                <h3 className="text-lg font-bold">Movies</h3>
                <ActionButtons
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  setStarted={setStarted}
                  shuffledMovies={shuffledMovies}
                  setShuffledMovies={setShuffledMovies}
                  resetRaffle={resetRaffle}
                  raffle={raffle}
                  disabled={!allReady}
                  siteConfig={siteConfig}
                />

                <RaffleItems
                  shuffledMovies={shuffledMovies}
                  currentIndex={currentIndex}
                  started={started}
                  containerRef={raffleItemsContainerRef}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </Ariakit.Dialog>
    </>
  )
}

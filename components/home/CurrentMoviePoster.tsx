"use client"
import DetailsView from "@/components/home/DetailsView"
import MovieReviews from "@/components/home/MovieReviews"
import ViewModeButtons from "@/components/home/ViewModeButtons"
import { useIsMobile } from "@/lib/hooks"
import type { MovieWithReviews } from "@/types/movie.type"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function CurrentMoviePoster({
  mostRecentMovie,
  colors,
}: {
  mostRecentMovie: MovieWithReviews
  colors?: string[]
}) {
  const params = useSearchParams()
  const viewMode = params.get("viewMode") || "details"

  const isMobile = useIsMobile()

  const backgroundImage = mostRecentMovie?.images?.backdrops[0]?.file_path
    ? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.backdrops[0]?.file_path}`
    : `https://image.tmdb.org/t/p/original/${mostRecentMovie?.backdrop_path}`
  const posterImage = mostRecentMovie?.images?.posters[0]?.file_path
    ? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.posters[0]?.file_path}`
    : `https://image.tmdb.org/t/p/original/${mostRecentMovie?.poster_path}`
  const blurDataUrl = mostRecentMovie?.images?.backdrops[0]?.blurDataUrl
  const posterBlurDataUrl = mostRecentMovie?.images?.posters[0]?.blurDataUrl

  return (
    <div className="relative h-full w-full">
      <Image
        src={isMobile ? posterImage : backgroundImage}
        alt={mostRecentMovie?.title}
        className="absolute inset-0 [mask-image:radial-gradient(100%_100%_at_100%_0,#fff,transparent)] object-cover sepia-[0.35]"
        quality={50}
        priority={true}
        fill
        placeholder={blurDataUrl || posterBlurDataUrl ? "blur" : "empty"}
        blurDataURL={isMobile ? posterBlurDataUrl || "" : blurDataUrl || ""}
      />
      <AnimatePresence mode="wait">
        {(viewMode === "details" || !viewMode) && (
          <motion.div
            key="details"
            className="absolute inset-0 overflow-hidden pt-[70px] sm:pt-[90px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DetailsView
              movie={mostRecentMovie}
              isExpanded={true}
              colors={colors}
            />
          </motion.div>
        )}
        {viewMode === "reviews" && (
          <motion.div
            key="reviews"
            className="absolute inset-0 overflow-hidden pt-[70px] sm:pt-[90px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MovieReviews movieReviews={mostRecentMovie?.reviews} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { ReviewWithUser } from "@/types/movie.type"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { type JSONContent, generateHTML } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import StarRadio from "components/tierlist/StarRadio"
import { Button } from "components/ui/Button"
import { useCallback, useEffect, useRef, useState } from "react"

export default function MovieReviews({
  movieReviews,
}: {
  movieReviews: ReviewWithUser[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtonsState = useCallback(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.offsetWidth,
    )
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", updateScrollButtonsState)
      // Initial check
      updateScrollButtonsState()

      return () => {
        container.removeEventListener("scroll", updateScrollButtonsState)
      }
    }
  }, [updateScrollButtonsState])
  // Filter out reviews with null tier fields
  const validReviews = movieReviews.filter(
    (review) => review?.userId && (review?.content || review?.rating !== 0),
  )

  const reviews = validReviews

  // If there are no valid reviews, show a message instead
  if (!validReviews.length) {
    return (
      <div className="absolute inset-0 top-16 flex items-center justify-center">
        <div className="border-border/30 bg-card/50 rounded-md border p-6 backdrop-blur-xs">
          <h2 className="text-lg font-bold">No reviews available</h2>
          <p>There are no reviews for this movie yet.</p>
        </div>
      </div>
    )
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount =
      direction === "left" ? -container.offsetWidth : container.offsetWidth

    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  return (
    <div className="absolute inset-0 top-5 flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <div className="relative w-full max-w-3xl">
        {/* Scroll buttons */}
        <Button
          onClick={() => scroll("left")}
          variant="outline"
          disabled={!canScrollLeft}
          className="bg-opaque-card/80 border-border absolute top-1/2 left-0 z-10 -translate-x-12 -translate-y-1/2 rounded-full border p-2 backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous review"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>

        <Button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="bg-opaque-card/80 border-border absolute top-1/2 right-0 z-10 translate-x-12 -translate-y-1/2 rounded-full border p-2 backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next review"
          variant="outline"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>

        {/* Carousel container */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar w-full snap-x snap-mandatory overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex w-full flex-row">
            {reviews?.map((review, index) => {
              const reviewText = review.content
                ? generateHTML(review?.content as unknown as JSONContent, [
                    StarterKit,
                  ])
                : ""
              return (
                <div
                  key={`${review?.userId || index}`}
                  className="border-border/30 bg-opaqueCard/50 flex w-full shrink-0 snap-center flex-col gap-5 rounded-md border p-6 backdrop-blur-xs"
                >
                  <h2 className="text-primary-foreground text-lg font-bold">
                    {review?.user?.name}
                  </h2>
                  <div className="flex flex-row items-center gap-5 border-b pb-5">
                    <img
                      src={review.user?.image}
                      alt={review.user?.name ?? ""}
                      className="h-10 w-10 rounded-full"
                    />
                    <StarRadio value={review.rating} disabled={true} />
                  </div>
                  <div className="no-scrollbar flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
                    <div
                      className="no-scrollbar prose prose-sm sm:prose-base prose-neutral dark:prose-invert ul-li-p-reset h-full overflow-y-auto focus:outline-hidden"
                      dangerouslySetInnerHTML={{ __html: reviewText }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((_, index) => (
            <Button
              type="button"
              key={index}
              variant="ghost"
              onClick={() => {
                if (!scrollContainerRef.current) return
                const container = scrollContainerRef.current
                const itemWidth = container.offsetWidth
                container.scrollTo({
                  left: itemWidth * index,
                  behavior: "smooth",
                })
              }}
              className={`bg-border hover:bg-primary/70 h-4 w-4 rounded-full p-0 transition-colors ${
                scrollContainerRef.current &&
                Math.round(
                  scrollContainerRef.current.scrollLeft /
                    scrollContainerRef.current.offsetWidth,
                ) === index
                  ? "bg-primary/70"
                  : !scrollContainerRef.current && index === 0
                    ? "bg-primary/70"
                    : ""
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

import TierItem from "@/components/tierlist/TIerItem"
import type { TierMovieWithMovieData } from "@/types/tierlist.type"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function Tier({
  tierIndex,
  tier,
  label,
}: {
  tierIndex: number
  tier: TierMovieWithMovieData[]
  label: string
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const handleScrollRight = (tierIndex: number) => {
    const tier = document.getElementById(`tier-${tierIndex}`)
    if (tier) {
      const currentScrollLeft = tier?.scrollLeft
      const newScrollLeft = currentScrollLeft + 500

      if (newScrollLeft + tier.clientWidth < tier.scrollWidth) {
        tier.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        })
      } else {
        tier.scrollTo({
          left: tier.scrollWidth - tier.clientWidth,
          behavior: "smooth",
        })
      }
      setCanScrollRight(newScrollLeft + tier.clientWidth < tier.scrollWidth)
      setCanScrollLeft(true)
    }
  }

  const handleScrollLeft = (tierIndex: number) => {
    const tier = document.getElementById(`tier-${tierIndex}`)

    if (tier) {
      const currentScrollLeft = tier?.scrollLeft
      const newScrollLeft = currentScrollLeft - 500

      if (newScrollLeft > 0) {
        tier.scrollTo({ left: newScrollLeft, behavior: "smooth" })
      } else {
        tier.scrollTo({ left: 0, behavior: "smooth" })
      }

      setCanScrollLeft(newScrollLeft > 0)
      setCanScrollRight(true)
    }
  }

  useEffect(() => {
    const tier = document.getElementById(`tier-${tierIndex}`)
    if (tier) {
      setCanScrollLeft(tier.scrollLeft > 0)
      setCanScrollRight(tier.scrollLeft + tier.clientWidth < tier.scrollWidth)
    }
  }, [tierIndex])

  return (
    <div
      key={tierIndex}
      className="border-border/70 group relative flex min-h-[200px] max-w-[95dvw] min-w-[95dvw] justify-start gap-2 rounded-md border"
    >
      <div className="bg-background absolute -top-4 flex rounded-md px-2 md:hidden">
        <span className="text-center text-lg font-bold whitespace-normal">
          {label}
        </span>
      </div>
      <button
        className={`to-background hover:bg-accent/10 absolute top-0 left-44 z-9990 hidden h-full w-20 items-center justify-center bg-linear-to-b from-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex ${
          canScrollLeft ? "visible" : "invisible"
        }`}
        type="button"
        onClick={() => handleScrollLeft(tierIndex)}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className={`to-background hover:bg-accent/10 absolute top-0 right-0 z-9990 hidden h-full w-20 items-center justify-center bg-linear-to-b from-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex ${
          canScrollRight ? "visible" : "invisible"
        }`}
        onClick={() => handleScrollRight(tierIndex)}
      >
        <ChevronRight />
      </button>
      {tierIndex === 0 && tier.length === 0 ? (
        <div key={tierIndex} />
      ) : (
        <div
          className={
            "bg-accent hidden w-full max-w-44 items-center justify-center rounded-tl-md rounded-bl-md border p-2 md:flex"
          }
        >
          <span className="w-full text-center text-lg font-bold whitespace-normal">
            {label}
          </span>
        </div>
      )}
      <Droppable
        key={`droppable-${tierIndex}`}
        droppableId={`${tierIndex}`}
        direction="horizontal"
      >
        {(provided, _snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              className="flex max-w-[95dvw] flex-row gap-5 overflow-auto px-2 py-5 md:p-5"
              id={`tier-${tierIndex}`}
              {...provided.droppableProps}
            >
              {tier.map((item, index) => (
                <Draggable
                  key={item?.movieId}
                  draggableId={item?.movieId}
                  index={index}
                >
                  {(provided, _snapshot) => (
                    <TierItem
                      key={item?.movieId}
                      item={item}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>
  )
}

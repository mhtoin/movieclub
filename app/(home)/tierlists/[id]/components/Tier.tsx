import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Tier({
  tierIndex,
  tier,
  tiers,
}: {
  tierIndex: number;
  tier: Movie[];
  tiers: string[];
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScrollRight = (tierIndex: number) => {
    const tier = document.getElementById(`tier-${tierIndex}`);
    if (tier) {
      const currentScrollLeft = tier?.scrollLeft;
      const newScrollLeft = currentScrollLeft + 500;

      if (newScrollLeft + tier.clientWidth < tier.scrollWidth) {
        tier.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      } else {
        tier.scrollTo({
          left: tier.scrollWidth - tier.clientWidth,
          behavior: "smooth",
        });
      }
      setCanScrollRight(newScrollLeft + tier.clientWidth < tier.scrollWidth);
      setCanScrollLeft(true);
    }
  };

  const handleScrollLeft = (tierIndex: number) => {
    const tier = document.getElementById(`tier-${tierIndex}`);

    if (tier) {
      const currentScrollLeft = tier?.scrollLeft;
      const newScrollLeft = currentScrollLeft - 500;

      if (newScrollLeft > 0) {
        tier.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      } else {
        tier.scrollTo({ left: 0, behavior: "smooth" });
      }

      setCanScrollLeft(newScrollLeft > 0);
      setCanScrollRight(true);
    }
  };

  useEffect(() => {
    const tier = document.getElementById(`tier-${tierIndex}`);
    if (tier) {
      setCanScrollLeft(tier.scrollLeft > 0);
      setCanScrollRight(tier.scrollLeft + tier.clientWidth < tier.scrollWidth);
    }
  }, [tier, tierIndex]);

  return (
    <div
      key={tierIndex}
      className="flex gap-2 justify-center border border-border/70 rounded-md relative group max-w-[95dvw] min-h-[200px]"
    >
      <div className="flex md:hidden absolute -top-4 bg-background rounded-md px-2">
        <span className="text-lg font-bold whitespace-normal text-center">
          {tiers[tierIndex]}
        </span>
      </div>
      <button
        className={`hidden md:flex items-center justify-center absolute top-0 left-24 w-20 h-full bg-gradient-to-b from-transparent to-background group-hover:opacity-100 opacity-0 transition-all duration-300 hover:bg-accent/10 ${
          canScrollLeft ? "visible" : "invisible"
        }`}
        onClick={() => handleScrollLeft(tierIndex)}
      >
        <ChevronLeft />
      </button>
      <button
        className={`hidden md:flex items-center justify-center absolute top-0 right-0 w-20 h-full bg-gradient-to-b from-transparent to-background group-hover:opacity-100 opacity-0 transition-all duration-300 hover:bg-accent/10 ${
          canScrollRight ? "visible" : "invisible"
        }`}
        onClick={() => handleScrollRight(tierIndex)}
      >
        <ChevronRight />
      </button>
      {tierIndex === 0 && tier.length === 0 ? (
        <div key={tierIndex}></div>
      ) : (
        <div
          className={`hidden md:flex border rounded-tl-md rounded-bl-md p-2 bg-accent items-center justify-center w-24`}
        >
          <span className="text-lg font-bold whitespace-normal w-24 text-center">
            {tiers[tierIndex]}
          </span>
        </div>
      )}
      <Droppable
        key={`droppable-${tierIndex}`}
        droppableId={`${tierIndex}`}
        direction="horizontal"
      >
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              className="flex flex-row gap-5 overflow-auto px-2 py-5 md:p-5 max-w-[95dvw]"
              id={`tier-${tierIndex}`}
              {...provided.droppableProps}
            >
              {tier.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id!} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className="indicator mx-auto border-2 rounded-md max-w-[120px] md:max-w-[150px] lg:max-w-[200px] shrink-0"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Link href={`/home/movies/${item.id}`}>
                        <Image
                          src={`https://image.tmdb.org/t/p/original/${item["poster_path"]}`}
                          width={200}
                          height={300}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

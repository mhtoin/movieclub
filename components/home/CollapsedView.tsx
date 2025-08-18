import type { MovieWithReviews } from "@/types/movie.type"

export default function CollapsedView({ movie }: { movie: MovieWithReviews }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-2">
      <h2 className="text-primary-foreground text-3xl font-bold [writing-mode:vertical-lr]">
        {movie.title.toLocaleUpperCase()}
      </h2>
      <img
        src={movie.user?.image}
        alt={movie.user?.name}
        className="h-8 w-8 rounded-full"
      />
    </div>
  )
}

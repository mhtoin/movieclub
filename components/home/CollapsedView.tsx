import type { MovieWithReviews } from '@/types/movie.type'

export default function CollapsedView({ movie }: { movie: MovieWithReviews }) {
  return (
    <div className="flex flex-col h-full justify-center gap-5 px-2">
      <h2 className="text-3xl font-bold [writing-mode:vertical-lr] text-primary-foreground">
        {movie.title.toLocaleUpperCase()}
      </h2>
      <img
        src={movie.user?.image}
        alt={movie.user?.name}
        className="w-8 h-8 rounded-full"
      />
    </div>
  )
}

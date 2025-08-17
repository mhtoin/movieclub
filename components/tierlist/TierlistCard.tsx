import { startOfYear } from "date-fns"
import { CornerDownRight } from "lucide-react"
import Link from "next/link"
import DeleteButton from "./DeleteButton"
import { TierlistWithTiers } from "@/types/tierlist.type"
import { getCurrentSession } from "@/lib/authentication/session"

export default async function TierlistCard({
  tierlist,
}: {
  tierlist: TierlistWithTiers
}) {
  const { user } = await getCurrentSession()
  const fromDate = tierlist.watchDate?.from
    ? new Date(tierlist.watchDate.from)
    : new Date(2022, 0, 1)
  const toDate = tierlist.watchDate?.to
    ? new Date(tierlist.watchDate.to)
    : startOfYear(new Date())

  /*const topMovieImage = tierlist?.tiers?.find((tier) => tier.value === 1)
    ?.movies[0]?.movie?.images?.backdrops?.[0]*/
  return (
    <div className="flex flex-col items-center justify-center relative group hover:translate-y-[-2px] transition-all duration-300 ease-in-out">
      {/*<Image
        src={`https://image.tmdb.org/t/p/original/${topMovieImage?.file_path}`}
        alt={topMovieImage?.file_path ?? "Top movie image"}
        width={500}
        height={281}
        className="rounded-lg w-full max-w-2xl h-full object-cover absolute top-0 left-0 z-0 brightness-50"
        placeholder="blur"
        blurDataURL={`https://image.tmdb.org/t/p/w500/${topMovieImage?.blurDataUrl}`}
      />*/}
      <div className="bg-card flex w-full max-w-2xl flex-col items-center justify-center rounded-lg p-4 shadow-md gap-2">
        <span>{`${fromDate.toLocaleDateString("en-FI", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })} - ${toDate.toLocaleDateString("en-FI", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })}`}</span>
        <div className="flex gap-2">
          {tierlist?.genres?.length > 0 ? (
            tierlist.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
              No genre filters
            </span>
          )}
        </div>
      </div>
      <Link href={`/tierlists/${tierlist.userId}/${tierlist.id}`}>
        <CornerDownRight className="absolute bottom-2 right-2 h-3 w-3 text-muted-foreground hover:text-foreground hover:transition-all hover:duration-300 hover:ease-in-out transition-all duration-300 ease-in-out hover:cursor-pointer " />
      </Link>
      {user && user.id === tierlist.userId && (
        <DeleteButton tierlistId={tierlist.id} />
      )}
    </div>
  )
}

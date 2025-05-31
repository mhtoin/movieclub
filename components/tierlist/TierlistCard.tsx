import { Tierlist } from "@prisma/client"
import { startOfYear } from "date-fns"
import { CornerDownRight, X } from "lucide-react"
import Link from "next/link"
import DeleteButton from "./DeleteButton"

export default function TierlistCard({ tierlist }: { tierlist: Tierlist }) {
  const fromDate = tierlist.watchDate?.from
    ? new Date(tierlist.watchDate.from)
    : new Date(2022, 0, 1)
  const toDate = tierlist.watchDate?.to
    ? new Date(tierlist.watchDate.to)
    : startOfYear(new Date())
  return (
    <div className="flex flex-col items-center justify-center relative group hover:translate-y-[-2px] transition-all duration-300 ease-in-out">
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
      <DeleteButton tierlistId={tierlist.id} />
    </div>
  )
}

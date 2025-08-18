import { CastMember, CrewMember } from "@/types/tmdb.type"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/Tooltip"
import Image from "next/image"
import Link from "next/link"
export default function CastPortrait({
  cast,
}: {
  cast: CastMember | CrewMember
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`https://www.themoviedb.org/person/${cast.id}`}
            target="_blank"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w45${cast.profile_path}`}
              unoptimized
              priority={false}
              alt={cast.name}
              width={40}
              height={40}
              className="text-foreground/50 rounded-lg border object-cover text-[8px]"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-card">
          <div className="flex flex-col">
            <span className="font-bold">{cast.name}</span>
            {"character" in cast && cast.character && (
              <span className="text-foreground/50">{cast.character}</span>
            )}
            {"job" in cast && cast.job && (
              <span className="text-foreground/50">{cast.job}</span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

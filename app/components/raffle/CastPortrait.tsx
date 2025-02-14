import Link from "next/link";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "../ui/Tooltip";
import Image from "next/image";
import type { CastMember } from "@/types/tmdb.type";
export default function CastPortrait({ cast }: { cast: CastMember }) {
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
              className="rounded-lg object-cover border text-[8px] text-foreground/50 "
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-card">
          <div className="flex flex-col">
            <span className="font-bold">{cast.name}</span>
            <span className="text-foreground/50">{cast.character}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { SiYoutube } from 'react-icons/si'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/Tooltip'
import Link from 'next/link'

export default function TrailerLink({
  video,
}: {
  video: { id: string; key: string; name: string }
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`https://www.youtube.com/watch?v=${video.key}`}
            target="_blank"
          >
            <SiYoutube className="h-6 w-6" />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-card max-w-40">
          <div className="flex flex-col">
            <span className="font-bold whitespace-pre-line">{video.name}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

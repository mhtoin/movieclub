import type { CastMember } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/Popover'
import { List } from 'lucide-react'
import { Button } from '../ui/Button'
import CastPortrait from './CastPortrait'

export default function CastPopover({ cast }: { cast: Array<CastMember> }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground p-0"
        >
          <List />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex max-h-[500px] flex-col gap-2 overflow-y-auto">
        <div className="flex flex-row flex-wrap gap-5">
          {cast.map((c) => (
            <CastPortrait cast={c} key={c.id} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

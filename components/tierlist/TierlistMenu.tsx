import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/Dropdown"
import { Button } from "../ui/Button"
import { EllipsisVertical, Share2 } from "lucide-react"
import { useState } from "react"
import TierlistShareDialog from "./TierlistShareDialog"
import type { TierlistWithTiers } from "@/types/tierlist.type"

interface TierlistMenuProps {
  tierlist?: TierlistWithTiers
  userId?: string
}

export default function TierlistMenu({ tierlist, userId }: TierlistMenuProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-[99999]">
          <DropdownMenuItem asChild className="w-full">
            <Button variant="ghost">Save as new</Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-full">
            <Button variant="ghost">Apply template</Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {tierlist && userId && (
            <DropdownMenuItem asChild className="w-full">
              <Button
                variant="ghost"
                onClick={() => setShareDialogOpen(true)}
                className="justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Tierlist
              </Button>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="w-full">
            <Button variant="ghost">Delete</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {tierlist && userId && (
        <TierlistShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          tierlist={tierlist}
          userId={userId}
        />
      )}
    </>
  )
}

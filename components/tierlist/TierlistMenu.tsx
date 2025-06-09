import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown"
import { Button } from "../ui/Button"
import { EllipsisVertical } from "lucide-react"

export default function TierlistMenu() {
  return (
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
        <DropdownMenuItem asChild className="w-full">
          <Button variant="ghost">Delete</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

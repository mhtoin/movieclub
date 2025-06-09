"use client"
import { useTransition } from "react"
import { Button } from "../ui/Button"
import { X } from "lucide-react"
import { deleteTierlist } from "@/lib/actions/tierlist/actions"

export default function DeleteButton({ tierlistId }: { tierlistId: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      variant="outline"
      size={"iconXs"}
      isLoading={isPending}
      onClick={async () => {
        startTransition(async () => {
          await deleteTierlist(tierlistId)
        })
      }}
      className="absolute -top-2 -right-2 group-hover:opacity-100 opacity-0 bg-destructive transition-all duration-300 ease-in-out"
    >
      <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 ease-in-out" />
    </Button>
  )
}

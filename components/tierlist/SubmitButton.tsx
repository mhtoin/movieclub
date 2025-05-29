import { createTierlist } from "@/lib/actions/tierlist/actions"
import { Button } from "../ui/Button"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  tiers,
  date,
  selectedGenres,
  user,
}: {
  tiers: { value: number; label?: string }[]
  date: { from?: Date; to?: Date } | undefined
  selectedGenres: string[]
  user?: { id: string }
}) {
  const { pending } = useFormStatus()
  return (
    <Button
      variant="outline"
      isLoading={pending}
      onClick={async () => {
        // Handle tierlist creation logic here
        console.log("Creating tierlist with tiers:", tiers)
        console.log("Selected date range:", date)
        console.log("Selected genres:", selectedGenres)

        // Filter out tiers with empty labels
        const validTiers = tiers.filter(
          (tier): tier is { value: number; label: string } =>
            typeof tier.label === "string" && tier.label.trim() !== "",
        )

        // Check if we have any valid tiers
        if (validTiers.length === 0) {
          alert("Please define at least one tier with a label.")
          return
        }

        // Only pass date if both from and to are defined
        const validDateRange =
          date && date.from && date.to
            ? {
                from: date.from,
                to: date.to,
              }
            : undefined
        if (user) {
          const createdTierlist = await createTierlist(
            user.id,
            validTiers,
            validDateRange,
            selectedGenres,
          )

          console.log("Created tierlist in dialog:", createdTierlist)
        }
      }}
    >
      Create Tierlist
    </Button>
  )
}

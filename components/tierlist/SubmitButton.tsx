import { Button } from "../ui/Button"
import { useFormStatus } from "react-dom"

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button variant="outline" isLoading={pending} type="submit">
      Create Tierlist
    </Button>
  )
}

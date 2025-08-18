import { X } from "lucide-react"
import { Button } from "../ui/Button"

export default function KeywordTag({
  keyword,
  handleClick,
}: {
  keyword: { id: number; name: string }
  handleClick: (keyword: { id: number; name: string }) => void
}) {
  return (
    <div className="bg-secondary text-primary-foreground hover:bg-secondary/80 relative inline-flex h-7 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors">
      <span className="max-w-[120px] truncate">{keyword?.name}</span>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="hover:bg-destructive/20 hover:text-destructive h-4 w-4 rounded-full p-0"
        onClick={(e) => {
          e.preventDefault()
          handleClick(keyword)
        }}
        aria-label={`Remove ${keyword?.name} keyword`}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

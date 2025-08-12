import { Input } from "@/components/ui/Input"
import { Calendar } from "lucide-react"

interface GeneralTabProps {
  session: {
    name?: string | null
    email?: string | null
    id: string
  }
}

export function GeneralTab({ session }: GeneralTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Name
          </label>
          <Input value={session.name || ""} readOnly className="bg-muted/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Email
          </label>
          <Input value={session.email || ""} readOnly className="bg-muted/50" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          User ID
        </label>
        <Input
          value={session.id || ""}
          readOnly
          className="bg-muted/50 font-mono text-xs"
        />
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Member since {new Date().getFullYear()}
        </span>
      </div>
    </div>
  )
}

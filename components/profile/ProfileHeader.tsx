import { User } from "lucide-react"

interface ProfileHeaderProps {
  userName: string
}

export function ProfileHeader({ userName }: ProfileHeaderProps) {
  return (
    <div className="border-b px-6 py-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">Welcome back, {userName}</p>
        </div>
      </div>
    </div>
  )
}

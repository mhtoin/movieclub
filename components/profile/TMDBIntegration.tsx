import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ExternalLink } from "lucide-react"

interface TMDBIntegrationProps {
  session: {
    tmdbSessionId?: string | null
    tmdbAccountId?: number | null
  }
  isConnected: boolean
  onConnect: () => void
  isConnecting: boolean
}

export function TMDBIntegration({
  session,
  isConnected,
  onConnect,
  isConnecting,
}: TMDBIntegrationProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-col gap-4 lg:flex-row md:items-center justify-between mb-4">
        <div className="flex flex-col gap-4 md:flex-row items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              The Movie Database (TMDB)
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect your TMDB account for enhanced movie data and
              recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`}
          ></div>
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Not Connected"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Account ID
            </label>
            <Input
              value={
                session.tmdbAccountId
                  ? session.tmdbAccountId.toString()
                  : "Not connected"
              }
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Session ID
            </label>
            <Input
              value={session.tmdbSessionId ? "••••••••" : "Not connected"}
              readOnly
              className="bg-muted/50 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onConnect}
            className="flex items-center space-x-2"
            variant={"outline"}
            disabled={isConnecting}
          >
            <ExternalLink className="w-4 h-4" />
            <span>
              {isConnecting
                ? "Connecting..."
                : isConnected
                  ? "Reconnect"
                  : "Connect"}{" "}
              TMDB Account
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

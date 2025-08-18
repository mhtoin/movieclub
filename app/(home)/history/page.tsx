import { Suspense } from "react"
import WatchHistory from "./WatchHistory"

export default function HistoryPage() {
  return (
    <div className="pt-[70px] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Watch History</h1>
          <p className="text-muted-foreground">
            A timeline of all the movies we&apos;ve watched together
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <WatchHistory />
        </Suspense>
      </div>
    </div>
  )
}
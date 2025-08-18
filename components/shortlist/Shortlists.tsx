"use client"
import {
  useIsMobile,
  useSuspenseShortlistsQuery,
  useValidateSession,
} from "@/lib/hooks"
import ShortlistCard from "components/shortlist/ShortlistCard"
import { LoaderCircle } from "lucide-react"
import ShortlistDrawer from "./ShortlistDrawer"

export default function Shortlists() {
  const { data: user } = useValidateSession()
  const isMobile = useIsMobile()

  const { data: allShortlists, isLoading } = useSuspenseShortlistsQuery()

  if (isMobile === undefined || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="no-scrollbar flex max-h-dvh w-full flex-row overflow-hidden">
        <div className="fixed bottom-0 left-0 z-10">
          <ShortlistDrawer />
        </div>
        <main className="flex h-full w-full flex-col items-center justify-center gap-5 p-2 pt-10">
          <div className="bg-secondary relative h-[1px] w-1/2">
            <h3 className="bg-background absolute -top-4 left-1/2 flex -translate-x-1/2 items-center justify-center px-2 text-2xl font-bold">
              Shortlists
            </h3>
          </div>
          {user && (
            <div className="4xl:grid-cols-3 no-scrollbar grid grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2">
              {Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
                if (shortlistId !== user?.shortlistId) {
                  return (
                    <ShortlistCard key={shortlistId} shortlist={shortlist} />
                  )
                }
              })}
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-5 p-2 pt-10">
      <div className="bg-secondary relative h-[1px] w-1/2">
        <h3 className="bg-background absolute -top-4 left-1/2 flex -translate-x-1/2 items-center justify-center px-2 text-2xl font-bold">
          Shortlists
        </h3>
      </div>
      {user && (
        <div className="4xl:grid-cols-3 no-scrollbar grid grid-cols-1 gap-4 overflow-y-auto p-5 lg:grid-cols-2">
          {Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
            if (shortlistId !== user?.shortlistId) {
              return <ShortlistCard key={shortlistId} shortlist={shortlist} />
            }
          })}
        </div>
      )}
    </main>
  )
}

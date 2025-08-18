import { TabsContent } from "@/components/ui/Tabs"
import { useRef } from "react"

export default function SkeletonRecommendedTab() {
  const skeletonRef = useRef<HTMLDivElement>(null)

  // Create an array to simulate multiple recommendation sections
  const skeletonSections = Array.from({ length: 2 }, (_, i) => i)

  return (
    <TabsContent
      value="recommended"
      className="overflow-y-auto"
      style={{ maxHeight: "calc(90vh - 150px)" }}
      ref={skeletonRef}
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-2 py-2">
        {skeletonSections.map((section) => (
          <div key={section} className="bg-input/80 w-full rounded-md p-2">
            {/* Skeleton for "Because you liked" header */}
            <div className="bg-accent/30 sticky top-0 z-10 mb-2 h-7 w-48 animate-pulse rounded-md p-2 text-sm font-semibold" />

            {/* Grid of skeleton movie cards */}
            <div className="grid w-full auto-rows-[min-content] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-y-5">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="bg-card/50 m-2 flex flex-col space-y-3 rounded-lg"
                >
                  {/* Skeleton poster */}
                  <div className="bg-accent/60 aspect-2/3 w-full animate-pulse rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  )
}

'use client'
import { Button } from 'components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ExpandableSidebar({
  width = 'w-96',
  children,
}: {
  width?: string
  children: React.ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  return (
    <aside
      className={`relative hidden h-full transition-all md:block max-${width} duration-300 ${isExpanded ? width : 'w-0'}`}
    >
      <div className="border-border/10 dark:border-border/40 no-scrollbar relative mt-1.5 h-full gap-5 overflow-y-auto border-r pb-4">
        {children}
      </div>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <ChevronRight className="ml-3 h-6 w-6 transition-transform duration-300" />
        )}
      </Button>
    </aside>
  )
}

'use client'

import DateSelect from '@/components/home/DateSelect'
import RaffleDialog from '@/components/raffle/RaffleDialog'
import type { SiteConfig } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { WrenchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function ToolBar({
  months,
  siteConfig,
}: {
  months: { month: string; label: string }[]
  siteConfig: SiteConfig
}) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  if (pathname && pathname !== '/home') {
    return (
      <div className="group fixed bottom-5 left-5 isolate z-8000 flex flex-col items-center justify-center gap-2">
        <RaffleDialog siteConfig={siteConfig} />
      </div>
    )
  }
  return (
    <button
      type="button"
      className="group fixed bottom-5 left-5 isolate z-8000 flex flex-col items-center justify-center gap-2"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className="bg-background hover:bg-accent/20 group-hover:bg-accent relative flex h-14 w-14 flex-col items-center justify-center gap-2 rounded-full border p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
        data-expanded={isExpanded}
      >
        <WrenchIcon className="h-6 w-6" />
        <AnimatePresence mode="wait" propagate>
          {isExpanded && (
            <motion.div
              key="raffle"
              className="absolute -right-16 -bottom-0 flex flex-col items-center justify-center gap-2 rounded-full"
              initial={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
              transition={{
                type: 'spring',
                duration: 0.8,
                bounce: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-primary-foreground text-xs font-medium">
                Raffle
              </span>
              <RaffleDialog siteConfig={siteConfig} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" propagate>
          {isExpanded && (
            <motion.div
              key="raffle"
              className="absolute -top-20 -right-8 flex flex-col items-center justify-center gap-2 rounded-full"
              initial={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
              transition={{
                type: 'spring',
                duration: 0.8,
                bounce: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DateSelect months={months} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-primary-foreground text-xs font-medium">Tools</p>
    </button>
  )
}

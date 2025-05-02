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
      <div className="fixed flex flex-col items-center justify-center gap-2 bottom-5 left-5 group isolate z-8000">
        <RaffleDialog siteConfig={siteConfig} />
      </div>
    )
  }
  return (
    <button
      type="button"
      className="fixed flex flex-col items-center justify-center gap-2 bottom-5 left-5 group isolate z-8000"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className="w-14 h-14 flex items-center justify-center gap-2 flex-col bg-background relative border rounded-full p-4 hover:bg-accent/20 group-hover:scale-105 group-hover:shadow-lg group-hover:bg-accent transition-all duration-300"
        data-expanded={isExpanded}
      >
        <WrenchIcon className="w-6 h-6" />
        <AnimatePresence mode="wait" propagate>
          {isExpanded && (
            <motion.div
              key="raffle"
              className="absolute -bottom-0 -right-16 gap-2 rounded-full flex flex-col items-center justify-center"
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
              <span className="text-xs font-medium text-primary-foreground">
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
              className="absolute -top-20 -right-8 gap-2 rounded-full flex flex-col items-center justify-center"
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
      <p className="text-xs font-medium text-primary-foreground">Tools</p>
    </button>
  )
}

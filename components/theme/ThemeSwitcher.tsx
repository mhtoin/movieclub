'use client'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '../ui/Button'

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant={'ghost'}
      size={'icon'}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="group relative overflow-hidden hover:bg-transparent"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.div
          animate={{
            opacity: resolvedTheme === 'dark' ? 1 : 0,
            y: resolvedTheme === 'dark' ? 0 : 10,
            scale: resolvedTheme === 'dark' ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <MoonIcon className="h-5 w-5 font-bold shadow-lg drop-shadow-lg transition-all duration-300 group-hover:text-gray-300 group-hover:drop-shadow-md" />
        </motion.div>

        <motion.div
          animate={{
            opacity: resolvedTheme === 'light' ? 1 : 0,
            y: resolvedTheme === 'light' ? 0 : -10,
            scale: resolvedTheme === 'light' ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <SunIcon className="h-5 w-5 font-bold text-yellow-700 drop-shadow-lg transition-all duration-300 group-hover:text-yellow-500 group-hover:drop-shadow-md" />
        </motion.div>
      </div>
    </Button>
  )
}

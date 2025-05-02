import { WatchdatePicker } from '@/components/raffle/WatchdatePicker'
import { useValidateSession } from '@/lib/hooks'
import { getNextDefaultWatchDate, shuffle } from '@/lib/utils'
import type { MovieWithUser } from '@/types/movie.type'
import type { SiteConfig } from '@prisma/client'
import type { UseMutateFunction } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Dices } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../ui/Button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/Tooltip'
import DevTools from './DevTools'

interface ActionButtonsProps {
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  setStarted: (started: boolean) => void
  shuffledMovies: MovieWithUser[]
  setShuffledMovies: (shuffledMovies: MovieWithUser[]) => void
  resetRaffle: () => void
  raffle: UseMutateFunction<
    {
      movie: MovieWithUser
      chosenIndex: number
    },
    Error,
    {
      movies: MovieWithUser[]
      startingUserId: string
      watchDate: string
    },
    unknown
  >
  disabled: boolean
  siteConfig: SiteConfig
}

export default function ActionButtons({
  isPlaying,
  setIsPlaying,
  setStarted,
  shuffledMovies,
  setShuffledMovies,
  raffle,
  disabled,
  siteConfig,
}: ActionButtonsProps) {
  const { data: user } = useValidateSession()
  const [noSave, setNoSave] = useState(false)
  const [resultScreen, setResultScreen] = useState(false)
  const [watchDate, setWatchDate] = useState<Date>(
    new Date(getNextDefaultWatchDate(siteConfig.watchWeekDay)),
  )
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview'

  const performShuffles = useCallback(
    async (movies: MovieWithUser[], shuffleCount = 4) => {
      let currentMovies = [...movies]

      for (let i = 0; i < shuffleCount; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500))

        currentMovies = shuffle(currentMovies)
        setShuffledMovies(currentMovies)
      }

      return currentMovies
    },
    [setShuffledMovies],
  )

  const startRaffle = useCallback(async () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    const finalShuffledMovies = await performShuffles(shuffledMovies)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStarted(true)
    setIsPlaying(true)

    raffle({
      movies: finalShuffledMovies,
      startingUserId: user?.id || '',
      watchDate: format(watchDate, 'yyyy-MM-dd'),
    })
  }, [
    isPlaying,
    setIsPlaying,
    setStarted,
    performShuffles,
    shuffledMovies,
    raffle,
    user,
    watchDate,
  ])

  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'outline'}
              size={'default'}
              className={`py-5 ${disabled ? 'cursor-not-allowed' : ''}`}
              disabled={disabled}
              onClick={startRaffle}
            >
              <div className="flex flex-row gap-2 items-center">
                <Dices className="w-6 h-6" />
                Start
              </div>
            </Button>
          </TooltipTrigger>

          <TooltipContent
            className={`bg-card max-w-40 p-2 ${disabled ? '' : 'hidden'}`}
          >
            <p>
              All shortlists must be ready and last week&apos;s winner must have
              selected their movie to start the raffle
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <WatchdatePicker watchDate={watchDate} setWatchDate={setWatchDate} />
      {isDev && (
        <DevTools
          noSave={noSave}
          setNoSave={setNoSave}
          resultScreen={resultScreen}
          setResultScreen={setResultScreen}
        />
      )}
    </div>
  )
}

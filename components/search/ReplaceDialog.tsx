'use client'
import {
  useIsMobile,
  useReplaceShortlistMutation,
  useShortlistQuery,
  useValidateSession,
} from '@/lib/hooks'
import { useDialogStore } from '@/stores/useDialogStore'
import * as Ariakit from '@ariakit/react'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '../ui/Button'

import MovieCard from '@/components/search/MovieCard'
import ShortListItem from 'components/shortlist/ShortlistItem'
import { Drawer, DrawerContent } from '../ui/Drawer'

export default function ReplaceDialog() {
  const isMobile = useIsMobile()
  const dialog = Ariakit.useDialogStore()
  const isOpen = useDialogStore.use.isOpen()
  const setIsOpen = useDialogStore.use.setIsOpen()
  const movie = useDialogStore.use.movie()
  const { data: session } = useValidateSession()
  const { data: shortlist } = useShortlistQuery(session?.shortlistId || '')
  const shortlistUpdateMutation = useReplaceShortlistMutation()

  const isTMDBMovie = movie && 'tmdbId' in movie

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        setBackgroundColorOnScale={false}
        shouldScaleBackground={true}
      >
        <DrawerContent>
          <div className="flex max-h-[90dvh] flex-col items-center gap-5 overflow-auto p-5">
            <div className="flex flex-col items-center justify-center gap-2">
              {isTMDBMovie && shortlist ? (
                <ShortListItem movie={movie} shortlistId={shortlist?.id} />
              ) : movie && !isTMDBMovie && shortlist ? (
                <MovieCard movie={movie} />
              ) : null}
            </div>

            <span className="text-muted-foreground text-sm">
              Only 3 movies allowed in a shortlist, replace one of the movies
              below
            </span>

            <div className="flex flex-row flex-wrap items-center justify-center gap-2">
              {shortlist?.movies?.map((shortlistMovie) => (
                <div
                  className="flex flex-col items-center justify-center gap-2"
                  key={shortlistMovie.id}
                >
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => {
                      if (movie) {
                        shortlistUpdateMutation.mutate({
                          replacedMovie: shortlistMovie,
                          replacingWithMovie: movie,
                          shortlistId: shortlist.id,
                        })
                      }
                    }}
                    isLoading={
                      shortlistUpdateMutation.isPending &&
                      shortlistUpdateMutation.variables?.replacedMovie.id ===
                        shortlistMovie.id
                    }
                  >
                    <ArrowRightLeft />
                  </Button>
                  <ShortListItem
                    movie={shortlistMovie}
                    shortlistId={shortlist.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Ariakit.Dialog
      store={dialog}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      backdrop={<div className="bg-black/5 backdrop-blur-xs" />}
      className="bg-background fixed inset-3 z-9999 m-auto flex max-w-fit min-w-96 flex-col gap-1 overflow-auto rounded-lg border py-2"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 overflow-auto p-5">
        <div className="flex flex-col items-center justify-center gap-2">
          {isTMDBMovie && shortlist ? (
            <ShortListItem movie={movie} shortlistId={shortlist?.id} />
          ) : movie && !isTMDBMovie && shortlist ? (
            <MovieCard movie={movie} />
          ) : null}
        </div>

        <span className="text-muted-foreground text-sm">
          Only 3 movies allowed in a shortlist, replace one of the movies below
        </span>

        <div className="grid grid-cols-3 gap-2 p-2">
          {shortlist?.movies?.map((shortlistMovie) => (
            <div
              className="flex flex-col items-center justify-center gap-2"
              key={shortlistMovie.id}
            >
              <Button
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                  if (movie) {
                    if ('tmdbId' in movie) {
                      shortlistUpdateMutation.mutate({
                        replacedMovie: shortlistMovie,
                        replacingWithMovie: movie,
                        shortlistId: shortlist.id,
                      })
                    } else if (typeof movie.id === 'number') {
                      shortlistUpdateMutation.mutate({
                        replacedMovie: shortlistMovie,
                        replacingWithMovie: movie,
                        shortlistId: shortlist.id,
                      })
                    }
                  }
                }}
                isLoading={
                  shortlistUpdateMutation.isPending &&
                  shortlistUpdateMutation.variables?.replacedMovie.id ===
                    shortlistMovie.id
                }
              >
                <ArrowRightLeft />
              </Button>
              <ShortListItem
                movie={shortlistMovie}
                shortlistId={shortlist.id}
              />
            </div>
          ))}
        </div>
      </div>
    </Ariakit.Dialog>
  )
}

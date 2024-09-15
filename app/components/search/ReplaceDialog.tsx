"use client";
import * as Ariakit from "@ariakit/react";
import { useDialogStore } from "@/stores/useDialogStore";
import { Button } from "../ui/Button";
import {
  useIsMobile,
  useReplaceShortlistMutation,
  useShortlistQuery,
  useValidateSession,
} from "@/lib/hooks";
import { ArrowRightLeft } from "lucide-react";
import ShortListItem from "@/app/home/shortlist/edit/components/ShortListItem";
import { Drawer, DrawerContent } from "../ui/Drawer";

export default function ReplaceDialog() {
  const isMobile = useIsMobile();
  const dialog = Ariakit.useDialogStore();
  const isOpen = useDialogStore.use.isOpen();
  const setIsOpen = useDialogStore.use.setIsOpen();
  const movie = useDialogStore.use.movie();
  const { data: session } = useValidateSession();
  const { data: shortlist } = useShortlistQuery(session?.shortlistId || "");
  const shortlistUpdateMutation = useReplaceShortlistMutation();

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        setBackgroundColorOnScale={false}
        shouldScaleBackground={true}
      >
        <DrawerContent>
          <div className="flex flex-col gap-5 max-h-[90dvh] p-5 overflow-auto items-center">
            <div className="flex flex-col gap-2 justify-center items-center">
              {movie && (
                <ShortListItem movie={movie} shortlistId={shortlist?.id} />
              )}
            </div>

            <span className="text-sm text-muted-foreground">
              Only 3 movies allowed in a shortlist, replace one of the movies
              below
            </span>

            <div className="flex flex-row items-center gap-2 flex-wrap justify-center">
              {shortlist?.movies?.map((shortlistMovie: Movie) => (
                <div
                  className="flex flex-col gap-2 justify-center items-center"
                  key={shortlistMovie.id}
                >
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => {
                      shortlistUpdateMutation.mutate({
                        replacedMovie: shortlistMovie,
                        replacingWithMovie: movie!,
                        shortlistId: shortlist.id,
                      });
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
                    movie={shortlistMovie as Movie}
                    shortlistId={shortlist.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Ariakit.Dialog
      store={dialog}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      backdrop={<div className="bg-black/5 backdrop-blur-sm " />}
      className="fixed z-[9999] inset-3 flex flex-col gap-1 overflow-auto border rounded-lg max-w-fit min-w-96 h-fit max-h-[65vh] m-auto bg-background"
    >
      <div className="flex flex-col gap-5 overflow-auto w-full h-full items-center justify-center p-5">
        <div className="flex flex-col gap-2 justify-center items-center">
          {movie && <ShortListItem movie={movie} shortlistId={shortlist?.id} />}
        </div>

        <span className="text-sm text-muted-foreground">
          Only 3 movies allowed in a shortlist, replace one of the movies below
        </span>

        <div className="flex flex-row items-center gap-2 p-2">
          {shortlist?.movies?.map((shortlistMovie: Movie) => (
            <div
              className="flex flex-col gap-2 justify-center items-center"
              key={shortlistMovie.id}
            >
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  shortlistUpdateMutation.mutate({
                    replacedMovie: shortlistMovie,
                    replacingWithMovie: movie!,
                    shortlistId: shortlist.id,
                  });
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
                movie={shortlistMovie as Movie}
                shortlistId={shortlist.id}
              />
            </div>
          ))}
        </div>
      </div>
    </Ariakit.Dialog>
  );
}

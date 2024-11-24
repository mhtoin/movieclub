import ShortListItem from "@/app/(home)/home/shortlist/edit/components/ShortListItem";
import { Button } from "components/ui/Button";
import {
  useGetWatchlistQuery,
  useUpdateReadyStateMutation,
  useValidateSession,
} from "@/lib/hooks";
import { MessageCircleWarning } from "lucide-react";
import ItemSkeleton from "@/app/(home)/home/shortlist/edit/components/ItemSkeleton";
import WatchlistButton from "@/app/(home)/home/shortlist/edit/components/WatchlistButton";
import SearchButton from "@/app/(home)/home/shortlist/edit/components/SearchButton";
import { useEffect, useRef } from "react";

export default function ShortlistCard({
  shortlist,
}: {
  shortlist: Shortlist | null;
}) {
  const readyStateMutation = useUpdateReadyStateMutation();
  const { data: user } = useValidateSession();
  const movies = (shortlist?.movies as Movie[]) || [];
  const { data: watchlist } = useGetWatchlistQuery(user || null);
  const movieRefs = useRef<React.RefObject<HTMLDivElement>[]>();

  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];
  const isEditable = shortlist && shortlist.userId === user?.id;

  return (
    <div
      key={`fragment-${shortlist?.id}`}
      className="flex flex-col justify-between border rounded-xl p-3 gap-2 bg-card/20 h-full backdrop-blur-lg"
    >
      <div
        key={shortlist?.id + "-container"}
        className="flex flex-row flex-wrap sm:w-auto items-center justify-center border rounded-md p-3 gap-2 bg-background  overflow-hidden"
      >
        {shortlist?.movies.map((movie: Movie, index: number) => {
          const isInWatchlist = watchlist?.some(
            (watchlistMovie) => watchlistMovie.id === movie.tmdbId
          );

          return (
            <ShortListItem
              key={shortlist.id + movie.id}
              movie={movie}
              shortlistId={shortlist.id}
              highlight={
                shortlist.requiresSelection && shortlist.selectedIndex === index
                  ? true
                  : false
              }
              requiresSelection={shortlist.requiresSelection}
              removeFromShortList={user?.id === shortlist.userId}
              index={index}
              showActions={true}
              isInWatchlist={isInWatchlist}
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      <div
        className="flex flex-row w-full items-center justify-between gap-5 p-3 border rounded-xl bg-background "
        key={`name-container-${shortlist?.id}`}
      >
        <div className="flex flex-row items-center gap-3">
          <Button
            variant={"outline"}
            size={"avatarSm"}
            className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
              shortlist?.isReady ? "outline-success" : "outline-error"
            }
        ${isEditable && readyStateMutation.isPending ? "animate-pulse" : ""}
        }`}
            key={`avatar-${shortlist?.userId}`}
            onClick={() => {
              if (isEditable && shortlist) {
                readyStateMutation.mutate({
                  shortlistId: shortlist.id,
                  isReady: !shortlist.isReady,
                  userId: shortlist.userId,
                });
              }
            }}
          >
            <img
              src={shortlist?.user?.image}
              alt=""
              key={`profile-img-${shortlist?.userId}`}
            />
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">
              {shortlist?.user?.name}
            </span>
          </div>
        </div>
        {shortlist?.requiresSelection &&
        (shortlist.selectedIndex === -1 || shortlist.selectedIndex === null) ? (
          <div className="flex flex-row border rounded-xl p-3 items-center justify-center">
            <MessageCircleWarning className="w-4 h-4 mr-2 " />
            <span>Select a movie!!</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

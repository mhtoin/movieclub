import WatchlistButton from "@/app/home/shortlist/edit/components/WatchlistButton";
import { Button } from "../../ui/Button";
import { useUpdateReadyStateMutation, useValidateSession } from "@/lib/hooks";
import ItemSkeleton from "@/app/home/shortlist/edit/components/ItemSkeleton";
import { useSession } from "next-auth/react";
import SearchButton from "@/app/home/shortlist/edit/components/SearchButton";
import ShortListItem from "@/app/home/shortlist/edit/components/ShortListItem";
import ShortlistItem from "./ShortlistItem";
import { MessageCircleWarning } from "lucide-react";

export default function ShortlistCard({
  shortlist,
}: {
  shortlist: Shortlist | null;
}) {
  const readyStateMutation = useUpdateReadyStateMutation();
  const { data: user } = useValidateSession();
  const movies = (shortlist?.movies as Movie[]) || [];
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
      className="flex flex-col justify-between border rounded-3xl p-3 gap-2 bg-card h-full"
    >
      <div
        key={shortlist?.id + "-container"}
        className="flex flex-row flex-wrap gap-3 h-full sm:w-auto items-center justify-center p-2 lg:p-3 border rounded-xl bg-background"
      >
        {shortlist?.movies.map((movie: Movie, index: number) => {
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
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      <div
        className="flex flex-row w-full items-center justify-between gap-5 p-3 border rounded-xl bg-background h-[100px]"
        key={`name-container-${shortlist?.id}`}
      >
        <div className="flex flex-row items-center gap-2">
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
            {isEditable && (
              <div className="flex flex-row">
                <SearchButton />
                <WatchlistButton />
              </div>
            )}
          </div>
        </div>
        {shortlist?.requiresSelection && shortlist.selectedIndex === -1 ? (
          <div className="flex flex-row border rounded-xl p-3 items-center justify-center">
            <MessageCircleWarning className="w-4 h-4 mr-2 " />
            <span>Select a movie!!</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

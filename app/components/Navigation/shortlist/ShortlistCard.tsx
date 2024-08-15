import SelectionAlert from "@/app/home/shortlist/edit/components/SelectionAlert";
import ShortListItem from "@/app/home/shortlist/edit/components/ShortListItem";
import WatchlistButton from "@/app/home/shortlist/edit/components/WatchlistButton";
import { Button } from "../../ui/Button";
import { useUpdateReadyStateMutation } from "@/lib/hooks";
import ItemSkeleton from "@/app/home/shortlist/edit/components/ItemSkeleton";
import { useSession } from "next-auth/react";
import SearchButton from "@/app/home/shortlist/edit/components/SearchButton";

export default function ShortlistCard({ shortlist }: { shortlist: Shortlist }) {
  const readyStateMutation = useUpdateReadyStateMutation();
  const { data: session } = useSession();
  const movies = (shortlist?.movies as Movie[]) || [];
  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];
  const isEditable = shortlist && shortlist.userId === session?.user?.userId;
  return (
    <div
      key={`fragment-${shortlist?.id}`}
      className="flex flex-col  border rounded-3xl p-5 gap-2 bg-card"
    >
      <div
        key={shortlist?.id + "-container"}
        className="flex flex-row gap-5 sm:w-auto items-center p-2 lg:p-5 border rounded-xl bg-background h-2/3"
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
              removeFromShortList={true}
              index={index}
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      <div
        className="flex flex-row w-full items-center gap-5 p-5 border rounded-xl bg-background h-1/3"
        key={`name-container-${shortlist?.id}`}
      >
        <Button
          variant={"outline"}
          size={"avatar"}
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
          <span className="text-muted-foreground">{shortlist?.user?.name}</span>
          {isEditable && (
            <div className="flex flex-row">
              <SearchButton />
              <WatchlistButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

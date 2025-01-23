import ShortListItem from "@/app/(home)/home/shortlist/edit/components/ShortListItem";
import { Button } from "components/ui/Button";
import {
  useUpdateParticipationMutation,
  useUpdateReadyStateMutation,
  useValidateSession,
} from "@/lib/hooks";

import { useSuspenseShortlistsQuery } from "@/lib/hooks";
import { ParticipationButton } from "../raffle/ParticipationButton";

export default function ShortlistSidebar() {
  const { data: user } = useValidateSession();

  const {
    data: allShortlists,
    isLoading,
    status,
  } = useSuspenseShortlistsQuery();
  const userShortlist = user?.shortlistId
    ? allShortlists?.[user?.shortlistId]
    : null;
  const readyStateMutation = useUpdateReadyStateMutation();
  const participationMutation = useUpdateParticipationMutation();
  return (
    <aside className="w-96 border-r border-border gap-5 h-[calc(100dvh-70px)] overflow-y-auto no-scrollbar pt-[20px]">
      <div className="flex flex-col items-center justify-center gap-5 ">
        <div className="sticky top-0 bg-background flex flex-col items-center justify-center gap-10 z-20 w-full py-5">
          <div className="w-1/2 h-[1px] bg-secondary relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
              {userShortlist?.user?.name}
            </span>
          </div>
          {/* Sticky Header Start */}
          <div className="flex flex-col items-center justify-center gap-5  bg-background ">
            <Button
              variant={"outline"}
              size={"avatarSm"}
              className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
                userShortlist?.isReady ? "outline-success" : "outline-error"
              }
        ${readyStateMutation.isPending ? "animate-pulse" : ""}
        }`}
              key={`avatar-${userShortlist?.userId}`}
              onClick={() => {
                if (userShortlist) {
                  readyStateMutation.mutate({
                    shortlistId: userShortlist.id,
                    isReady: !userShortlist.isReady,
                    userId: userShortlist.userId,
                  });
                }
              }}
            >
              <img
                src={userShortlist?.user?.image}
                alt=""
                key={`profile-img-${userShortlist?.userId}`}
              />
            </Button>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xs font-semibold">Participating</h3>
                <ParticipationButton
                  defaultChecked={userShortlist?.participating || true}
                  onChange={(e) => {
                    participationMutation.mutate({
                      userId: user?.id || "",
                      shortlistId: userShortlist?.id || "",
                      participating: e.target.checked,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xs font-semibold">Ready</h3>
                <ParticipationButton
                  defaultChecked={userShortlist?.isReady || true}
                  onChange={(e) => {
                    readyStateMutation.mutate({
                      userId: user?.id || "",
                      shortlistId: userShortlist?.id || "",
                      isReady: e.target.checked,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 h-[1px] bg-secondary relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
              Movies
            </span>
          </div>
        </div>
        {/* Sticky Header End */}

        <div className="flex flex-col items-center gap-2 overflow-y-scroll no-scrollbar ">
          {userShortlist
            ? userShortlist.movies.map((movie, index) => (
                <ShortListItem
                  key={userShortlist.id + movie.id}
                  movie={movie}
                  shortlistId={userShortlist.id}
                  highlight={
                    userShortlist.requiresSelection &&
                    userShortlist.selectedIndex === index
                      ? true
                      : false
                  }
                  requiresSelection={userShortlist.requiresSelection}
                  removeFromShortList={user?.id === userShortlist.userId}
                  index={index}
                  showActions={true}
                  isInWatchlist={false}
                />
              ))
            : null}
        </div>
      </div>
    </aside>
  );
}

import { PenOff, UserPen } from "lucide-react";
import { Button } from "../ui/Button";
import { User as DatabaseUser } from "@prisma/client";
import { ParticipationButton } from "./ParticipationButton";
import {
  useShortlistsQuery,
  useUpdateParticipationMutation,
  useUpdateReadyStateMutation,
  useValidateSession,
} from "@/lib/hooks";

export default function Participants({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const {
    variables: readyStateVariables,
    status: updateReadyStateStatus,
    mutate: updateReadyState,
  } = useUpdateReadyStateMutation();
  const { status: updateParticipationStatus, mutate: updateParticipation } =
    useUpdateParticipationMutation();
  const { data: allShortlists, status } = useShortlistsQuery();
  const { data: currentUser } = useValidateSession();
  return (
    <>
      <div className="flex flex-row justify-center items-center gap-5 ">
        <h3 className="text-lg font-bold">Participants</h3>
        <Button
          variant={"outline"}
          size={"iconSm"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <UserPen className="w-4 h-4" />
          ) : (
            <PenOff className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="flex flex-row gap-5">
        {allShortlists &&
          Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
            const participating = shortlist?.participating;
            const user = shortlist?.user;

            return (
              <div
                key={`avatar-${user?.id}-${participating}-${shortlist?.isReady}`}
                className="flex flex-col gap-3 items-center justify-center border rounded-md px-10 py-5"
              >
                <span
                  className={`text-xs text-center font-semibold`}
                  style={{ color: user?.color }}
                >
                  {user?.name}
                </span>
                <Button
                  variant={"outline"}
                  size={"avatarSm"}
                  className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
                    shortlist?.isReady ? "outline-success" : "outline-error"
                  }`}
                  key={`avatar-${user?.id}`}
                  disabled={!isEditing}
                  isLoading={
                    updateReadyStateStatus === "pending" &&
                    readyStateVariables?.shortlistId === shortlistId
                  }
                  onClick={() => {
                    updateReadyState({
                      userId: currentUser?.id || "",
                      shortlistId: shortlistId,
                      isReady: !shortlist?.isReady,
                    });
                  }}
                >
                  <img
                    src={user?.image}
                    alt=""
                    key={`profile-img-${user?.id}`}
                  />
                </Button>
                <ParticipationButton
                  defaultChecked={participating}
                  disabled={!isEditing}
                  onChange={(e) => {
                    updateParticipation({
                      userId: currentUser?.id || "",
                      shortlistId: shortlistId,
                      participating: e.target.checked,
                    });
                  }}
                />
              </div>
            );
          })}
      </div>
    </>
  );
}

import UserAvatar from "@/components/shortlist/UserAvatar";
import {
	useShortlistsQuery,
	useUpdateParticipationMutation,
	useUpdateReadyStateMutation,
	useValidateSession,
} from "@/lib/hooks";
import { Lock, LockOpen } from "lucide-react";
import { Button } from "../ui/Button";
import { ParticipationButton } from "./ParticipationButton";

export default function Participants({
	isEditing,
	setIsEditing,
}: {
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}) {
	const updateReadyState = useUpdateReadyStateMutation();
	const { mutate: updateParticipation } = useUpdateParticipationMutation();
	const { data: allShortlists } = useShortlistsQuery();
	const { data: currentUser } = useValidateSession();
	return (
		<div className="flex flex-col gap-10 items-center w-full h-full overflow-y-auto py-5">
			<div className="flex flex-col justify-center items-center gap-5 ">
				<h3 className="text-lg font-bold">Participants</h3>
				<Button
					variant={"outline"}
					size={"default"}
					onClick={() => setIsEditing(!isEditing)}
					className="flex flex-row gap-2 items-center justify-center py-5"
				>
					<span className="text-md">{!isEditing ? "Edit" : "Done"}</span>
					{isEditing ? (
						<Lock className="w-4 h-4" />
					) : (
						<LockOpen className="w-4 h-4" />
					)}
				</Button>
			</div>
			<div className="flex flex-col gap-5">
				{allShortlists &&
					Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
						const participating = shortlist?.participating;
						const user = shortlist?.user;

						return (
							<div
								key={`avatar-${user?.id}-${participating}`}
								className="flex flex-col gap-3 items-center justify-center border rounded-md px-10 py-5 relative"
							>
								<div className="absolute top-2 right-2">
									{!isEditing ? (
										<Lock className="h-5 w-5" />
									) : (
										<LockOpen className="h-5 w-5" />
									)}
								</div>
								<span className={"text-xs text-center font-semibold"}>
									{user?.name}
								</span>
								<UserAvatar
									userShortlist={shortlist}
									readyStateMutation={updateReadyState}
									disabled={!isEditing}
								/>
								<ParticipationButton
									checked={participating}
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
		</div>
	);
}

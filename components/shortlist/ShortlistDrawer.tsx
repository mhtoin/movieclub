"use client";

import UserAvatar from "@/components/shortlist/UserAvatar";
import {
	useUpdateParticipationMutation,
	useUpdateReadyStateMutation,
	useValidateSession,
} from "@/lib/hooks";
import { useSuspenseShortlistsQuery } from "@/lib/hooks";
import { ParticipationButton } from "components/raffle/ParticipationButton";
import ShortListItem from "components/shortlist/ShortlistItem";
import { Button } from "components/ui/Button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "components/ui/Drawer";
import { Clapperboard, MoveDiagonal } from "lucide-react";

export default function ShortlistDrawer() {
	const { data: user } = useValidateSession();
	const readyStateMutation = useUpdateReadyStateMutation();
	const participationMutation = useUpdateParticipationMutation();
	const { data: allShortlists } = useSuspenseShortlistsQuery();
	const userShortlist = user?.shortlistId
		? allShortlists?.[user?.shortlistId]
		: null;
	return (
		<Drawer setBackgroundColorOnScale={false} shouldScaleBackground={true}>
			<DrawerTrigger asChild>
				<Button
					variant={"outline"}
					size={"default"}
					className="flex flex-row items-center gap-2 rounded-tr-2xl rounded-br-none p-5"
				>
					<Clapperboard />
					<span className="text-xs relative">Your Shortlist</span>
					<span className="absolute top-1 -right-1 bg-transparent text-xs px-2 py-1 rounded-full">
						<MoveDiagonal className="w-3 h-3 bg-transparent" />
					</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[95dvh]">
				<div className="flex flex-col gap-5 overflow-y-auto no-scrollbar pt-5">
					<DrawerHeader className="flex flex-col items-center justify-center gap-5 w-full">
						<DrawerTitle className="flex flex-col items-center justify-center gap-5 w-full">
							<div className="w-1/2 h-[1px] bg-secondary relative">
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
									{userShortlist?.user?.name}
								</span>
							</div>
						</DrawerTitle>
						<DrawerDescription>
							<div className="flex flex-col items-center justify-center gap-5">
								<UserAvatar
									userShortlist={userShortlist}
									readyStateMutation={readyStateMutation}
								/>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col items-center gap-2">
										<h3 className="text-xs font-semibold">Participating</h3>
										<ParticipationButton
											checked={userShortlist?.participating}
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
											checked={userShortlist?.isReady}
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
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex flex-col items-center justify-center gap-5">
						<div className="w-1/2 h-[1px] bg-secondary relative">
							<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
								Movies
							</span>
						</div>
						<div className="grid grid-cols-3 items-center justify-center gap-2 overflow-hidden">
							{userShortlist
								? userShortlist.movies.map((movie, index) => (
										<ShortListItem
											key={`${userShortlist.id}-${movie.id}`}
											movie={movie}
											shortlistId={userShortlist.id}
											highlight={
												(userShortlist.requiresSelection &&
													userShortlist.selectedIndex === index) ||
												false
											}
											requiresSelection={userShortlist.requiresSelection || false}
											removeFromShortList={user?.id === userShortlist.userId}
											index={index}
											showActions={true}
											isInWatchlist={false}
										/>
									))
								: null}
						</div>
					</div>
				</div>
				<DrawerFooter />
			</DrawerContent>
		</Drawer>
	);
}

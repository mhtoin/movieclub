"use client";
import {
	useUpdateParticipationMutation,
	useUpdateReadyStateMutation,
	useValidateSession,
} from "@/lib/hooks";
import ShortListItem from "components/shortlist/ShortlistItem";
import { Button } from "components/ui/Button";

import { useSuspenseShortlistsQuery } from "@/lib/hooks";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ParticipationButton } from "../raffle/ParticipationButton";

export default function ShortlistSidebar() {
	const [isExpanded, setIsExpanded] = useState(true);
	const { data: user } = useValidateSession();

	const { data: allShortlists } = useSuspenseShortlistsQuery();
	const userShortlist = user?.shortlistId
		? allShortlists?.[user?.shortlistId]
		: null;
	const readyStateMutation = useUpdateReadyStateMutation();
	const participationMutation = useUpdateParticipationMutation();
	return (
		<div
			className={`relative h-full transition-all duration-300 ${isExpanded ? "w-96" : "w-0"}`}
		>
			<aside className="border-r border-border/50 gap-5 h-full overflow-y-auto no-scrollbar mt-1.5">
				<div className="flex flex-col items-center justify-center gap-5 ">
					<div className="sticky top-0 bg-background flex flex-col items-center justify-center gap-10 z-20 w-full py-5">
						<div className="w-1/2 h-[1px] bg-secondary relative">
							<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
								{userShortlist?.user?.name}
							</span>
						</div>
						{/* Sticky Header Start */}
						<div className="flex flex-col items-center justify-center gap-5 bg-background ">
							<Button
								variant={"outline"}
								size={"avatarSm"}
								className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
									userShortlist?.isReady ? "outline-success" : "outline-error"
								} ${readyStateMutation.isPending ? "animate-pulse" : ""}`}
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
			</aside>
			<Button
				variant={"outline"}
				size={"icon"}
				onClick={() => setIsExpanded(!isExpanded)}
				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2  transition-colors"
			>
				{isExpanded ? (
					<ChevronLeft className="w-6 h-6" />
				) : (
					<ChevronRight className="w-6 h-6 ml-3 transition-transform duration-300" />
				)}
			</Button>
		</div>
	);
}

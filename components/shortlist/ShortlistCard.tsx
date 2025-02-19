import ItemSkeleton from "@/components/shortlist/ItemSkeleton";
import ShortListItem from "@/components/shortlist/ShortlistItem";
import {
	useGetWatchlistQuery,
	useUpdateReadyStateMutation,
	useValidateSession,
} from "@/lib/hooks";
import type { ShortlistWithMovies } from "@/types/shortlist.type";
import { Button } from "components/ui/Button";

export default function ShortlistCard({
	shortlist,
}: {
	shortlist: ShortlistWithMovies | null;
}) {
	const readyStateMutation = useUpdateReadyStateMutation();
	const { data: user } = useValidateSession();
	const movies = shortlist?.movies || [];
	const { data: watchlist } = useGetWatchlistQuery(user || null);

	const skeletons =
		movies?.length < 3
			? [...new Array(3 - movies.length)].map((_element, index) => (
					<ItemSkeleton key={index} />
				))
			: [];
	const isEditable = shortlist && shortlist.userId === user?.id;

	return (
		<div
			key={`fragment-${shortlist?.id}`}
			className="flex flex-col justify-between border rounded-xl md:p-2 gap-2 bg-card/20 h-full backdrop-blur-lg"
		>
			<div
				key={`${shortlist?.id}-container`}
				className="grid grid-cols-3 sm:w-auto items-center justify-center md:border md:rounded-md md:p-1 md:gap-2 bg-background  overflow-hidden "
			>
				{shortlist?.movies.map((movie, index: number) => {
					const isInWatchlist = watchlist?.some(
						(watchlistMovie) => watchlistMovie.id === movie.tmdbId,
					);

					return (
						<ShortListItem
							key={shortlist.id + movie.id}
							movie={movie}
							shortlistId={shortlist.id}
							highlight={
								(shortlist.requiresSelection && shortlist.selectedIndex === index) ||
								false
							}
							requiresSelection={shortlist.requiresSelection || false}
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
        ${isEditable && readyStateMutation.isPending ? "animate-pulse" : ""}`}
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
						<span className="text-muted-foreground">{shortlist?.user?.name}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

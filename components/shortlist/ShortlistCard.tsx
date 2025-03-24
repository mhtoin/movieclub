import ItemSkeleton from "@/components/shortlist/ItemSkeleton";
import ShortListItem from "@/components/shortlist/ShortlistItem";
import UserAvatar from "@/components/shortlist/UserAvatar";
import {
	useGetWatchlistQuery,
	useUpdateReadyStateMutation,
	useValidateSession,
} from "@/lib/hooks";
import type { ShortlistWithMovies } from "@/types/shortlist.type";

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
			className="overflow-clip flex flex-col justify-between dark:border border-border rounded-xl md:gap-2 md:p-2 bg-card/20 h-full backdrop-blur-lg shadow-lg"
		>
			<div
				key={`${shortlist?.id}-container`}
				className="grid grid-cols-3 sm:w-auto items-center justify-center  md:rounded-md md:p-1 md:gap-2  overflow-hidden "
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
				className="flex flex-row w-full items-center justify-between gap-5 p-3 md:border rounded-none md:rounded-xl bg-background "
				key={`name-container-${shortlist?.id}`}
			>
				<div className="flex flex-row items-center gap-3">
					<UserAvatar
						userShortlist={shortlist}
						readyStateMutation={readyStateMutation}
						disabled={!isEditable}
					/>

					<div className="flex flex-col items-center">
						<span className="text-muted-foreground">{shortlist?.user?.name}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

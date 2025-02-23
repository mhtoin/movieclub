"use client";
import {
	useIsMobile,
	useReplaceShortlistMutation,
	useShortlistQuery,
	useValidateSession,
} from "@/lib/hooks";
import { useDialogStore } from "@/stores/useDialogStore";
import * as Ariakit from "@ariakit/react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "../ui/Button";

import MovieCard from "@/components/search/MovieCard";
import ShortListItem from "components/shortlist/ShortlistItem";
import { Drawer, DrawerContent } from "../ui/Drawer";

export default function ReplaceDialog() {
	const isMobile = useIsMobile();
	const dialog = Ariakit.useDialogStore();
	const isOpen = useDialogStore.use.isOpen();
	const setIsOpen = useDialogStore.use.setIsOpen();
	const movie = useDialogStore.use.movie();
	const { data: session } = useValidateSession();
	const { data: shortlist } = useShortlistQuery(session?.shortlistId || "");
	const shortlistUpdateMutation = useReplaceShortlistMutation();

	const isTMDBMovie = movie && "tmdbId" in movie;

	if (isMobile) {
		return (
			<Drawer
				open={isOpen}
				setBackgroundColorOnScale={false}
				shouldScaleBackground={true}
			>
				<DrawerContent>
					<div className="flex flex-col gap-5 max-h-[90dvh] p-5 overflow-auto items-center">
						<div className="flex flex-col gap-2 justify-center items-center">
							{isTMDBMovie && shortlist ? (
								<ShortListItem movie={movie} shortlistId={shortlist?.id} />
							) : movie && !isTMDBMovie && shortlist ? (
								<MovieCard movie={movie} />
							) : null}
						</div>

						<span className="text-sm text-muted-foreground">
							Only 3 movies allowed in a shortlist, replace one of the movies below
						</span>

						<div className="flex flex-row items-center gap-2 flex-wrap justify-center">
							{shortlist?.movies?.map((shortlistMovie) => (
								<div
									className="flex flex-col gap-2 justify-center items-center"
									key={shortlistMovie.id}
								>
									<Button
										variant={"outline"}
										size={"icon"}
										onClick={() => {
											if (movie) {
												shortlistUpdateMutation.mutate({
													replacedMovie: shortlistMovie,
													replacingWithMovie: movie,
													shortlistId: shortlist.id,
												});
											}
										}}
										isLoading={
											shortlistUpdateMutation.isPending &&
											shortlistUpdateMutation.variables?.replacedMovie.id ===
												shortlistMovie.id
										}
									>
										<ArrowRightLeft />
									</Button>
									<ShortListItem movie={shortlistMovie} shortlistId={shortlist.id} />
								</div>
							))}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Ariakit.Dialog
			store={dialog}
			open={isOpen}
			onClose={() => setIsOpen(false)}
			backdrop={<div className="bg-black/5 backdrop-blur-sm " />}
			className="fixed z-[9999] inset-3 flex flex-col gap-1 overflow-auto border rounded-lg max-w-fit min-w-96 py-2 m-auto bg-background"
		>
			<div className="flex flex-col gap-5 overflow-auto w-full h-full items-center justify-center p-5">
				<div className="flex flex-col gap-2 justify-center items-center">
					{isTMDBMovie && shortlist ? (
						<ShortListItem movie={movie} shortlistId={shortlist?.id} />
					) : movie && !isTMDBMovie && shortlist ? (
						<MovieCard movie={movie} />
					) : null}
				</div>

				<span className="text-sm text-muted-foreground">
					Only 3 movies allowed in a shortlist, replace one of the movies below
				</span>

				<div className="grid grid-cols-3 gap-2 p-2">
					{shortlist?.movies?.map((shortlistMovie) => (
						<div
							className="flex flex-col gap-2 justify-center items-center"
							key={shortlistMovie.id}
						>
							<Button
								variant={"outline"}
								size={"icon"}
								onClick={() => {
									console.log("clicked", movie);
									if (movie) {
										if ("tmdbId" in movie) {
											shortlistUpdateMutation.mutate({
												replacedMovie: shortlistMovie,
												replacingWithMovie: movie,
												shortlistId: shortlist.id,
											});
										} else if (typeof movie.id === "number") {
											console.log("tmdbId not in movie");
											shortlistUpdateMutation.mutate({
												replacedMovie: shortlistMovie,
												replacingWithMovie: movie,
												shortlistId: shortlist.id,
											});
										}
									}
								}}
								isLoading={
									shortlistUpdateMutation.isPending &&
									shortlistUpdateMutation.variables?.replacedMovie.id ===
										shortlistMovie.id
								}
							>
								<ArrowRightLeft />
							</Button>
							<ShortListItem movie={shortlistMovie} shortlistId={shortlist.id} />
						</div>
					))}
				</div>
			</div>
		</Ariakit.Dialog>
	);
}

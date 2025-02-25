"use client";
import type { MovieWithUser } from "@/types/movie.type";
import type { TierlistWithTiers } from "@/types/tierlist.type";
import {
	DragDropContext,
	type DraggableLocation,
	type DropResult,
} from "@hello-pangea/dnd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "components/ui/Button";
import { produce } from "immer";
import { getQueryClient } from "lib/getQueryClient";
import { tierlistKeys } from "lib/tierlist/tierlistKeys";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNotificationStore } from "stores/useNotificationStore";
import Tier from "./Tier";
import TierCreate from "./TierCreate";
import TierDateFilter from "./TierDateFilter";

type MoveItemObject = {
	[x: string]: MovieWithUser[];
};
const reorder = (
	tier: MovieWithUser[],
	startIndex: number,
	endIndex: number,
) => {
	const result = Array.from(tier);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const moveItem = (
	sourceTier: MovieWithUser[],
	destinationTier: MovieWithUser[],
	droppableSource: DraggableLocation,
	droppableDestination: DraggableLocation,
) => {
	const sourceClone = Array.from(sourceTier);
	const destinationClone = Array.from(destinationTier);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destinationClone.splice(droppableDestination.index, 0, removed);

	const result = {} as MoveItemObject;
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destinationClone;
	return result;
};

export default function DnDTierContainer({
	tierlistId,
	authorized,
}: {
	tierlistId: string;
	authorized: boolean;
}) {
	const queryClient = getQueryClient();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState(
		searchParams.get("date") || "",
	);
	const { data: tierlistData, status: tierlistStatus } = useQuery(
		tierlistKeys.byId(tierlistId),
	);

	const [containerState, setContainerState] = useState<
		MovieWithUser[][] | undefined
	>(undefined);
	const setNotification = useNotificationStore((state) => state.setNotification);
	const tiers = tierlistData?.tierlistTiers.map((tier) => tier.label);

	useEffect(() => {
		const movieMatrix = tierlistData?.tierlistTiers.map((tier) => {
			return tier.movies
				.filter((movie) =>
					selectedDate ? movie.watchDate?.split("-")[0] === selectedDate : true,
				)
				.map((movie) => movie);
		});
		setContainerState(movieMatrix);
	}, [tierlistData, selectedDate]);

	const handleDateChange = (date: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (date === "") {
			params.delete("date");
		} else {
			params.set("date", date);
		}
		router.push(`${pathname}?${params.toString()}`, {
			scroll: false,
		});
		setSelectedDate(date);
		const movieMatrix = tierlistData?.tierlistTiers.map((tier) => {
			return tier.movies
				.filter((movie) => (date ? movie.watchDate?.split("-")[0] === date : true))
				.map((movie) => movie);
		});

		setContainerState(movieMatrix);
	};

	function onDragEnd(result: DropResult) {
		if (!authorized || !containerState || !tierlistData) {
			return;
		}

		if (selectedDate) {
			toast.error("Reset filters before moving items");
			return;
		}

		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const sInd = +source.droppableId;
		const dInd = +destination.droppableId;
		/**
		 * !TODO refactor this to use immer
		 */

		if (sInd === dInd) {
			const items = reorder(
				containerState?.[sInd],
				source.index,
				destination.index,
			);
			const newState = [...containerState];
			newState[sInd] = items;

			const saveState = produce(tierlistData, (draft) => {
				for (const tier of draft.tierlistTiers) {
					tier.movies = newState[tier.value];
				}
			});
			setContainerState(newState);
			queryClient.setQueryData(["tierlists", tierlistId], saveState);

			saveMutation.mutate(saveState);
		} else {
			const result = moveItem(
				containerState[sInd],
				containerState[dInd],
				source,
				destination,
			);
			const newState = [...containerState];
			newState[sInd] = result[sInd];
			newState[dInd] = result[dInd];

			// mutate the tierlist
			const saveState = produce(tierlistData, (draft) => {
				for (const tier of draft.tierlistTiers) {
					// need to merge states if we have filtered for a date
					tier.movies = newState[tier.value];
				}
			});

			queryClient.setQueryData(["tierlists", tierlistId], saveState);

			saveMutation.mutate(saveState);

			setContainerState(newState);
		}
	}

	const saveMutation = useMutation({
		mutationFn: async (saveState: TierlistWithTiers) => {
			const res = await fetch(`/api/tierlists/${saveState.id}`, {
				method: "PUT",
				body: JSON.stringify(saveState),
			});

			const body = await res.json();

			if (body.ok) {
				return body;
			}
			throw new Error("Updating tierlist failed", { cause: body });
		},
		onSuccess: (_data, _variables, _context) => {
			toast.success("Tierlist updated!");
		},
		onError: (_error) => {
			toast.error("Updating tierlist failed!");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (tierlistId: string) => {
			const res = await fetch(`/api/tierlists/${tierlistId}`, {
				method: "DELETE",
			});

			const body = await res.json();

			if (body.ok) {
				return body;
			}
			throw new Error("Deleting tierlist failed");
		},
		onSuccess: (_data) => {
			setNotification("Tierlist cleared!", "success");
			window.location.reload();
		},
		onError: (_error) => {
			setNotification("Deleting tierlist failed!", "error");
		},
	});

	const handleSave = () => {
		// construct a tierlist from tiers and matrix
		const saveState = produce(tierlistData, (draft) => {
			for (const tier of draft?.tierlistTiers || []) {
				tier.movies = containerState?.[tier.value] || [];
			}
			return draft;
		});

		if (saveState) {
			saveMutation.mutate(saveState);
		}
	};

	return (
		<>
			<div className="flex flex-row items-center gap-5 w-full justify-center">
				<Button
					onClick={handleSave}
					disabled={!authorized}
					variant="outline"
					size={"default"}
					isLoading={saveMutation.isPending}
				>
					Save
				</Button>
				<Button
					variant="outline"
					isLoading={deleteMutation.isPending}
					onClick={() => {
						if (containerState && containerState?.length > 1) {
							deleteMutation.mutate(tierlistId);
						} else {
							if (document) {
								(document.getElementById("createModal") as HTMLFormElement).showModal();
							}
						}
					}}
					disabled={!authorized}
				>
					<span>
						{containerState && containerState?.length > 1 ? "Reset" : "Create"}
					</span>
				</Button>
				<TierDateFilter
					values={["2023", "2024", "2025"]}
					selectedDate={selectedDate}
					setSelectedDate={handleDateChange}
				/>
			</div>
			{tierlistStatus === "pending" ? (
				<Loader2 className="animate-spin" />
			) : (
				<div className="flex flex-col items-start gap-10 md:gap-2 md:overflow-hidden">
					<DragDropContext onDragEnd={onDragEnd}>
						{containerState?.map((tier, tierIndex) => (
							<Tier
								key={tierIndex}
								tierIndex={tierIndex}
								tier={tier}
								label={tiers?.[tierIndex] || ""}
							/>
						))}
					</DragDropContext>
					{tierlistData?.tiers && tierlistData?.tiers?.length <= 4 && (
						<TierCreate tierlistId={tierlistId} />
					)}
				</div>
			)}
		</>
	);
}

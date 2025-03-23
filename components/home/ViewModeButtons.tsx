"use client";
import { Button } from "@/components/ui/Button";
import { useViewMode } from "@/hooks/useViewMode";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback } from "react";

export default function ViewModeButtons() {
	const { viewMode, setViewMode } = useViewMode();

	const handleDetailsClick = useCallback(() => {
		setViewMode("details");
	}, [setViewMode]);

	const handleReviewsClick = useCallback(() => {
		setViewMode("reviews");
	}, [setViewMode]);
	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-28 z-10">
			<div className="flex flex-row gap-2">
				<Button
					variant="outline"
					className="flex items-center justify-center gap-2"
					onClick={handleDetailsClick}
					disabled={viewMode === "details"}
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Details</span>
				</Button>
				<Button
					variant="outline"
					className="flex items-center justify-center gap-2"
					onClick={handleReviewsClick}
					disabled={viewMode === "reviews"}
				>
					<span>Reviews</span>
					<ArrowRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

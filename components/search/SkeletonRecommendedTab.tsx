import { TabsContent } from "@/components/ui/Tabs";
import { useRef } from "react";

export default function SkeletonRecommendedTab() {
	const skeletonRef = useRef<HTMLDivElement>(null);

	// Create an array to simulate multiple recommendation sections
	const skeletonSections = Array.from({ length: 2 }, (_, i) => i);

	return (
		<TabsContent
			value="recommended"
			className="overflow-y-auto"
			style={{ maxHeight: "calc(90vh - 150px)" }}
			ref={skeletonRef}
		>
			<div className="flex flex-wrap gap-2 py-2 w-full items-center justify-center">
				{skeletonSections.map((section) => (
					<div key={section} className="w-full bg-input/80 p-2 rounded-md">
						{/* Skeleton for "Because you liked" header */}
						<div className="sticky top-0 z-10 text-sm font-semibold mb-2 p-2 bg-accent/30 rounded-md w-48 h-7 animate-pulse" />

						{/* Grid of skeleton movie cards */}
						<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[min-content] gap-y-5 w-full">
							{Array.from({ length: 6 }, (_, i) => (
								<div
									key={i}
									className="flex flex-col m-2 space-y-3 bg-card/50 rounded-lg"
								>
									{/* Skeleton poster */}
									<div className="w-full aspect-2/3 bg-accent/60 rounded-md animate-pulse" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</TabsContent>
	);
}

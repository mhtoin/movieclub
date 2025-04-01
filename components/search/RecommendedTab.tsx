import { Button } from "@/components/ui/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import RecommendedCard from "components/search/RecommendedCard";
import { TabsContent } from "components/ui/Tabs";
import { useValidateSession } from "lib/hooks";
import { userKeys } from "lib/users/userKeys";
import { ChevronUp } from "lucide-react";
import { useRef } from "react";

export default function RecommendedTab() {
	const { data: user } = useValidateSession();
	// Use the queryOptions directly - the enabled check is already included in userKeys.recommended
	const { data: recommended } = useSuspenseQuery(
		userKeys.recommended(user?.id ?? ""),
	);
	const recommendedRef = useRef<HTMLDivElement>(null);

	return (
		<TabsContent
			value="recommended"
			className="overflow-y-auto"
			style={{ maxHeight: "calc(90vh - 150px)" }}
			ref={recommendedRef}
		>
			<Button
				variant="outline"
				size="icon"
				className="absolute bottom-0 right-0 z-30"
				onClick={() => {
					recommendedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
				}}
			>
				<ChevronUp className="w-4 h-4" />
			</Button>
			<div className="flex flex-wrap gap-2 py-2 w-full items-center justify-center relative">
				{recommended && Object.keys(recommended).length > 0 ? (
					Object.keys(recommended).map((sourceMovie) => (
						<div key={sourceMovie} className="w-full">
							<h3 className="sticky top-0 z-10 text-sm font-semibold mb-2 p-2 bg-accent rounded-md w-fit text-accent-foreground">
								Because you liked: {sourceMovie}
							</h3>
							<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[min-content] gap-y-5  w-full">
								{recommended[sourceMovie].map((rec, index) => (
									<RecommendedCard
										key={`${sourceMovie}-${index}`}
										movie={rec.movie}
										showActions={true}
									/>
								))}
							</div>
						</div>
					))
				) : (
					<div className="flex items-center justify-center w-full py-8">
						<p className="text-muted-foreground">No recommendations available yet</p>
					</div>
				)}
			</div>
		</TabsContent>
	);
}

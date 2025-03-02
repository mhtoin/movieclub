"use client";

import { Button } from "components/ui/Button";
import { Clapperboard, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MovieSidebar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	return (
		<div className="absolute left-5 top-1/2 -translate-y-1/2 bg-background rounded-full z-[9998] border border-border">
			<div className="w-16 h-64 bg-background rounded-full flex flex-col items-center justify-center gap-10">
				<div className="flex flex-col gap-2 items-center justify-center">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							const params = new URLSearchParams(searchParams);
							params.set("viewMode", "details");
							router.push(`/home?${params.toString()}`);
						}}
					>
						<Clapperboard />
					</Button>
					<span className="text-xs">Details</span>
				</div>
				<div className="flex flex-col gap-2 items-center justify-center">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							const params = new URLSearchParams(searchParams);
							params.set("viewMode", "reviews");
							router.push(`/home?${params.toString()}`);
						}}
					>
						<Star />
					</Button>
					<span className="text-xs">Reviews</span>
				</div>
			</div>
		</div>
	);
}

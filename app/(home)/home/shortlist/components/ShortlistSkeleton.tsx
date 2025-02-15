import ItemSkeleton from "../edit/components/ItemSkeleton";

export default function ShortlistSkeleton() {
	return (
		<div className="flex flex-col place-items-center gap-2">
			<div className="flex flex-row justify-center items-center gap-8 p-5 w-full">
				<div className="flex justify-center">
					<div
						className={
							"w-12 rounded-full outline h-12 bg-primary animate-pulse"
						}
					/>
				</div>
				<div className="bg-primary animate-pulse h-4 w-40 rounded-lg" />
			</div>
			<div className="flex flex-row gap-5 w-2/3 sm:w-auto items-center pt-5 lg:p-5">
				<ItemSkeleton />
				<ItemSkeleton />
				<ItemSkeleton />
			</div>
		</div>
	);
}

import { Button } from "components/ui/Button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "components/ui/Drawer";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "../ui/Checkbox";
import RangeSlider from "../ui/RangeSlider";

export default function FilterDrawer({
	genres,
	handleRangeSelect,
}: {
	genres?: { label: string; value: number }[];
	handleRangeSelect: (value: number[]) => void;
}) {
	const [value, setValue] = useState([0, 10]);
	const searchParams = useSearchParams();
	const selectedGenres = searchParams.get("with_genres")?.split(",") ?? [];
	const pathname = usePathname();
	const router = useRouter();

	const handleGenreSelect = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		let genreParams = params.get("with_genres")?.split(",") ?? [];
		if (genreParams.includes(value)) {
			genreParams = genreParams.filter((genre) => genre !== value);
		} else {
			genreParams.push(value);
		}
		params.set("with_genres", genreParams.join(","));
		router.push(`${pathname}?${params.toString()}`);
	};
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Filter className="h-4 w-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Filters</DrawerTitle>
				</DrawerHeader>
				<div className="p-4 flex flex-col h-full gap-5">
					<div className="flex flex-col gap-2">
						<h3 className="text-sm font-medium mb-2">Genres</h3>
						<div className="grid grid-cols-2 gap-2 h-[400px] overflow-y-auto w-full">
							{genres?.map((genre) => (
								<Checkbox
									key={genre.value}
									defaultChecked={selectedGenres.includes(
										genre.value.toString(),
									)}
									onChange={(event) => {
										handleGenreSelect(genre.value.toString());
									}}
								>
									{genre.label}
								</Checkbox>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="text-sm font-medium mb-2">Rating</h3>
						<div className="flex flex-col gap-2 items-center">
							<RangeSlider
								label="Rating"
								value={value}
								onChange={setValue}
								step={0.1}
								minValue={0}
								maxValue={10}
								thumbLabels={["from", "to"]}
								onChangeEnd={handleRangeSelect}
							/>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

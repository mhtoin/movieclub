import { cn } from "@/lib/utils";
import {
	Select,
	SelectArrow,
	SelectItem,
	SelectItemCheck,
	SelectLabel,
	SelectPopover,
	SelectProvider,
	useSelectStore,
} from "@ariakit/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface SelectProps {
	label: string;
	options?: { label: string; value: number }[];
	onChange: (value: string[]) => void;
}

export default function FilterSelect({
	label,
	options,
	onChange,
}: SelectProps) {
	const store = useSelectStore();
	const searchParams = useSearchParams();
	const selectedGenres = searchParams.get("with_genres")?.split(",") ?? [];
	const [value, setValue] = useState<string[]>(selectedGenres);
	const isOpen = store.useState("open");

	return (
		<div className="flex flex-col gap-1 p-1">
			<SelectProvider
				value={value}
				setValue={(value) => {
					setValue([...value]);
					onChange([...value]);
				}}
				store={store}
			>
				<SelectLabel hidden>{label}</SelectLabel>
				<Select
					store={store}
					className={cn(
						"flex bg-input flex-none h-10 select-none items-center gap-1 whitespace-nowrap rounded-lg border pl-4 pr-4 text-[1rem] leading-6 [text-decoration-line:none] outline-[2px] outline-offset-[2px] [box-shadow:inset_0_0_0_1px_var(--border),_inset_0_2px_0_var(--highlight),_inset_0_-1px_0_var(--shadow),_0_1px_1px_var(--shadow)] justify-between",
						"border-border/80 text-foreground",
					)}
				>
					<div className="relative overflow-visible ">
						{value.length > 0 ? (
							<div className="group flex items-center">
								<div className="truncate max-w-[160px] pl-2 transition-all duration-300 group-hover:max-w-[270px]">
									<span className="whitespace-nowrap">
										{options
											?.filter((opt) => value.includes(opt.value.toString()))
											.map((opt) => opt.label)
											.join(", ")}
									</span>
								</div>
								{value.length > 3 && (
									<span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										(+{value.length - 3})
									</span>
								)}
							</div>
						) : (
							label
						)}
						{value.length > 0 && (
							<span className="absolute -top-2 -left-2 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs">
								{value.length}
							</span>
						)}
					</div>
					<SelectArrow
						store={store}
						className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
					/>
				</Select>
				<SelectPopover
					store={store}
					gutter={4}
					sameWidth
					unmountOnHide
					className="popover bg-popover w-[300px] z-50 max-h-[var(--popover-available-height,300px)] flex flex-col gap-2 justify-center items-center overscroll-contain rounded-lg border border-solid p-2 overflow-auto text-[white] [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
				>
					<div className="grid grid-cols-2 justify-between justify-items-stretch min-h-[48px]">
						{options?.map((option) => (
							<SelectItem
								key={option.value}
								value={option?.value.toString()}
								store={store}
								className="flex cursor-pointer items-center gap-2 rounded p-2 !outline-[none] text-foreground  hover:bg-accent/80 hover:text-accent-foreground"
							>
								<SelectItemCheck />
								{option?.label}
							</SelectItem>
						))}
					</div>
				</SelectPopover>
			</SelectProvider>
		</div>
	);
}

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Button } from "components/ui/Button";
import { Settings } from "lucide-react";

export default function SidebarConfig({
	orientation,
	setOrientation,
}: {
	orientation: "horizontal" | "vertical";
	setOrientation: (orientation: "horizontal" | "vertical") => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					size={"iconSm"}
					className={`absolute ${
						orientation === "horizontal"
							? "top-2 right-3"
							: "top-0 right-1/2 translate-x-1/2"
					}`}
				>
					<Settings />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				align="end"
				alignOffset={-10}
				className="z-[9999] bg-background w-fit p-2"
			>
				<div className="flex flex-col gap-2">
					<label className="text-sm text-foreground/50 px-2" htmlFor="orientation">
						Orientation
					</label>
					<Select
						value={orientation}
						onValueChange={(value) =>
							setOrientation(value as "horizontal" | "vertical")
						}
					>
						<SelectTrigger>
							<SelectValue
								placeholder="Orientation"
								className="text-foreground placeholder:text-foreground/50"
							/>
						</SelectTrigger>
						<SelectContent className="text-foreground z-[9999] bg-background p-2">
							<SelectItem value="horizontal" className="text-sm">
								Horizontal
							</SelectItem>
							<SelectItem value="vertical">Vertical</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</PopoverContent>
		</Popover>
	);
}

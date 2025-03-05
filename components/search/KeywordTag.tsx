import { X } from "lucide-react";
import { Button } from "../ui/Button";

export default function KeywordTag({
	keyword,
	handleClick,
}: {
	keyword: { id: number; name: string };
	handleClick: (keyword: { id: number; name: string }) => void;
}) {
	return (
		<div className="h-7 px-3 py-1 text-xs relative bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full font-medium transition-colors hover:bg-secondary/80">
			<span className="max-w-[120px] truncate">{keyword?.name}</span>
			<Button
				variant={"ghost"}
				size={"icon"}
				className="w-4 h-4 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive"
				onClick={(e) => {
					e.preventDefault();
					handleClick(keyword);
				}}
				aria-label={`Remove ${keyword?.name} keyword`}
			>
				<X className="w-3 h-3" />
			</Button>
		</div>
	);
}

import GenreFilters from "@/components/search/GenreFilters";
import Providers from "@/components/search/Providers";
import SearchInput from "@/components/search/SearchInput";
import VoteRange from "@/components/search/VoteRange";
export default function SearchSidebarContent() {
	return (
		<div className="relative border-r border-border/50 gap-5 h-full overflow-y-auto no-scrollbar mt-1.5 pb-4 ">
			<div className="flex flex-col gap-4 p-5">
				<div className="flex flex-col gap-4">
					<SearchInput type="discover" />
					<div className="flex flex-col gap-2">
						<p className="text-sm text-muted-foreground">
							Discover movies by keywords
						</p>
					</div>
				</div>
				<Providers />
				<div className="flex flex-col gap-2">
					<p className="text-sm text-muted-foreground">
						Filter by streaming providers
					</p>
				</div>
				<GenreFilters />
				<div className="flex flex-col gap-2">
					<p className="text-sm text-muted-foreground">Filter by genres</p>
				</div>
				<VoteRange />
				<div className="flex flex-col gap-2">
					<p className="text-sm text-muted-foreground">Filter by vote average</p>
				</div>
			</div>
		</div>
	);
}

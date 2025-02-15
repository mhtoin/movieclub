import FilterBar from "components/search/FilterBar";
import Results from "components/search/Results";
import { getCurrentSession } from "lib/authentication/session";
import { redirect } from "next/navigation";

export default async function SearchPage() {
	const { user } = await getCurrentSession();

	if (!user) {
		redirect("/");
	}
	return (
		<div className="flex flex-col justify-center items-center gap-2 rounded-lg relative">
			<div className="sticky z-40 top-0 pt-12 w-full bg-background pb-2">
				<FilterBar />
			</div>
			<Results />
		</div>
	);
}

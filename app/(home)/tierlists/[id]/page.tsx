
import { getCurrentSession } from "@/lib/authentication/session";
import { getQueryClient } from "@/lib/getQueryClient";
import { getMoviesOfTheWeek } from "@/lib/movies/movies";
import { getTierlist, getTierlists } from "@/lib/tierlists";
import { redirect } from "next/navigation";
import TierContainer from "./components/TierContainer";
async function staticParams() {
	const tierlists = await getTierlists();

	return tierlists.map((tierlist) => ({
		id: tierlist.id,
	}));
}

// fix "dynamic server usage" errors in dev mode by turning off static generation and forcing dynamic rendering
export const generateStaticParams =
	process.env.NODE_ENV === "production" ? staticParams : undefined;
export const dynamic =
	process.env.NODE_ENV === "production" ? "auto" : "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
	const { user } = await getCurrentSession();
	if (!user) {
		redirect("/");
	}
	const queryClient = getQueryClient();
	const tierlist = await getTierlist(params.id);

	const moviesOfTheWeek = await getMoviesOfTheWeek();
	queryClient.setQueryData(["tierlists", params.id], tierlist);
	queryClient.setQueryData(["moviesOfTheWeek"], moviesOfTheWeek);

	const tierlistMovies = tierlist
		? tierlist.tiers.flatMap((tier) => tier.movies.map((movie) => movie.title))
		: [];

	const _unrankedMovies = moviesOfTheWeek.filter((movie) => {
		const movieInList = tierlistMovies.includes(movie.title);
		return !movieInList;
	}) as unknown as MovieOfTheWeek[];

	const allDates = moviesOfTheWeek.map((movie) => movie.watchDate);
	const allYears = [
		...new Set(
			allDates
				.filter((date): date is string => Boolean(date))
				.map((date) => date.split("-")[0]),
		),
	];

	const authorized = tierlist.userId === user?.id;

	return (
		<div className="flex flex-col gap-10 md:gap-5 py-20 items-center">
			<TierContainer
				tierlist={tierlist}
				authorized={authorized}
				allYears={allYears}
			/>
		</div>
	);
}

import CurrentMoviePoster from "@/components/home/CurrentMoviePoster";
import MovieSidebar from "@/components/home/MovieSidebar";
import { isServerMobile } from "@/lib/isServerMobile";
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies";

export async function CurrentMovieWrapper() {
	const mostRecentMovie = await getMostRecentMovieOfTheWeek();
	const isMobile = await isServerMobile();
	return (
		<div className="w-screen h-screen flex items-center justify-center relative snap-start overflow-x-hidden">
			<CurrentMoviePoster mostRecentMovie={mostRecentMovie} isMobile={isMobile} />
			<MovieSidebar />
		</div>
	);
}

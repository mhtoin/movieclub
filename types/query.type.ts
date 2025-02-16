import type { MovieWithUser } from "./movie.type";

export interface MoviesOfTheWeekByMonth {
	[key: `${number}-${number}-${number}`]: MovieWithUser[];
}

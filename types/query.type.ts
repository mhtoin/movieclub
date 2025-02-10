import { MovieOfTheWeek } from "./movie.type";

export interface MoviesOfTheWeekByMonth {
  [key: `${number}-${number}-${number}`]: MovieOfTheWeek[];
}

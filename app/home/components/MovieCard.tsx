import MoviePosterCard from "./MoviePosterCard";

export default function MovieCard({ movieOfTheWeek }) {
  return (
    <div className="flex flex-row w-2/5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl">
      <div className="flex flex-col w-1/2">
       <MoviePosterCard movieOfTheWeek={movieOfTheWeek} />
      </div>
      <div className="m-5 p-5 w-1/2">
        <h1>{movieOfTheWeek.title}</h1>
        <p>{movieOfTheWeek.overview}</p>
      </div>
    </div>
  );
}

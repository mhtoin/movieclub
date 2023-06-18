import { getChosenMovie } from "@/lib/shortlist";

export async function MovieHero({ movieOfTheWeek }) {
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";
  return (
    <div className="card lg:w-5/12 lg:card-side bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl">
      <figure>
        <img
          src={`http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`}
          alt="Album"
          className="rounded-xl m-5"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{movieOfTheWeek?.original_title}</h2>
        <p>{movieOfTheWeek?.overview}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Listen</button>
        </div>
      </div>
    </div>
  );
}

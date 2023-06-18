import { getChosenMovie } from "@/lib/shortlist";

export async function MovieHero({ movieOfTheWeek }) {
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";
  return (
    <div className="rounded-md flex flex-row justify-center">
    <div className="card md:w-6/12 md:card-side bg-transparent" >
      <figure style={{
      filter: `drop-shadow(0 0px 20px rgba(255,255, 255, 0.25)) drop-shadow(0 0px 65px rgba(255,255, 255, 0.1))`
    }}>
        <img
          src={`http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`}
          alt="Album"
          className="rounded-xl m-5 md:w-10/12"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{movieOfTheWeek?.original_title}</h2>
        <p className="text-sm">{movieOfTheWeek?.overview}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Listen</button>
        </div>
      </div>
    </div>
    </div>
  );
}

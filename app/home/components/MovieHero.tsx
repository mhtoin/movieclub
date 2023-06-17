import { getChosenMovie } from "@/lib/shortlist";

export async function MovieHero() {
  const movieOfTheWeek = await getChosenMovie();
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";
  return (
    <div className="card lg:w-6/12 shadow-xl image-full">
      <figure>
        <img src={backgroundPath} alt="Shoes" />
      </figure>
      <div className="card-body backdrop-blur-lg">
        <h2 className="card-title">{movieOfTheWeek?.title}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

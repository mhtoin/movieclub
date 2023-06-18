export default function MoviePosterCard({movieOfTheWeek}) {
  return (
    <div className="">
      <div className="blur-md">
        <img
          src={`http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`}
          alt="Album"
          className="rounded-xl m-5"
        />
      </div>
    </div>
  );
}

import MoviePosterCard from "@/app/components/MoviePosterCard";

export default function SearchResultGrid({ data }: { data: Array<TMDBMovie> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center gap-10 z-40">
      {data.map((movie) => {
        return <MoviePosterCard key={movie.id} movie={movie} added={false} />;
      })}
    </div>
  );
}

import { getAllMoviesOfTheWeek, getMovie } from "@/lib/movies/movies";
import MovieCard from "../components/MovieCard";
import { getTierlist } from "@/lib/tierlists";
import { validateRequest } from "@/lib/auth";

async function staticParams() {
  const movies = await getAllMoviesOfTheWeek();

  return movies.map((movie) => ({
    id: movie.id,
  }));
}

// fix "dynamic server usage" errors in dev mode by turning off static generation and forcing dynamic rendering
export const generateStaticParams =
  process.env.NODE_ENV === "production" ? staticParams : undefined;
export const dynamic =
  process.env.NODE_ENV === "production" ? "auto" : "force-dynamic";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  const { user } = await validateRequest();
  const tierlist = await getTierlist(user?.id ?? "");

  if (movie) {
    return (
      <div className="flex flex-col items-center justify-normal p-10 gap-10">
        <MovieCard movie={movie} tierlist={tierlist} user={user} />
      </div>
    );
  }
}

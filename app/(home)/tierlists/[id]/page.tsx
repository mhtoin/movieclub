import { getTierlist, getTierlists } from "@/lib/tierlists";
import { getMoviesOfTheWeek } from "@/lib/movies/movies";
import { validateRequest } from "@/lib/auth";
import TierContainer from "./components/TierContainer";

async function staticParams() {
  const tierlists = await getTierlists();

  return tierlists.map((tierlist) => ({
    id: tierlist.userId,
  }));
}

// fix "dynamic server usage" errors in dev mode by turning off static generation and forcing dynamic rendering
export const generateStaticParams =
  process.env.NODE_ENV === "production" ? staticParams : undefined;
export const dynamic =
  process.env.NODE_ENV === "production" ? "auto" : "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const { user, session } = await validateRequest();
  const tierlist = await getTierlist(params.id);
  const moviesOfTheWeek = await getMoviesOfTheWeek();

  const tierlistMovies = tierlist
    ? tierlist.tiers.flatMap((tier) => tier.movies.map((movie) => movie.title))
    : [];

  const unrankedMovies = moviesOfTheWeek.filter((movie) => {
    const movieInList = tierlistMovies.includes(movie.title);
    return !movieInList;
  }) as unknown as MovieOfTheWeek[];
  const authorized = params.id === user?.id;
  return (
    <div className="flex flex-col items-center gap-5 pt-20 px-2 overflow-scroll">
      <TierContainer
        tierlist={tierlist}
        authorized={authorized}
        unranked={unrankedMovies}
      />
    </div>
  );
}

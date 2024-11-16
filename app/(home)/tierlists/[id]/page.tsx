import { getTierlist, getTierlists } from "@/lib/tierlists";
import { getMoviesOfTheWeek } from "@/lib/movies/movies";
import { validateRequest } from "@/lib/auth";
import TierContainer from "./components/TierContainer";
import { getQueryClient } from "@/lib/getQueryClient";
async function staticParams() {
  const tierlists = await getTierlists();
  console.log("tierlists", tierlists);

  return tierlists.map((tierlist) => ({
    id: tierlist.id,
  }));
}

// fix "dynamic server usage" errors in dev mode by turning off static generation and forcing dynamic rendering
export const generateStaticParams =
  process.env.NODE_ENV === "production" ? staticParams : undefined;
export const dynamic =
  process.env.NODE_ENV === "production" ? "auto" : "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const { user, session } = await validateRequest();
  const queryClient = getQueryClient();
  const tierlist = await getTierlist(params.id);
  console.log("tierlist", tierlist);
  const moviesOfTheWeek = await getMoviesOfTheWeek();
  queryClient.setQueryData(["tierlists", params.id], tierlist);

  const tierlistMovies = tierlist
    ? tierlist.tiers.flatMap((tier) => tier.movies.map((movie) => movie.title))
    : [];

  const unrankedMovies = moviesOfTheWeek.filter((movie) => {
    const movieInList = tierlistMovies.includes(movie.title);
    return !movieInList;
  }) as unknown as MovieOfTheWeek[];

  const allDates = moviesOfTheWeek.map((movie) => movie.watchDate);
  const allYears = [...new Set(allDates.map((date) => date!.split("-")[0]))];
  allYears.unshift(`${allYears[allYears.length - 1]}-${allYears[0]}`);

  const authorized = tierlist.userId === user?.id;
  console.log("authorized", authorized);
  return (
    <div className="flex flex-col gap-10 md:gap-5 py-20 items-center">
      <TierContainer
        tierlist={tierlist}
        authorized={authorized}
        allYears={allYears}
      />
    </div>
  );
}

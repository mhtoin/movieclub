import { getTierlist, getTierlists } from "@/lib/tierlists";
import { getAllMoviesOfTheWeek } from "@/lib/movies";
//import { getServerSession } from "@/lib/getServerSession";
import TierContainer from "./components/TierContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  const session = await getServerSession(authOptions);
  const tierlist = await getTierlist(params.id);
  const moviesOfTheWeek = await getAllMoviesOfTheWeek();

  const tierlistMovies = tierlist
    ? tierlist.tiers.flatMap((tier) => tier.movies.map((movie) => movie.title))
    : [];

 
  const unrankedMovies = moviesOfTheWeek.filter((movie) => {
    const movieInList = tierlistMovies.includes(movie.title);
    return !movieInList;
  }) as unknown as MovieOfTheWeek[];
  const authorized = params.id === session?.user.userId;
  return (
    <div className="flex flex-col items-center gap-5">
      <TierContainer tierlist={tierlist} authorized={authorized} unranked={unrankedMovies}/>
    </div>
  );
}

import { getTierlist, getTierlists } from "@/lib/tierlists";
import TierAdd from "./components/TierAdd";
import { contains, difference, includes, intersection } from "underscore";
import { getAllMoviesOfTheWeek } from "@/lib/movies";
import { getServerSession } from "@/lib/getServerSession";
import Link from "next/link";

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
  const session = await getServerSession()
  const tierlist = await getTierlist(params.id);
  const moviesOfTheWeek = await getAllMoviesOfTheWeek()

  const tierlistMovies = tierlist
    ? tierlist.tiers.flatMap((tier) => tier.movies.map(movie => movie.title))
    : [];
  
  console.log('tierlistmovies', tierlistMovies)
  const unrankedMovies = moviesOfTheWeek.filter((movie) => {
    const movieInList = contains(tierlistMovies, movie.title)
    console.log(movie.title, movieInList)
    return !movieInList
  });
 
  return (
    <div className="flex flex-col items-center">
      {params.id === session?.user.userId && <TierAdd movies={unrankedMovies} tierlist={tierlist} />}
      {tierlist?.tiers.map((tier) => {
        return (
          <>
            <div className="divider">{tier.label}</div>
            <div className="flex flex-row gap-5">
            {tier?.movies?.map((movie) => {
              console.log(movie);
              return (
                <>
                  <div className="indicator mx-auto border-2 rounded-md">
                    <Link
                      href={`/home/movies/${movie.id}`}
                      
                    >
                      <img
                        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
                        alt=""
                        width={"150"}
                      />
                    </Link>
                  </div>
                </>
              );
            })}
            </div>
          </>
        );
      })}
    </div>
  );
}

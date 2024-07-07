import { getStatistics } from "@/lib/movies/movies";
import Bar from "./components/Bar";
import Stats from "./components/Stats";
import Link from "next/link";
import { Button } from "../components/ui/Button";

export default async function Dashboard() {
  const moviesByUser = await getStatistics();
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-2xl">Statistics</h1>
      <Link href={"/dashboard/simulate"}>
        <Button>Simulate draw</Button>
      </Link>
      <Stats chartData={moviesByUser} />
      <Bar chartData={moviesByUser} />
    </div>
  );
}

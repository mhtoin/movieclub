import { getStatistics } from "@/lib/movies";
import Bar from "./components/Bar";
import Stats from "./components/Stats";
import Link from "next/link";

export default async function Dashboard() {
    const moviesByUser = await getStatistics()
    console.log('data for chart', moviesByUser)
    return (
        <div className="flex flex-col items-center gap-5">
            <h1 className="text-2xl">Statistics</h1>
            <Link href={'/dashboard/simulate'}><button className="btn">Simulate draw</button></Link>
            <Stats chartData={moviesByUser}/>
            <Bar chartData={moviesByUser} />
        </div>
    )
}
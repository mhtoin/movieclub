import { getStatistics } from "@/lib/movies"
import SimulationContainer from "../components/SimulationContainer"

export default async function Page() {
    const moviesByUser = await getStatistics()
    return (
        <div className="flex flex-col items-center gap-5">
            Simulate
            <SimulationContainer chartData={moviesByUser}/>
        </div>
    )
}
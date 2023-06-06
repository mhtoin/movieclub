export default function ShortList() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
        <div className="flex flex-row items-center justify-evenly gap-5">
            <button className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3 ">
                Edit my entries
            </button>
            <button className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3 ">
                Raffle
            </button>
        </div>
        <div className="relative flex place-items-center">
        Short list of movie candidates
      </div>
      </main>
    )
}
import { getCurrentSession } from '@/lib/authentication/session'
import { getWatchedMovies } from '@/lib/movies/movies'
import { getUsers } from '@/lib/user'
import { groupBy } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/')
  }

  const users = await getUsers()
  const watchedMovies = await getWatchedMovies()
  const moviesGroupedByUser = groupBy(watchedMovies, (movie) => {
    const movieObject = movie
    return movieObject?.user?.name
  })

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-5 px-2 py-20">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-2xl">Dashboard</h1>
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-xl">Total movies watched:</h2>
          <p className="text-2xl">{watchedMovies.length}</p>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 rounded-md border p-5">
          {Object.keys(moviesGroupedByUser).map((user) => (
            <div
              key={user}
              className="flex min-w-[200px] flex-col items-center gap-5 rounded-md border p-5"
            >
              <div>
                <img
                  src={users.find((u) => u.name === user)?.image}
                  alt={user}
                  className="h-14 w-14 rounded-full"
                />
              </div>
              <h2 className="text-xl font-bold">{user}</h2>
              <p className="text-2xl">
                {`${moviesGroupedByUser[user].length} (${(
                  (moviesGroupedByUser[user].length / watchedMovies.length) *
                  100
                ).toFixed(2)}%)`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

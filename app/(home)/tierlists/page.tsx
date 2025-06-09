import { getUsers } from "@/lib/user"
import { getCurrentSession } from "lib/authentication/session"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Tierlists() {
  const { user } = await getCurrentSession()
  if (!user) {
    redirect("/")
  }
  const allTierlists = await getUsers()

  return (
    <div className="flex flex-col items-center gap-10 pt-20">
      <h1 className="text-2xl font-bold">Tierlists</h1>

      <div className="grid grid-cols-2 gap-10">
        {allTierlists.map((tierlist) => {
          return (
            <div
              className="flex flex-col items-center gap-2 rounded-xl border p-2"
              key={tierlist.id}
            >
              <span className="text-sm font-bold">{tierlist.name}</span>
              <Link href={`/tierlists/${tierlist.id}`}>
                <div className="overflow-hidden rounded-md border">
                  <div className="w-24">
                    <img src={tierlist.image} alt="user" />
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

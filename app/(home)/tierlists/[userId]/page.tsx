import { CreateDialog } from "@/components/tierlist/CreateDialog"
import TierlistCard from "@/components/tierlist/TierlistCard"
import { getCurrentSession } from "@/lib/authentication/session"
import { getUserTierlists } from "@/lib/tierlists"

export default async function TierlistPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const { user } = await getCurrentSession()
  const tierlists = await getUserTierlists(userId)
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Tierlists</h1>
      {userId === user?.id && <CreateDialog />}
      <div className="flex p-5 items-center flex-wrap justify-center w-full max-w-2xl gap-5 overflow-auto ">
        {tierlists.map((tierlist) => (
          <div key={tierlist.id} className="mb-2">
            <TierlistCard tierlist={tierlist} />
          </div>
        ))}
      </div>
    </div>
  )
}

import { CreateDialog } from "@/components/tierlist/CreateDialog"
import TierlistCard from "@/components/tierlist/TierlistCard"
import { Button } from "@/components/ui/Button"
import { getUserTierlists } from "@/lib/tierlists"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function TierlistPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const tierlists = await getUserTierlists(userId)
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Tierlist</h1>
      <CreateDialog />
      <div className="mt-4">
        {tierlists.map((tierlist) => (
          <div key={tierlist.id} className="mb-2">
            <Link
              href={`/tierlists/${userId}/${tierlist.id}`}
              className="text-blue-500 hover:underline"
            >
              <TierlistCard />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

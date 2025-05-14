import { getUserTierlists } from '@/lib/tierlists'
import Link from 'next/link'

export default async function TierlistPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const tierlists = await getUserTierlists(userId)
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Tierlist</h1>
      <p className="text-lg">User ID: {userId}</p>
      <div className="mt-4">
        {tierlists.map((tierlist) => (
          <div key={tierlist.id} className="mb-2">
            <Link
              href={`/tierlists/${userId}/${tierlist.id}`}
              className="text-blue-500 hover:underline"
            >
              {tierlist?.id}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

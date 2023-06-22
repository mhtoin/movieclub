import { getTierlist, getTierlists } from "@/lib/tierlists";
import Link from "next/link";

export async function generateStaticParams() {
  const tierlists = await getTierlists();

  return tierlists.map((tierlist) => ({
    id: tierlist.id,
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
    const tierlist = await getTierlist(params.id)

    return (
        <div className="flex flex-row items-center">
            <div>
                <Link href={'edit'}>Edit</Link>
            </div>
        </div>
    )
}

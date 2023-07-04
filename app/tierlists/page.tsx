import { getServerSession } from "@/lib/getServerSession";
import { getTierlists } from "@/lib/tierlists";
import Link from "next/link";
import { redirect } from "next/navigation";

async function createNew() {
  "use server";
  redirect("/tierlists/create");
}

export default async function Tierlists() {
  const allTierlists = await getTierlists();
  const usersWithTierlist = allTierlists.map((tierlist) => tierlist.userId);
  const session = await getServerSession();

  console.log(allTierlists);
  return (
    <div className="flex flex-col items-center gap-5">
      <div>Tierlists</div>
      <div>
        {!usersWithTierlist.includes(session?.user.userId) && (
          <form action={createNew}>
            <button className="btn btn-primary" type="submit">
              Create new
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
      <div className="flex flex-col gap-10">
        {allTierlists.map((tierlist) => {
          return (
            <>
            <Link href={`/tierlists/${tierlist.userId}`}>
              <div className="avatar">
                <div className="w-24 mask mask-heart">
                  <img src={tierlist.user?.image}/>
                </div>
              </div>
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
}

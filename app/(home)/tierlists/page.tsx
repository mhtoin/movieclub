import { Button } from "@/app/components/ui/Button";
import { validateRequest } from "@/lib/auth";
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
  const { user } = await validateRequest();

  return (
    <div className="flex flex-col items-center gap-10 pt-20">
      <h1 className="text-2xl font-bold">Tierlists</h1>
      <div>
        {!usersWithTierlist.includes(user?.id || "") && (
          <form action={createNew}>
            <Button variant="outline" type="submit">
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
            </Button>
          </form>
        )}
      </div>
      <div className="grid grid-cols-2 gap-10">
        {allTierlists.map((tierlist) => {
          return (
            <div
              className="border rounded-xl p-2 flex flex-col items-center gap-2"
              key={tierlist.id}
            >
              <span className="text-sm font-bold">{tierlist.user?.name}</span>
              <Link href={`/tierlists/${tierlist.id}`}>
                <div className="border rounded-md overflow-hidden">
                  <div className="w-24">
                    <img src={tierlist.user?.image} alt="user" />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

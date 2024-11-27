import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "components/ui/Button";
import Link from "next/link";
import { getCurrentSession } from "@/lib/authentication/session";

export default async function Home() {
  const { user, session } = await getCurrentSession();

  if (user) {
    redirect("/home");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Movie Club
        </h1>
        <Button asChild variant={"outline"}>
          <Link href={"/login/discord"}>Login with Discord</Link>
        </Button>
      </div>
    </div>
  );
}

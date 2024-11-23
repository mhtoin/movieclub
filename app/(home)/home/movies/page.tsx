import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";

export default async function MoviesPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }
  return <div className="flex flex-col items-center"></div>;
}

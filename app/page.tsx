//import { getServerSession } from "@/lib/deprecated_getServerSession";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";


export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    redirect('/home')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
    </main>
  );
}

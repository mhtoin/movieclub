import { getServerSession } from "@/lib/getServerSession";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await getServerSession();

  const isAuthenticated = !!session;

  if (isAuthenticated) {
    redirect('/home')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
    </main>
  );
}

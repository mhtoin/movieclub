import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function Home() {
  //const session = await getServerSession(authOptions);
  //const isAuthenticated = !!session;
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 no-scrollbar">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome, {user?.username}</h1>
        <p className="text-2xl">You are logged in</p>
      </div>
    </main>
  );
}

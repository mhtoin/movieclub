import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user, session } = await validateRequest();

  if (user) {
    redirect("/home");
  }
  return (
    <div>
      <h1>Welcome to the Movie Club</h1>
    </div>
  );
}

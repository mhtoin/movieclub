import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const { user, session } = await validateRequest();

  console.log("user", user);

  if (!user) {
    return redirect("/login");
  }
  return new Response(JSON.stringify(user), { status: 200 });
}

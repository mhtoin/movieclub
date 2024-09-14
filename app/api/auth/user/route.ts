import { validateRequest } from "@/lib/auth";

export async function GET() {
  const { user, session } = await validateRequest();

  console.log("user", user);

  if (!user) {
    return Response.redirect(new URL("/login"));
  }
  return new Response(JSON.stringify(user), { status: 200 });
}

import { discord, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state");

  if (!code || !state || state !== storedState?.value) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const discordUser: DiscordUser = await discordUserResponse.json();

    const existingUser = await db?.account.findUnique({
      where: {
        provider: "discord",
        providerAccountId: discordUser.id,
      },
      include: {
        user: true,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie?.attributes
      );
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }

    /**
     * TODO: Check with email if user exists
     * Might just be using a different OAUTH provider
     */

    const user = await db?.user.create({
      data: {
        email: discordUser.email ?? "",
        name: discordUser.username,
        image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
      },
    });

    const account = await db?.account.create({
      data: {
        userId: user.id,
        provider: "discord",
        providerAccountId: discordUser.id,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie?.attributes
    );

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

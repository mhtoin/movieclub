import { discord } from "@/lib/authentication/discord";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const scopes = ["identify", "email", "guilds"];
	const url = discord.createAuthorizationURL(state, scopes);

	(await cookies()).set("discord_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}

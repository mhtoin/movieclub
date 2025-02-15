import { discord } from "@/lib/authentication/discord";
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "@/lib/authentication/session";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = cookies();
	const storedState = cookieStore.get("discord_oauth_state")?.value ?? null;

	if (!code || state === null || storedState === null) {
		return new Response(null, { status: 400 });
	}

	if (state !== storedState) {
		return new Response(null, { status: 400 });
	}

	let tokens: OAuth2Tokens;

	try {
		tokens = await discord.validateAuthorizationCode(code);
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 400 });
	}

	const discordUserResponse = await fetch("https://discord.com/api/users/@me", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});

	const discordUserGuildsResponse = await fetch(
		"https://discord.com/api/users/@me/guilds",
		{
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
		},
	);

	const discordUser: DiscordUser = await discordUserResponse.json();
	const discordUserGuilds = await discordUserGuildsResponse.json();

	const allowedGuilds = process.env.DISCORD_ALLOWED_GUILDS;

	if (
		!discordUserGuilds.find((guild: { id: string }) =>
			allowedGuilds?.includes(guild.id),
		)
	) {
		return new Response(null, { status: 403 });
	}

	const existingUser = await db?.account.findUnique({
		where: {
			provider: "discord",
			providerAccountId: discordUser.id,
		},
		include: {
			user: true,
		},
	});

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.userId);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: { Location: "/" },
		});
	}

	const user = await db?.user.create({
		data: {
			email: discordUser.email ?? "",
			name: discordUser.username,
			image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
		},
	});

	const _account = await db?.account.create({
		data: {
			userId: user.id,
			provider: "discord",
			providerAccountId: discordUser.id,
		},
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: { Location: "/" },
	});
}

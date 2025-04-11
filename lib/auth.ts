"server only";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { User as DatabaseUser } from "@prisma/client";
import { Discord } from "arctic";
import { Lucia, type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.name,
			email: attributes.email,
			accountId: attributes.accountId,
			image: attributes.image,
			shortlistId: attributes.shortlistId,
			sessionId: attributes.sessionId,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, "id">;
	}
}

export const discord = new Discord(
	process.env.DISCORD_CLIENT_ID ?? "",
	process.env.DISCORD_CLIENT_SECRET ?? "",
	process.env.DISCORD_REDIRECT_URI ?? "",
);

export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return { user: null, session: null };
		}

		const result = await lucia.validateSession(sessionId);
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				(await cookies()).set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				(await cookies()).set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
		} catch (_error) {}
		return result;
	},
);

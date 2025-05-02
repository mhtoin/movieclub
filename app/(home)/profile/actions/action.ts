"use server";
import { getCurrentSession } from "@/lib/authentication/session";
import { updateUser } from "@/lib/user";
import type { User } from "@prisma/client";

export async function saveProfile(user: User) {
	const { user: userFromRequest } = await getCurrentSession();

	if (!userFromRequest) {
		throw new Error("User not authenticated");
	}
	if (userFromRequest.id !== user.id) {
		throw new Error("User not authorized to update this profile");
	}

	const userId = userFromRequest ? userFromRequest.id : "";

	await updateUser(user, userId);
}

"use server";
import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/lib/user";
import type { User } from "@prisma/client";

export async function saveProfile(user: User) {
	const { user: userFromRequest } = await validateRequest();
	const userId = userFromRequest ? userFromRequest.id : "";

	await updateUser(user, userId);
}

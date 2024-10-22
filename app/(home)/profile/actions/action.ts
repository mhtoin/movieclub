"use server";
import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/lib/user";

export async function saveProfile(user: User) {
  const { user: userFromRequest, session } = await validateRequest();
  const userId = userFromRequest ? userFromRequest.id : "";

  await updateUser(user, userId);
}

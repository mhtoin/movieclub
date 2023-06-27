"use server";
import { getServerSession } from "@/lib/getServerSession";
import { updateUser } from "@/lib/user";

export async function saveProfile(user: User) {
  const session = await getServerSession();
  const userId = session ? session.user.userId : "";

  await updateUser(user, userId);
}

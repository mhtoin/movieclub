"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
//import { getServerSession } from "@/lib/getServerSession";
import { updateUser } from "@/lib/user";
import { getServerSession } from "next-auth";

export async function saveProfile(user: User) {
  const session = await getServerSession(authOptions);
  const userId = session ? session.user.userId : "";

  await updateUser(user, userId);
}

"use server";

import { cookies } from "next/headers";

export async function createDevCookie(name: string, value: string) {
  cookies().set(name, value);
}

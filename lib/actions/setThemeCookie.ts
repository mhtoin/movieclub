"use server";

import { cookies } from "next/headers";

export async function createThemeCookie(name: string, value: string) {
  cookies().set(name, value);
}

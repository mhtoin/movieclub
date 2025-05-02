'use server'

import { cookies } from 'next/headers'

export async function createDevCookie(name: string, value: string) {
  ;(await cookies()).set(name, value)
}

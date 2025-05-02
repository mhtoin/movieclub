import { updateUser } from '@/lib/user'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params
  const body = await request.json()
  const res = await updateUser(body, params.userId)

  return NextResponse.json(res)
}

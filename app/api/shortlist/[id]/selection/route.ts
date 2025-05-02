import { updateShortlistSelection } from '@/lib/shortlist'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params
  const { selectedIndex } = await request.json()
  const res = await updateShortlistSelection(selectedIndex, params.id)

  return NextResponse.json(res)
}

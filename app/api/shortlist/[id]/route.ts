import {
  addMovieToShortlist,
  getShortList,
  removeMovieFromShortlist,
} from '@/lib/shortlist'
import type { ShortlistWithMovies } from '@/types/shortlist.type'
import type { TMDBMovieResponse } from '@/types/tmdb.type'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ShortlistWithMovies | { ok: false; message: string }>> {
  const params = await props.params
  try {
    const id = params.id
    const shortlist = await getShortList(id)
    if (!shortlist) {
      return NextResponse.json(
        { ok: false, message: 'Shortlist not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(shortlist, { status: 200 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 },
      )
    }
  }

  return NextResponse.json(
    { ok: false, message: 'Something went wrong!' },
    { status: 500 },
  )
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params
  try {
    const id = params.id
    const { movie }: { movie: TMDBMovieResponse } = await request.json()
    const updatedShortlist = await addMovieToShortlist(movie, id)

    revalidatePath('/home/shortlist')
    return NextResponse.json(updatedShortlist)
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 },
      )
    }
  }

  return NextResponse.json(
    { ok: false, message: 'Something went wrong!' },
    { status: 500 },
  )
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params
  const body = await request.json()
  const movieId = body.movieId
  const res = await removeMovieFromShortlist(movieId, params.id)

  return NextResponse.json(res)
}

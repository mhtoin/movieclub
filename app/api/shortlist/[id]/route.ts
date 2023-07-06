import { NextRequest, NextResponse } from "next/server";
import { addMovieToShortlist, getShortList, removeMovieFromShortlist } from "@/lib/shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    let shortlist = await getShortList(id);
    return NextResponse.json(shortlist);
  } catch (e) {
    console.log(e);
  }
}

export async function POST(
  request: Request,
  { params }: { params: {id: string}}
) {
  try {
    const id = params.id
    let body = await request.json()
    let updatedShortlist = await addMovieToShortlist(body.movie, id)

    revalidatePath('/home/shortlist')
    return NextResponse.json(updatedShortlist)

  } catch (e) {
    console.log(e)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body = await request.json()
  const movieId = body.movieId

  console.log('updating', movieId, params.id)
  let res = await removeMovieFromShortlist(movieId, params.id)

  return NextResponse.json(res)

}

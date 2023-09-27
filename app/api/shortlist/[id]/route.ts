import { NextRequest, NextResponse } from "next/server";
import {
  addMovieToShortlist,
  getShortList,
  removeMovieFromShortlist,
} from "@/lib/shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('getting shortlist', id)
    let shortlist = await getShortList(id);
    console.log('got shortlist', shortlist)
    return NextResponse.json(shortlist, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ ok: false, message: "Something went wrong!" }, { status: 500 });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    let body = await request.json();
    let updatedShortlist = await addMovieToShortlist(body.movie, id);

    revalidatePath("/home/shortlist");
    return NextResponse.json(updatedShortlist);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ ok: false, message: "Something went wrong!" }, { status: 500 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body = await request.json();
  const movieId = body.movieId;
  let res = await removeMovieFromShortlist(movieId, params.id);

  return NextResponse.json(res);
}

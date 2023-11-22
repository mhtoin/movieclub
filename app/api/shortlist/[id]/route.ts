import { NextRequest, NextResponse } from "next/server";
import {
  addMovieToShortlist,
  getShortList,
  removeMovieFromShortlist,
} from "@/lib/shortlist";
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    let shortlist = await getShortList(id);
    return NextResponse.json(shortlist, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 }
  );
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    let body = await request.json();
    let updatedShortlist = await addMovieToShortlist(body.movie, id).catch(
      (e) => {
        console.log("e is", e);
        throw new Error(e.message);
      }
    );

    console.log("updatedShortlist", updatedShortlist);
    revalidatePath("/home/shortlist");
    return NextResponse.json(updatedShortlist);
  } catch (e) {
    if (e instanceof Error) {
      console.log("caught error", e.message);
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 }
  );
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

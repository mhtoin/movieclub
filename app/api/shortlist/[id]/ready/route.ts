
import { updateShortlistState } from "@/lib/shortlist";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
  
    let { isReady } = await request.json();
    let res = await updateShortlistState(isReady, params.id);
    //const movieId = body.movieId;
    //let res = await removeMovieFromShortlist(movieId, params.id);
  
    return NextResponse.json(res);
  }
  
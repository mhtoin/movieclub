import { updateShortlistState } from "@/lib/shortlist";
import type { Shortlist } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
): Promise<NextResponse<Shortlist>> {
	const { isReady } = await request.json();
	const res = await updateShortlistState(isReady, params.id);
	//const movieId = body.movieId;
	//let res = await removeMovieFromShortlist(movieId, params.id);

	return NextResponse.json(res);
}
